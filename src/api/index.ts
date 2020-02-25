import axios, { AxiosRequestConfig } from 'axios';

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

/**
 * Access to repos.
 * reporter = can't push code but can view everything.
 * developer = can push code
 */
enum GitAccess {
  guest = 10,
  reporter = 20,
  developer = 30,
  master = 40,
  owner = 50
}

/**
 * Gitlab API values for repo visibility
 */
enum GitVisibility {
  private = 0,
  internal = 10,
  public = 20
}

/**
 * @class API
 * 
 * @constructor Requires all the tokens to be made to be able to properly setup
 *              Canvas and Gitlab
 */
export class API {
  private gitlab: GitlabBackend;
  private canvas: CanvasBackend;

  constructor (private info: ITokens) {
    this.gitlab = new GitlabBackend({ ...info });
    this.canvas = new CanvasBackend({ ...info });
  }
  canvas_api = {
    /**
     * Uses the users canvas_token to gain access to their courses.
     * 
     * @TODO - figure out how to do TA and teacher efficiently.
     * 
     * @returns Array of courses
     */
    getClasses: (): Promise<any> => {
      return this.canvas
        .request('GET', 'courses', {
          enrollment_type: 'ta',
          enrollment_state: 'active'
        })
        .then(res => res)
        .catch(console.error);
    },
    /**
     * Gets the students in a course
     * @returns Array of students
     */
    getStudents: (course_id: string): Promise<any> => {
      return this.canvas
        .students('GET', course_id)
        .then(console.log)
        .catch(console.error);
    }
  };
  git_api = {
    /**
     * To format assignment names.
     * 
     * @returns A formatted string
     */
    build_name: (sem: string, sec: string, n: string, user: string): string => (
      `${sem}-${sec}-${n}-${user}`
    ),
    /**
     * Creates an assignment within a specific namespace.
     * @returns The git links to clone with.
     */
    createAssignment: (
      name: string,
      namespace_id: string,
      section: string,
      semester: string,
      username: string
    ): Promise<any> => {
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
        .then(res => console.log(`Created project: ${res}`))
        .catch(console.error);
    },
    /**
     * Assigns a single user to a project.
     * 
     * @returns Promise<any> // figure out types
     */
    assignAssignment: (assignment_id: string, user_id: string): Promise<any> => {
      // Find repo that matches unique name then give perms to username...
      const params = {
        'id': assignment_id,
        'user_id': user_id,
        'access_level': GitAccess.developer
      };

      return this.gitlab.request('POST', `/projects/${params.id}/members/${params.user_id}`, params);
    },
    /**
     * Archive project, helps clean users repo list
     */
    archiveAssignment: (assignment_id: string) => {
      return this.gitlab.request('POST', `/projects/${assignment_id}/archive`, {});
    },
    /**
     * Give a user reporter access to a project
     */
    lockAssignment: (assignment_id: string, user_id: string): Promise<any> => {
      const params = {
        'id': assignment_id,
        'user_id': user_id,
        'access_level': GitAccess.reporter
      };

      return this.gitlab.request('PUT', `/projects/${params.id}/members/${params.user_id}`, params);
    },
    /**
     * Give a user developer access to a project.
     */
    unlockAssignment: (assignment_id: string, user_id: string): Promise<any> => {
      const params = {
        'id': assignment_id,
        'user_id': user_id,
        'access_level': GitAccess.developer
      };

      return this.gitlab.request('PUT', `/projects/${params.id}/members/${params.user_id}`, params);
    }
  };
}

/**
 * @class GitlabBackend
 * Allow us access to gitlab's API
 * 
 * @constructor Requires a users private token, (institute) url, and namespace.
 */
class GitlabBackend {
  constructor (private info: IGitlab) {}
  /**
   * @function request - We can access the api with whatever request
   * @param method - Must be 'GET' | 'POST' | 'PUT' | 'DELETE'
   * @param path - A string repesenting the correct ENDPOINT
   *  Example: /projects/:projectid
   * @param params - Query Params
   * 
   * @returns Promise<any> of whatever is expected
   */
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
}

class CanvasBackend {
  constructor (private info: ICanvas) {}
  /**
   * @function request - We can access the api with whatever request
   * @param method - Must be 'GET' | 'POST' | 'PUT' | 'DELETE'
   * @param path - A string repesenting the correct ENDPOINT
   *  Example: /courses/:courseid
   * @param params - Query Params
   * 
   * @returns Promise<any> of whatever is expected
   */
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
  /**
   * @function students - We can get student info with a course id
   *  The reason this is a different function is we only want GET used.
   * @param method - Must be 'GET' | 'POST' | 'PUT' | 'DELETE'
   * @param course_id - The canvas course id
   * 
   * @returns Promise<any> of whatever is expected
   */
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
