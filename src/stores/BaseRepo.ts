import { observable } from 'mobx';
import { GitLabAPI } from '../app';
import { IGitNamespace } from '../api/interfaces';

export default class BaseRepo {
  @observable readonly id: string;
  @observable name: string;
  @observable ssh_url: string;
  @observable created_at: string;
  @observable namespace: IGitNamespace;
  // user gitlab id -> assignment id
  @observable
  user_to_ass_id!: Map<string, string>;
  // username -> gitlab id
  username_to_git_id: Map<string, string>;
  constructor (
    id: string,
    name: string,
    ssh_url: string,
    created_at: string,
    namespace: IGitNamespace,
    user_ass_id?: Map<string, string>,
    username_to_git_id?: Map<string, string>
  ) {
    this.id = id;
    this.name = name;
    this.ssh_url = ssh_url;
    this.created_at = created_at;
    this.namespace = namespace;
    
    if(user_ass_id && user_ass_id.size) {
      this.user_to_ass_id = user_ass_id;
    } else {
      this.user_to_ass_id = new Map();
    }

    if(username_to_git_id && username_to_git_id.size) {
      this.username_to_git_id = username_to_git_id;
    } else {
      this.username_to_git_id = new Map();
    }
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
    GitLabAPI.create(
      this, this.namespace, section, semester, username
    )
      .then(async (ass) => {
        // Save for assignment later.
        const user_id = this.username_to_git_id.get(username);
        if(!user_id) {
          return;
        }
        this.user_to_ass_id.set(user_id, ass.id);
      })
      .catch(console.error);
    
    return;
  }

  assign = async (): Promise<boolean> => {
    if (!this.user_to_ass_id || !this.user_to_ass_id.size) {
      return new Promise(res => res(false));
    }

    for(const username of Array.from(this.user_to_ass_id.keys())) {
      const id = this.user_to_ass_id.get(username);
      console.log(`Assigning U: ${username} - ID: ${id}`);
      if (!id) {
        continue;
      }

      // Need to await or it'll be too fast for Gitlab
      await GitLabAPI.assign(id, username)
        .then(() => {
          // I want to have a status / loading bar
        })
        .catch((e: any) => {
          console.log(`Failed to assign student`);
          console.error(e);
          return new Promise((_res: any, rej: any) => rej(false));
        });
    }

    return new Promise(res => res(true));
  }

  lock = (user_id: string) => {
    GitLabAPI.lock(this.id, user_id)
      .catch(console.error);
  }

  unlock = (user_id: string) => {
    GitLabAPI.unlock(this.id, user_id)
      .catch(console.error);
  }

  archive = () => {
    GitLabAPI.archive(this.id)
      .then(() => console.log(`Archived ${this.name}`))
      .catch(console.error);
  }
}