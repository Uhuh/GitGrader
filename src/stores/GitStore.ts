import { observable, ObservableMap } from 'mobx';
import { IGitNamespace, IRepo, IStudentRepo } from '../api/interfaces';
import BaseRepo from './BaseRepo';
import Namespace from './Namespace';
import StudentRepo from './StudentRepos';

export class GitStore {
  @observable namespaces: ObservableMap<string, Namespace> = observable.map();
  @observable repos: ObservableMap<string, 
    { 
      base_repos: BaseRepo[]; 
      student_repos: StudentRepo[]; 
    }
  > = observable.map();
  
  addNamespace = (
    namespaces: IGitNamespace[]
  ) => {
    for (const n of namespaces) {
      this.namespaces.set(n.id, new Namespace(n.id, n.name, n.path));
    }
  }

  addRepos = (
    namespace_id: string,
    base_repos: IRepo[],
    student_repos: IStudentRepo[]
  ) => {
    this.repos.set(namespace_id, {
      base_repos: base_repos.map(b => new BaseRepo(b.id, b.name, b.ssh_url, b.created_at, b.namespace)),
      student_repos: student_repos.map(s => new StudentRepo(s.id, s.user_id, s.name, s.ssh_url, s.namespace))
    });
  }

  getNamespaces = () => {
    return this.namespaces.values() || [];
  }

  getNameSpace = (namespace_id: string) => this.namespaces.get(namespace_id);

  getBaseRepos = (namespace_id: string) => {
    const repos = this.repos.get(namespace_id);

    return repos ? repos.base_repos : [];
  }

  getStudentRepos = (namespace_id: string) => {
    const repos = this.repos.get(namespace_id);

    return repos ? repos.student_repos : [];
  }
}

export default new GitStore();