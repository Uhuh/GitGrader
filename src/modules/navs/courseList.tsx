import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
         DialogTitle, Grid, Link } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ICanvasClass } from '../../api/interfaces';
import { CourseCard } from './courseCard';

export const CourseList = (props: {courses: ICanvasClass[]}) => {
  const noSettings = (localStorage.getItem('CHdata') === null || localStorage.getItem('GHdata') === null ||
                      localStorage.getItem('CTdata') === null || localStorage.getItem('GTdata') === null ||
                      localStorage.getItem('CHdata') === '' || localStorage.getItem('GHdata') === '' ||
                      localStorage.getItem('CTdata') === '' || localStorage.getItem('GTdata') === '') 
                      ? true : false;

  return (
    <>
    <Grid
      container
      justify='center'
      alignItems='center'
      spacing={3}
      style={{ minHeight: '100vh' }}
    >
      {props.courses.map((course: ICanvasClass) => (
        <Grid item xs={3} key={course.id}>
          <Link component={RouterLink} to={`/course/${course.id}`}>
            <CourseCard course={course} />
          </Link>
        </Grid>
      ))}
      <Grid item>
        <Link component={RouterLink} to={`/add`}>
          <AddIcon/>
        </Link>
      </Grid>
    </Grid>
    <Dialog open={noSettings}>
      <DialogTitle>{'Missing Settings'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          One or more host URLs and/or access tokens are missing or have yet
          to be setup. Please go to the settings page to fix this issue.
        </DialogContentText>
        <DialogActions>
          <Button variant='outlined' color='primary'>
            <Link component={RouterLink} to='/settings'>
              Settings
            </Link>
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
    </>
  );
};
 