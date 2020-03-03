import { Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { CourseList } from './navs/courseList';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL({
  gitlab_host: 'https://git-classes.mst.edu',
  gitlab_token: '',
  namespace: '2020-senior-test'
});

const CanvasAPI = new Canvas({
  canvas_url: 'https://mst.instructure.com',
  canvas_token: ''
});

/*
GitLabAPI.createAssignment(
  'hw1',
  '2453',
  '001',
  '2020-SP',
  'mrmk8'
)
.then(assignment => {
  GitLabAPI.getUserId('mrmk8')
    .then(user => {
      GitLabAPI.assignAssignment(assignment.id, user.id)
        .then(console.log)
        .catch(console.error);
    })
    .catch(console.error);
})
.catch(console.error);

CanvasAPI.getClasses()
  .then(classes => console.log(classes[1]))
  .catch(console.error);

CanvasAPI.getStudents('42771')
  .then(console.log)
  .catch(console.error);
*/

/* GitLabAPI.lockAssignment('', '')
  .then(console.log)
  .catch(console.error); */

/* canvas.getStudents('')
  .then(console.log)
  .catch(console.error);
 */

// TODO : This needs to be an actual page/component
const CoursePage = (obj: { match: any; location: any }) => {
  return <p>{obj.match.params.courseId}</p>;
};

export const App = () => {
  const [courses, setCourses] = React.useState([
    { name: 'Test Class 1', teacher: 'Professor 1', students: 222, id: 1 },
    { name: 'Test Class 2', teacher: 'Professor 2', students: 22, id: 2 },
    { name: 'Test Class 3', teacher: 'Professor 3', students: 2, id: 3 }
  ]);

  const [user, setUser] = React.useState(true);

  return (
    <main>
      <Switch>
        <Route
          exact
          path='/'
          key='courses'
          render={() => <CourseList courses={courses} />}
        />
        <Route exact path='/course/:courseId' component={CoursePage} />
        <Route
          exact
          path='/testing'
          key='testing'
          render={() => <p>hello</p>}
        />
        <Route
          key='error'
          render={() => (
            <Link to='/'>
              <p>Page not found.</p>
            </Link>
          )}
        />
      </Switch>
    </main>
  );
};
