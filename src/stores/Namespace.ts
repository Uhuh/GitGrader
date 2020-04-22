import { observable } from 'mobx';

export default class Namespace {
  @observable readonly id: string;
  @observable name: string;
  @observable path: string;
  constructor (
    id: string,
    name: string,
    path: string
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
  }
}