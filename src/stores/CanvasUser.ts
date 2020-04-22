import { observable } from 'mobx';

export default class CanvasUser {
  @observable readonly id: string;
  @observable name: string;
  @observable username: string;

  constructor (
    id: string,
    name: string,
    username: string
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
  }
}