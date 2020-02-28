import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import {Grid} from '@material-ui/core';
import {CourseCard} from './navs/courseCard';

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

/* GitLabAPI.createAssignment(
  'hw1',
  '2453',
  '001',
  '2020-SP',
  'duwtgb'
)
.then(console.log)
.catch(console.error); */

/* GitLabAPI.lockAssignment('', '')
  .then(console.log)
  .catch(console.error); */

/* canvas.getStudents('')
  .then(console.log)
  .catch(console.error);
 */

export const App = () => {
  const [courses, setCourses] = React.useState([
    {name:'Ninjas'},
    {name:'Intro'},
    {name:'Data structs'}
  ]);

  return (
    <Grid 
      container
      justify='center'
      alignItems='center'
      spacing={3}
    >
      {courses.map(course => (
        <Grid item xs={3}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  );
};
