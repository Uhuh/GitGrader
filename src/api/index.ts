import axios, { AxiosRequestConfig } from 'axios';
import * as canvas from 'canvas-api';

interface IGitlab {
  gitlab_token: string;
  gitlab_host: string;
  namespace: string;
}

interface ICanvas {
  canvas_token: string;
  canvas_url: string;
}

interface ITokens extends IGitlab, ICanvas {}

interface IStudentInfo {
  user_id: string;
  user_name: string;
  class_section: string;
  [key: string]: string;
}

interface IRepoInfo {
  students: IStudentInfo[];
  semester: string;
  namespace: string;
}

enum GitAccess {
  guest = 10,
  reporter = 20,
  developer = 30,
  master = 40,
  owner = 50
}

// Gitlab API values for repo visibility
enum GitVisibility {
  private = 0,
  internal = 10,
  public = 20
}

export class API {
  private gitlab: GitlabBackend;
  private canvas: CanvasBackend;

  constructor (private info: ITokens) {
    this.gitlab = new GitlabBackend({ ...info });
    this.canvas = new CanvasBackend();
  }
  canvas_api = {
    getClasses: (/* User token? */) => {},
    getStudents: (class_id: string) => {}
  };
  git_api = {
    createAssignment: (assignment: string) => {
      // Below is for testing purposes...
      this.gitlab
        .request('/namespaces', 'GET', { search: this.info.namespace })
        .then(res => {
          console.log(res);
          if (!res) { 
            return console.log('No namespace found?'); 
          }
        })
        .catch();
    },
    assignAssignment: (assignment: string, user_data: IRepoInfo) => {},
    archiveAssignment: (assignment: string) => {},
    lockAssignment: (assignment: string) => {}
  };
}

class GitlabBackend {
  constructor (private info: IGitlab) {}
  request = async (
    path: string,
    method: AxiosRequestConfig['method'],
    params: {}
  ) => {
    const url = `${this.info.gitlab_host}/api/v4/${path}`;
    return (
      await axios({
        method,
        url,
        headers: { 'Private-Token': this.info.gitlab_token },
        params
      })
    ).data;
  }
}

class CanvasBackend {

}