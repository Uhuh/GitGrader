import { Grid, Link } from '@material-ui/core';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ICanvasClass } from '../../api/interfaces';
import { CourseCard } from './courseCard';
import { AddCard } from './addCard';

export const CourseList = (props: { courses?: ICanvasClass[] }) => {
  return (
    <Grid
      container
      justify='center'
      alignItems='center'
      spacing={3}
      style={{ minHeight: '100vh' }}
    >
      {props.courses ?
        props.courses.map((course: ICanvasClass) => (
          <Grid item xs={3} key={course.id}>
            <Link component={RouterLink} to={`/course/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          </Grid>
        )) : <></>}
      <Grid item>
        <Link component={RouterLink} to={`/add`}>
          <AddCard />
        </Link>
      </Grid>
    </Grid>
  );
};
