import { observable, IObservableArray } from 'mobx';
import { ICanvasNamespace } from '../api/interfaces';
import { GitLabAPI, CanvasAPI } from '../app';

export class RelationStore {
  @observable relations: IObservableArray<ICanvasNamespace> = observable.array();

  loadData = async () => {
    const storedRelations = JSON.parse(localStorage.getItem('relations') || 'null');
    const namespaces = await GitLabAPI.getNamespaces();
    const classes = await CanvasAPI.getClasses();

    for(const c of classes) {
      if(storedRelations[c.id]) {
        const info = storedRelations[c.id];
        const n = namespaces.find(n => n.id == info.gitlabID);
        // IF the namespace isn't there.. then ignore.
        if (!n) {
          continue;
        }
      
        this.relations.push({
          ...c,
          section: info.section,
          namespace: {
            id: n.id,
            name: n.name,
            path: n.path
          }
        });
      }
    }
  }

  add = (
    canvasID: string, 
    section: string, 
    gitlabID: string
  ) => {
    const rel = this.get(canvasID);

    if(rel) {
      return;
    }

    const temp = JSON.parse(localStorage.getItem('relations') || '{}');
    temp[canvasID] = {
      canvasID: canvasID, 
      section: section, 
      gitlabID: gitlabID
    };
    localStorage.setItem('relations', JSON.stringify(temp));
  }

  removeRelation = () =>{
    /**
     * Find out
     */
  }

  all = () => Array.from(this.relations.values());

  get = (course_id: string) => {
    return this.relations.find(r => r.id == course_id);
  }
}

export default new RelationStore();