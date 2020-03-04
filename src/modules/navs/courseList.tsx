import { Button, Grid } from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from './courseCard';

export const CourseList = (courses: any) => {
  return (
    <div>
    <Button href="#/">Return</Button>
    <>
      <Grid
        container
        justify='center'
        alignItems='center'
        spacing={3}
        style={{ minHeight: '100vh' }}
      >
        {courses.courses.map((course: any) => (
          <Grid item xs={3} key={course.id}>
            <Link to={`/course/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
    </div>
  );
};