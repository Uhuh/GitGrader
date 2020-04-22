import { observable } from 'mobx';
import { GitLabAPI } from '../modules';
import { IGitNamespace } from '../api/interfaces';

export default class BaseRepo {
  @observable readonly id: string;
  @observable name: string;
  @observable ssh_url: string;
  @observable created_at: string;
  @observable namespace: IGitNamespace;
  @observable user_to_ass_id: Map<string, string>;
  constructor (
    id: string,
    name: string,
    ssh_url: string,
    created_at: string,
    namespace: IGitNamespace
  ) {
    this.id = id;
    this.name = name;
    this.ssh_url = ssh_url;
    this.created_at = created_at;
    this.namespace = namespace;
    this.user_to_ass_id = new Map();
  }

  /**
   * Creates a repo for a student
   */
  createAssignment = async (
    section: string,
    semester: string,
    username: string
  ) => {
    /**
     * @TODO Store student repos based on this repo.
     */
    GitLabAPI.createAssignment(
      this, this.namespace, section, semester, username
    )
      .then(ass => {
        // Save for assignment later.
        this.user_to_ass_id.set(username, ass.id);
      })
      .catch(console.error);
    
    return;
  }

  assign = async (): Promise<boolean> => {
    if (!this.user_to_ass_id.size) {
      return new Promise(res => res(false));
    }

    for(const username of Array.from(this.user_to_ass_id.keys())) {
      const id = this.user_to_ass_id.get(username);
      if (!id) {
        continue;
      }

      // Need to await or it'll be too fast for Gitlab
      await GitLabAPI.assignAssignment(id, username)
        .then(() => {
          // I want to have a status / loading bar
        })
        .catch((e: any) => {
          console.error(e);
          return new Promise((_res: any, rej: any) => rej(false));
        });
    }

    return new Promise(res => res(true));
  }

  lock = (user_id: string) => {
    GitLabAPI.lockAssignment(this.id, user_id)
      .catch(console.error);
  }

  unlock = (user_id: string) => {
    GitLabAPI.unlockAssignment(this.id, user_id)
      .catch(console.error);
  }

  archive = () => {
    GitLabAPI.archiveAssignment(this.id)
      .then(() => console.log(`Archived ${this.name}`))
      .catch(console.error);
  }
}