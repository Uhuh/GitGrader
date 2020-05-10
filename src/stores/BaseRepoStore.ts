import { observable, ObservableMap } from 'mobx';
import { IRepo, ICanvasClass } from '../api/interfaces';
import { GitLabAPI, CanvasAPI } from '../app';
import BaseRepo from './BaseRepo';

export class BaseRepoStore {
  @observable repos: ObservableMap<string, BaseRepo[]> = observable.map();
  ns_to_username_to_git_id: Map<string, Map<string, string>>;

  constructor () {
    this.ns_to_username_to_git_id = new Map();
  }

  loadData = async (classes: ICanvasClass[]) => {
    const relations = JSON.parse(localStorage.getItem('relations') || 'null');
    const namespaces = await GitLabAPI.getNamespaces();

    for(const c of classes) {
      if(relations[c.id]) {
        const info = relations[c.id];
        const n = namespaces.find(n => n.id == info.gitlabID);
        if (!n) {
          continue;
        }

        const repos = await GitLabAPI.getRepos(n.id);
        const usernames = (await CanvasAPI.getStudents(c.id)).map(s => s.sis_user_id);
        const baseRepos: BaseRepo[] = [];
        const username_to_git_id = new Map();
        
        for(const b of repos.base_repos) {
          const user_to_id = new Map();
          if(repos.user_to_ass_id) {
            // base repo name -> [username, repo_id]
            const users = repos.user_to_ass_id.get(b.name);
            
            // If there are known user repos this represents [username, repo_id];
            if(users) {
              for(const u of users) {
                const user_id = username_to_git_id.get(u[0]);
                if (user_id) {
                  const repo_info = users.find(us => us[0] === u[0]);
                  const id = repo_info ? repo_info[1] : undefined;
                  if(!id) {
                    // Shouldn't happen but check anyway.
                    return;
                  }
                  user_to_id.set(id, user_id);
                } else {
                  await GitLabAPI.getUser(u[0])
                  .then(user => {
                    const repo_info = users.find(u => u[0] === user.username);
                    const id = repo_info ? repo_info[1] : undefined;
                    if(!id) {
                      // Shouldn't happen but check anyway.
                      return;
                    }
                    username_to_git_id.set(user.username, user.id);
                    user_to_id.set(user.id, id);
                  })
                  .catch(console.error);
                }
              }
            } 
            // Otherwise just get git id's from canvas usernames.
            else {
              for(const u of usernames) {
                const user_id = username_to_git_id.get(u);
                if (!user_id) {
                  await GitLabAPI.getUser(u)
                  .then(user => {
                    username_to_git_id.set(user.username, user.id);
                  })
                  .catch(console.error);
                }
              }
            }
          }
          baseRepos.push(new BaseRepo(
            b.id, b.name, b.ssh_url, b.created_at, b.namespace, user_to_id, username_to_git_id
          ));
          this.repos.set(n.id, baseRepos);
          this.ns_to_username_to_git_id.set(n.id, username_to_git_id);
        }
      }
    }
  }

  add = (
    namespace_id: string,
    base_repos: IRepo[]
  ) => {
    const repos = base_repos.map(
      b => new BaseRepo(b.id, b.name, b.ssh_url, b.created_at, b.namespace)
    );
    this.repos.set(namespace_id, repos);
  }

  create = async (
    name: string,
    namespace_id: string
  ) => {
    const u_to_g_id = this.ns_to_username_to_git_id.get(namespace_id);

    await GitLabAPI
      .createBaseRepo(name, namespace_id)
      .then(repo => {
        const repos = this.repos.get(namespace_id) || [];
        const newRepo = new BaseRepo(
          repo.id, repo.name, repo.ssh_url, repo.created_at, repo.namespace, new Map(), u_to_g_id
        );
        this.repos.set(namespace_id, [...repos, newRepo]);
        console.log(`Created: ${name}`);
      })
      .catch(console.error);
  }

  /**
   * namespace id required
   */
  get = (n_id: string) => {
    return this.repos.get(n_id);
  }

  delete = (
    repo: BaseRepo
  ) => {
    GitLabAPI.remove(repo.id)
      .then(() => {
        const repos = this.repos.get(repo.namespace.id) || [];
        const r = repos.find(re => re.id === repo.id);
        if(r) {
          const index = repos.indexOf(r);
          repos.splice(index, 1);
        }
      })
      .catch(console.error);
  }

  nuke = async (
    repo: BaseRepo
  ) => {
    const repo_ids = [repo.id, ...Array.from(repo.user_to_ass_id.values())];

    for(const id of repo_ids) {
      await GitLabAPI.remove(id)
        .then(() => {
          const repos = this.repos.get(repo.namespace.id) || [];
          const r = repos.find(re => re.id === id);
          if(r) {
            const index = repos.indexOf(r);
            repos.splice(index, 1);
          }
        })
        .catch(console.error);
    }
  }
}

export default new BaseRepoStore();