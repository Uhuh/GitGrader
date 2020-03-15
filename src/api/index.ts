import axios, { AxiosRequestConfig } from 'axios';
import {
  GitAccess,
  GitVisibility,
  ICanvas,
  ICanvasClass,
  ICanvasUser,
  IGitlab,
  IGitRepo,
  IGitUser,
  IBaseRepo
} from './interfaces';

/**
 * @class GitlabBackend
 * Allow us access to gitlab's API
 *
 * @constructor Requires a users private token, (institute) url, and namespace.
 */
export class GitlabBackend {
  constructor (private info: IGitlab) {}
  /**
   * To format assignment names.
   * @returns A formatted string
   */
  build_name = (sem: string, sec: string, n: string, user: string): string =>
    `${sem}-${sec}-${n}-${user}`

  /**
   * Get list of namespaces for user.
   */
  getNamespaces = async (): Promise<any> => {
    const namespaces = await this.request('GET', '/namespaces', {});

    return new Promise(res => {
      if(!namespaces) {
        res({});
      }

      const groups = namespaces.filter((n: any) => n.kind === 'group');

      res(groups);
    });
  }
  /**
   * Create student repos for list of users.
   */
  createBaseRepo = async (
    name: string,
    namespace_id: string
  ): Promise<IBaseRepo> => {
    // Initialize with readme so we can create student repos
    // without needing any commits.
    const params = {
      name: name,
      namespace_id: namespace_id,
      issues_enabled: false,
      merge_requests_enabled: false,
      builds_enabled: false,
      wiki_enabled: false,
      snippets_enabled: true,
      visibility_level: GitVisibility.private,
      initialize_with_readme: true
    };

    const base_repo = await this.request('POST', '/projects', params);

    return new Promise((res, rej) => {
      if(!base_repo || base_repo === null) {
        /**
         * It might be an username or namespace issue.
         */
        rej({
          status: 'failed',
          namespace_id,
          name
        });
      }

      res({
        id: base_repo.id,
        name: base_repo.name,
        namespace: {
          name: base_repo.namespace.name,
          id: base_repo.namespace.id,
        },
        ssh_url: base_repo.ssh_url_to_repo
      });
    });
  }
  /**
   * @todo Try to get around using fork.
   * Creates an assignment within a specific namespace. Forks currently.
   * When creating more than one at a time, make sure to await it so there are no id conflicts
   * @returns The git links to clone with.
   */
  createAssignment = async (
    base_repo: IBaseRepo,
    section: string,
    semester: string,
    username: string
  ): Promise<IGitRepo> => {
    const params = {
      name: this.build_name(semester, section, base_repo.name, username),
      namespace: base_repo.namespace.name,
      namespace_id: base_repo.namespace.id,
      namespace_path: `${this.info.gitlab_host}/${base_repo.namespace.name}`,
      path: this.build_name(semester, section, base_repo.name, username)
    };
    // POST request to gitlab's projects to create a user repo in the selected group. (namespace)
    const repo = await this.request('POST', `/projects/${base_repo.id}/fork`, params);

    return new Promise((res, rej) => {
      if(!repo || repo === null) {
        /**
         * It might be an username or namespace issue.
         */
        rej({
          status: 'failed',
          base_repo,
          name,
          username
        });
      }

      res({
        username,
        id: repo.id,
        name: repo.name,
        namespace: repo.namespace.name,
        ssh_url: repo.ssh_url_to_repo
      });
    });
  }
  /**
   * Assigns a single user to a project.
   *
   * @returns Promise<any> // figure out types
   */
  assignAssignment = async (assignment_id: string, user_id: string): Promise<any> => {
    const params = {
      id: assignment_id,
      user_id: user_id,
      access_level: GitAccess.developer
    };

    const assigned = await this.request(
      'POST',
      `/projects/${params.id}/members`,
      params
    );

    return new Promise((res, rej) => {
      if(!assigned) {
        rej({
          status: 'failed',
          assignment_id,
          user_id
        });
      }

      res({
        id: assigned.id,
        name: assigned.name, // Student's full name
        username: assigned.username,
        access_level: assigned.access_level
      });
    });
  }
  /**
   * Archive project, helps clean users repo list
   */
  archiveAssignment = (assignment_id: string): Promise<any> => {
    return this.request('POST', `/projects/${assignment_id}/archive`, {});
  }
  /**
   * Give a user reporter access to a project
   */
  lockAssignment = (assignment_id: string, user_id: string): Promise<any> => {
    const params = {
      id: assignment_id,
      user_id: user_id,
      access_level: GitAccess.reporter
    };

    return this.request(
      'PUT',
      `/projects/${params.id}/members/${params.user_id}`,
      params
    );
  }
  /**
   * Give a user developer access to a project.
   */
  unlockAssignment = (assignment_id: string, user_id: string): Promise<any> => {
    const params = {
      id: assignment_id,
      user_id: user_id,
      access_level: GitAccess.developer
    };

    return this.request(
      'PUT',
      `/projects/${params.id}/members/${params.user_id}`,
      params
    );
  }
  /**
   * Get user_id from username
   * @returns user_id for whoever
   * @throws if user is not found.
   */
  getUserId = async (username: string): Promise<IGitUser> => {
    const user = await this.request('GET', '/users', { 'search': username });

    return new Promise((res, rej) => {
      if(!user || !user.length) {
        rej(`Could not find GitLab account with username: ${username}`);
      }

      res({
        id: user[0].id,
        name: user[0].name,
        username,
        avatar_url: user[0].avatar_url
      });
    });
  }
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

/**
 * @class CanvasBackend
 * Allow us access to canvas' API
 *
 * @constructor Requires a users acces token, (institute) url.
 */
export class CanvasBackend {
  constructor (private info: ICanvas) {}
  /**
   * Uses the users canvas_token to gain access to their courses.
   *
   * @TODO - figure out how to do TA and teacher efficiently.
   *
   * @returns Array of courses
   */
  getClasses = async (): Promise<ICanvasClass[]> => {
    const classes = await this.request('GET', 'courses', {
      enrollment_type: 'ta',
      enrollment_state: 'active',
      include: [ 'total_students', 'teachers' ]
    })
      .catch(console.error);

    return new Promise(res => res(classes.map((c: ICanvasClass) => ({
      id: c.id,
      name: c.name,
      teachers: c.teachers,
      created_at: c.created_at,
      total_students: c.total_students
    }))));
  }
  /**
   * Gets the students in a course
   * @returns Array of students
   */
  getStudents = async (course_id: string): Promise<ICanvasUser[]> => {
    const students = await this.students('GET', course_id)
      .catch(console.error);

    return new Promise((res, rej) => {
      if(!students || !students.length) {
        rej(`Could not find any enrollments in course: ${course_id}`);
      }

      res(students.map((s: ICanvasUser) => ({
        id: s.id,
        user_id: s.user_id,
        sis_user_id: s.sis_user_id,
        course_id: s.course_id
      })))
    });
  }
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
    params: { [k: string]: string | string[] }
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

    if (method !== 'GET') {
      return Promise.reject('Didn\'t use GET method');
    }

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
