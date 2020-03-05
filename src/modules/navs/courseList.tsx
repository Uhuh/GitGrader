import { Grid } from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ICanvasClass } from '../../api/interfaces';
import { CourseCard } from './courseCard';

export const CourseList = (props: {courses: ICanvasClass[]}) => {
  return (
    <Grid
      container
      justify='center'
      alignItems='center'
      spacing={3}
      style={{ minHeight: '100vh' }}
    >
      {props.courses.map((course: ICanvasClass) => (
        <Grid item xs={3} key={course.id}>
          <Link to={`/course/${course.id}`}>
            <CourseCard course={course} />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};
