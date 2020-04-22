import { observable } from 'mobx';
import { IGitNamespace } from '../api/interfaces';

export default class StudentRepo {
  @observable readonly id: string;
  @observable user_id: number | null;
  @observable name: string;
  @observable ssh_url: string;
  @observable namespace: IGitNamespace;
  constructor (
    id: string,
    user_id: number | null,
    name: string,
    ssh_url: string,
    namespace: IGitNamespace
  ) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this. ssh_url = ssh_url;
    this.namespace = namespace;
  }
}