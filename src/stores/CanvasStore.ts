import { IObservableArray, observable, ObservableMap } from 'mobx';
import { ICanvasClass } from '../api/interfaces';
import CanvasCourse from './CanvasCourse';
import CanvasUser from './CanvasUser';

export class CanvasStore {
  @observable classes: IObservableArray<CanvasCourse> = observable.array();
  @observable course_info: ObservableMap<string,
    {
      students: CanvasUser[] | null;
      teachers: CanvasUser[] | null;
    }
  > = observable.map();

  addClasses = (
    classes: ICanvasClass[]
  ) => {
    for (const c of classes) {
      this.classes.push(new CanvasCourse(c.id, c.name, c.total_students));
      this.course_info.set(c.id, { 
        students: null,
        teachers: c.teachers.map(t => new CanvasUser(t.id, t.display_name, ''))
      });
    }
  }

  getStudents = (course_id: string) => {
    const course = this.course_info.get(course_id);

    return course ? course.students : []; 
  }
}

export default new CanvasStore();