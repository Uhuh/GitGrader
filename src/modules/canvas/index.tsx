import { Button, Dialog , DialogActions, DialogContent, 
  DialogContentText, DialogTitle ,Grid , makeStyles, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import * as React from 'react';
import { GitLabAPI } from '..';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { IBaseRepo, ICanvasNamespace, ICanvasUser } from '../../api/interfaces';
import { RepoCard } from './repoCards';

const CanvasAPI = new Canvas();
CanvasAPI.setUrl('https://mst.instructure.com');
CanvasAPI.setToken('2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq');

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
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  addIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerItem: {
    width: '100%',
    textAlign: 'center'
  }
});

/**
 * We should be able to pass the course as well.
 * @todo this takes quite some time to load. Need to find a way to make it vrooom
 * @param props courseId - Canvas course id
 */
export const CanvasPage = (props: { course: ICanvasNamespace; }) => {
  const { course } = props;
  const classes = useStyles();
  
  const [assignmentName, setAssignmentName] = React.useState('');
  const [baseRepos, setBaseRepo] = React.useState<IBaseRepo[]>([]);
  const [students, setStudents] = React.useState<ICanvasUser[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    CanvasAPI.getStudents(course.id)
      .then(s => {
  	    setStudents([
          ...s,
          {
            id: '123',
            user_id: '456',
            sis_user_id: 'mrmk8',
            course_id: '789'
          }
        ]);
      })
    .catch(console.error);
    setStudents([
      {
        id: '123',
        user_id: '456',
        sis_user_id: 'mrmk8',
        course_id: '789'
      }
    ]);
  }, [course.id]); 

  React.useEffect(() => {
    GitLabAPI.getRepos('2453','234')
      .then(b => {
        console.log(b);
  	    setBaseRepo(b.base_repos);
      })
    .catch(console.error);
  }, []);

  const createAssignment = () => {
    GitLabAPI.createBaseRepo(assignmentName, course.namespace.id)
      .then(repo => {
        setBaseRepo([...baseRepos, repo]);
      })
      .catch(console.error);
    setOpen(false);
  };

  return (
    <>
      <Grid
        container
        className={classes.body}
        justify='center'
        alignItems='center'
      >
        <div className={classes.centerItem}>
          <h2 style={{float: 'left'}}> {course.name} <PersonIcon fontSize={'large'}/> {course.total_students} </h2>
          <h2 style={{float: 'right'}}> {course.namespace.name} </h2>
          <h2> 
            {course.teachers.map(teacher => <p key={teacher.id}>{teacher.display_name}</p>)}
          </h2>
        </div>

        {baseRepos ? baseRepos.map((baseRepo: IBaseRepo) => (
          <Grid item xs={3} key={baseRepo.id} className={classes.card}>
            <RepoCard baseRepo={baseRepo} students={students} course={course} />
          </Grid>
        ))
          :
          <Grid item className={classes.card}>
            <Typography color={'textSecondary'}>No base repos! Go make one.</Typography>
          </Grid>
        }
        <Grid item className={classes.addIcon} onClick={() => setOpen(true)}>
          <AddIcon/>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>
          Create Assignment
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the assignment you are assigning
          </DialogContentText>
          <TextField 
            id='outlined-basic' 
            label='Assignment Name' 
            type='text'
            autoFocus={true}
            onChange={e => setAssignmentName(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
        <Button 
            onClick={() => setOpen(false)}
            variant='outlined' 
            color='secondary'
          >
            Cancel
          </Button>
          <Button
           onClick={createAssignment} 
           variant='outlined'
           color='primary'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};