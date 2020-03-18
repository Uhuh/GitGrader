import axios, { AxiosRequestConfig } from 'axios';
import {
  GitAccess,
  GitVisibility,
  IBaseRepo,
  ICanvasClass,
  ICanvasUser,
  IGitNamespace,
  IGitRepo,
  IGitUser
} from './interfaces';

/**
 * @class GitlabBackend
 * Allow us access to gitlab's API
 *
 * @constructor Requires a users private token, (institute) url, and namespace.
 */
export class GitlabBackend {
  private gitlab_host = 'https://www.gitlab.com';
  private gitlab_token = '';
  constructor () {}
  setToken (token: string) { this.gitlab_token = token; }
  setHost (host: string) { this.gitlab_host = host; }
  ready () {
    return (this.gitlab_host !== '' && this.gitlab_token !== '') ? true : false;
  }
  /**
   * To format assignment names.
   * @returns A formatted string
   */
  build_name = (sem: string, sec: string, n: string, user: string): string =>
    `${sem}-${sec}-${n}-${user}`

  /**
   * Get list of namespaces for user.
   */
  getNamespaces = async (): Promise<IGitNamespace[]> => {
    const namespaces = await this.request('GET', '/namespaces', {});

    return new Promise(res => {
      if(!namespaces) {
        res();
      }

      const groups = namespaces.filter((n: any) => n.kind === 'group');

      res(groups);
    });
  }
  /**
   * Separate "Base" repos from student repos.
   * @param namespace_id ID that belongs to a course.
   * @param section The course section id. EG: 101 for "CS 1570 (101)"
   */
  getRepos = async (namespace_id: string, section: string): 
    Promise<{ base_repos: IBaseRepo[], student_repos: Map<string, string>}> => {
    /**
     * For now the hacky method. Assume no base repo will have the course section
     * in the name.
     */
    let projects: any = [];
    let base_projects: any = [];
    const student_repos = new Map<string, string>();
    
    // We're limited by how many repos we can grab so we gotta do by page. :(
    for(let i = 1; i <= 10; i++) {
      // Grab all repos from the namespace.
      const P = await this.request('GET', `/groups/${namespace_id}/projects`, { page: i, per_page: 100 })
        .catch(console.error);
      // Clearly no more repos.
      if(!P || P.length === 0) {
        break;
      }
      projects = [...projects, ...P];
    }

    const namespace_projects = await projects
      .filter((p: any) => p.namespace.id == namespace_id);

    for(const n of namespace_projects) {
      if (n.name.includes(section)) {
        student_repos.set(n.name, n.id);
      } else {
        base_projects = [...base_projects, n];
      }
    }

    return new Promise((res, rej) => {
      if (!base_projects || base_projects.length === 0) {  
        res({
          base_repos: [],
          student_repos
        });
      }

      res(
        {
          base_repos: base_projects.map((b: any) => ({
            id: b.id,
            name: b.name,
            created_at: new Date(b.created_at).toLocaleDateString('en-US', {timeZone: 'America/Denver'}),
            namespace: {
              id: b.namespace.id,
              name: b.namespace.name,
            },
            ssh_url: b.ssh_url_to_repo
          })),
          student_repos
        }
      );
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
        created_at: new Date(base_repo.created_at).toLocaleDateString('en-US', {timeZone: 'America/Denver'}),
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
      namespace_path: `${this.gitlab_host}/${base_repo.namespace.name}`,
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
  getUser = async (student: ICanvasUser | ICanvasUser[]): Promise<IGitUser | IGitUser[]> => {

    let users: any = null;
    
    if (Array.isArray(student) && student.length) {
      for (const s of student) {
        const user =  await this.request(
            'GET', 
            '/users', 
            { 'search': s.sis_user_id }
        );
        users = [...users, user];
      }
    }

    return new Promise((res, rej) => {
      if(!users || !users.length) {
        rej(`Could not find GitLab accounts`);
      }

      res(
        Array.isArray(users) ?
        users.map(u => (
          {
            id: u.id,
            name: u.name,
            u: u.username,
            avatar_url: u.avatar_url
          }
        )) : users
      );
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
    const url = `${this.gitlab_host}/api/v4/${path}`;
    return (
      await axios({
        method,
        url,
        headers: { 'Private-Token': this.gitlab_token },
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
  private canvas_url = '';
  private canvas_token = '';
  constructor () {}
  setToken (token: string) { this.canvas_token = token; }
  setUrl (url: string) { this.canvas_url = url; }
  ready () {
   return (this.canvas_url !== '' && this.canvas_token !== '') ? true : false;
  }
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
    const url = `${this.canvas_url}/api/v1/${path}`;
    params.access_token = this.canvas_token;
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
    const url = `${this.canvas_url}/api/v1/courses/${course_id}/enrollments`;

    if (method !== 'GET') {
      return Promise.reject('Didn\'t use GET method');
    }

    // Currently it sends 10 per request, so limit is 1000 for now.
    return (
      await axios({
        method,
        url,
        params: { access_token: this.canvas_token, per_page: 1000 }
      })
    ).data;
  }
}
