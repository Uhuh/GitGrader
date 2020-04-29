import { observable, ObservableMap } from 'mobx';
import { IRepo } from '../api/interfaces';
import { GitLabAPI, CanvasAPI } from '../app';
import BaseRepo from './BaseRepo';

export class BaseRepoStore {
  @observable repos: ObservableMap<string, BaseRepo[]> = observable.map();
  @observable usernames: ObservableMap<string, string[]> = observable.map();
  @observable count: number = 0;

  loadData = async () => {
    const relations = JSON.parse(localStorage.getItem('relations') || 'null');
    const namespaces = await GitLabAPI.getNamespaces();
    const classes = await CanvasAPI.getClasses();

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

        for(const b of repos.base_repos) {
          const user_to_id = new Map();
          if(repos.user_to_ass_id) {
            const users = repos.user_to_ass_id.get(b.name);
            
            if(users) {
              for(const u of users) {
                await GitLabAPI.getUser(u[0])
                  .then(user => {
                    const repo_info = users.find(u => u[0] === user.username);
                    const id = repo_info ? repo_info[1] : undefined;
                    if(!id) {
                      // Shouldn't happen but check anyway.
                      return;
                    }
                    user_to_id.set(user.id, id);
                  })
                  .catch(console.error);
              }
            }
          }
          baseRepos.push(new BaseRepo(
            b.id, b.name, b.ssh_url, b.created_at, b.namespace, user_to_id
            ));
          this.repos.set(n.id, baseRepos);
        }

        this.usernames.set(c.id, usernames);

        this.count++;
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
    this.count++;
  }

  addUsernames = (
    course_id: string,
    usernames: string[]
  ) => {
    this.usernames.set(course_id, usernames);
  }

  create = (
    name: string,
    namespace_id: string
  ) => {
    GitLabAPI
      .createBaseRepo(name, namespace_id)
      .then(repo => {
        const repos = this.repos.get(namespace_id) || [];
        const newRepo = new BaseRepo(
          repo.id, repo.name, repo.ssh_url, repo.created_at, repo.namespace
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
    GitLabAPI.removeAssignment(repo.id)
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

  counter = () => this.count;
}

export default new BaseRepoStore();