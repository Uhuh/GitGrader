/**
 * Config stuff required for Gitlab
 */
export interface IGitlab {
  gitlab_token: string;
  gitlab_host: string;
  namespace: string;
}

/**
 * Config stuff required for Canvas
 */
export interface ICanvas {
  canvas_token: string;
  canvas_url: string;
}

/**
 * Basics for a gitlab user
 */
export interface IGitUser {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
}

/**
 * Expected git repo format
 * @description username - Students (email) username
 */
export interface IGitRepo {
  id: string;
  name: string;
  username: string;
  namespace: string;
}

/**
 * User / Student information3
 */
export interface ICanvasUser {
  id: string;
  user_id: string;
  sis_user_id: string;
  course_id: string;
}

/**
 * Small details about canvas teacher.
 */
interface ICanvasTeacher {
  id: string;
  display_name: string;
  avatar_image_url: string;
}

/**
 * Basic class information
 */
export interface ICanvasClass {
  id: string;
  name: string;
  created_at: string;
  total_students: string;
  teachers: ICanvasTeacher[];
}

/**
 * Access to repos.
 * @description reporter: can't push code but can view everything.
 * @description developer: can push code
 */
export enum GitAccess {
  guest = 10,
  reporter = 20,
  developer = 30,
  master = 40,
  owner = 50
}

/**
 * Gitlab API values for repo visibility
 */
export enum GitVisibility {
  private = 0,
  internal = 10,
  public = 20
}
