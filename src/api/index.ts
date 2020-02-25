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
    this.canvas = new CanvasBackend({ ...info });
  }
  canvas_api = {
    getClasses: () => {
      return this.canvas
        .request('GET', 'courses', {
          enrollment_type: 'ta',
          enrollment_state: 'active'
        })
        .then(res => res)
        .catch(console.error);
    },
    getStudents: (course_id: string) => {
      return this.canvas
        .students('GET', course_id)
        .then(console.log)
        .catch(console.error);
    }
  };
  git_api = {
    // To help enforce formatting.
    build_name: (sem: string, sec: string, n: string, user: string) => (
      `${sem}-${sec}-${n}-${user}`
    ),
    // Creates BUT DOES NOT assign the repo for a user.
    createAssignment: (
      name: string,
      namespace_id: string,
      section: string,
      semester: string,
      username: string
    ) => {
      const params = {
        'name': this.git_api.build_name(semester, section, name, username),
        'namespace_id': namespace_id,
        'issues_enabled': false,
        'merge_requests_enabled': false,
        'builds_enabled': false,
        'wiki_enabled': false,
        'snippets_enabled': true,
        'visibility_level': GitVisibility.private,
      };
      // POST request to gitlab's projects to create a user repo in the selected group. (namespace)
      return this.gitlab
        .request('POST', '/projects', params)
        .then(res => res)
        .catch(console.error);
    },
    assignAssignment: (assignment: string, user_data: IRepoInfo) => {},
    archiveAssignment: (assignment: string) => {},
    lockAssignment: (assignment_id: string, user_id: string) => {
      const params = {
        'id': assignment_id,
        'user_id': user_id,
        'access_level': GitAccess.reporter
      };

      return this.gitlab.edit_member('POST', params)
    }
  };
}

class GitlabBackend {
  constructor (private info: IGitlab) {}
  request = async (
    method: AxiosRequestConfig['method'],
    path: string,
    params: {}
  ): Promise<any> => {
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
  /* 
    This allows us to change user level permissions
    * Such as "lock" / "unlock" repo's for students
  */
  edit_member = async (
    method: AxiosRequestConfig['method'],
    params: { [k: string]: string }
  ): Promise<any> => {
    // id is the assignment id.
    const url = `${this.info.gitlab_host}/api/v4/projects/${params.id}/members/${params.user_id}`;
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
  constructor (private info: ICanvas) {}
  request = async (
    method: AxiosRequestConfig['method'],
    path: string,
    params: { [k: string]: string }
  ): Promise<any> => {
    const url = `${this.info.canvas_url}/api/v1/${path}`;
    params.access_token = this.info.canvas_token;
    return (
      await axios({
        method,
        url,
        params
      })
    ).data;
  }
  students = async (
    method: AxiosRequestConfig['method'],
    course_id: string
  ): Promise<any> => {
    const url = `${this.info.canvas_url}/api/v1/courses/${course_id}/enrollments`;

    if(method !== 'GET') { return Promise.reject('Didn\'t use GET metod'); }
    
    // Currently it sends 10 per request, so limit is 1000 for now.
    return (
      await axios({
        method,
        url,
        params: { access_token: this.info.canvas_token, per_page: 1000 }
      })
    ).data;
  }
}
