import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
         DialogTitle, Grid, Link, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ICanvasClass } from '../../api/interfaces';
import { CourseCard } from './courseCard';
import { AddCard } from './addCard';

const useStyles = makeStyles({
  card: {
    padding: '30px',
    maxWidth: '21%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    width: '100%',
    paddingLeft: '5vw',
    paddingRight: '5vw',
    display: 'flex',
    flexWrap: 'wrap'
  },
  centerItem: {
    width: '100%',
    textAlign: 'center'
  }
});

export const CourseList = (props: {courses: ICanvasClass[]}) => {
  const classes = useStyles();
  const noSettings = (localStorage.getItem('CHdata') === null || localStorage.getItem('GHdata') === null ||
                      localStorage.getItem('CTdata') === null || localStorage.getItem('GTdata') === null ||
                      localStorage.getItem('CHdata') === '' || localStorage.getItem('GHdata') === '' ||
                      localStorage.getItem('CTdata') === '' || localStorage.getItem('GTdata') === '') 
                      ? true : false;

  return (
    <>
    <Grid
      container
      className={classes.body}
      justify='center'
      alignItems='center'
    >
      <div className={classes.centerItem}>
        <h1>Courses you grade for</h1>
      </div>
      {props.courses.map((course: ICanvasClass) => (
        <Grid item xs={3} key={course.id} className={classes.card}>
          <Link component={RouterLink} to={`/course/${course.id}`}>
            <CourseCard course={course} />
          </Link>
        </Grid>
      ))}
      <Grid item>
        <Link component={RouterLink} to={`/add`}>
          <AddCard />
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
 