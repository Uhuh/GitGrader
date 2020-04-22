import { observable, ObservableMap } from 'mobx';
import { IRepo } from '../api/interfaces';
import { GitLabAPI, CanvasAPI } from '../modules';
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
        
        console.log(`Loading ${c.id} : ${n.name} : ${usernames}`);
        console.log('Repos: ');
        console.log(repos.base_repos);
        this.repos.set(n.id, repos.base_repos.map(r => new BaseRepo(
          r.id, r.name, r.ssh_url, r.created_at, n
        )));

        this.usernames.set(c.id, usernames);

        this.count++;
      }
    }
  }

  addRepos = (
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

  createRepo = (
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
  getRepos = (n_id: string) => {
    return this.repos.get(n_id);
  }

  deleteRepo = (
    repo_id: string,
    namespace_id: string
  ) => {
    /**
     * Do this eventually
     */
  }

  counter = () => this.count;
}

export default new BaseRepoStore();