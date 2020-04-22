import { observable } from 'mobx';

export default class CanvasCourse {
  @observable readonly id: string;
  @observable name: string;
  @observable total_students: string;
  constructor (
    id: string,
    name: string,
    total_students: string,
  ) {
    this.id = id;
    this.name = name;
    this.total_students = total_students;
  }
}