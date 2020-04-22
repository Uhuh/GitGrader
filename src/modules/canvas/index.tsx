import { Button, Dialog , DialogActions, DialogContent, 
  DialogContentText, DialogTitle ,Grid , makeStyles, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import * as React from 'react';
import { GitLabAPI } from '..';
import { CanvasAPI } from '..';
import { ICanvasNamespace, IGitUser } from '../../api/interfaces';
import { RepoCard } from './repoCards';
import baseRepoStore from '../../stores/BaseRepoStore';
import BaseRepo from '../../stores/BaseRepo';
import { observer, inject } from 'mobx-react';

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
export const CanvasPage = 
  inject('BaseRepoStore')
  (observer((props: { course: ICanvasNamespace; }) => {
  const { course } = props;
  const classes = useStyles();
  
  const [assignmentName, setAssignmentName] = React.useState('');
  const [baseRepos, setBaseRepo] = React.useState<BaseRepo[]>([]);
  const [users, setUsers] = React.useState<IGitUser[]>([]);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
 
  React.useEffect(() => { 
    CanvasAPI.getStudents(course.id)
      .then(s => { // s is all students
        // Need to get all the student's gitlab ids to set up assignments.
        GitLabAPI.getUser(s)
          .then(u => {
            setUsers(
              Array.isArray(u) ? u : [u]
            ); 
          })
          // Need to log users that don't have gitlab accounts or tell the user a list somehow.
          .catch(console.error);
      })
    .catch(console.error);
  }, [course.id]); 

  React.useEffect(() => {
    const repos = baseRepoStore.getRepos(course.namespace.id) || [];
    console.log(repos);
    setBaseRepo(repos);
  }, [baseRepoStore.getRepos(course.namespace.id)]);

  const createAssignment = () => {
    if(!assignmentName.includes('-')){
      baseRepoStore.createRepo(assignmentName, course.namespace.id);
    } else {
      setError(true); 
    }
    setOpen(false);
  };

  const dateIndex = course.name.indexOf('SP') != -1 ? course.name.indexOf('SP') : course.name.indexOf('FS');
  const Semester = course.name.substring(dateIndex,dateIndex+2);
  const Year = new Date().getFullYear();
  
  const Preview  =  Year + '-' + Semester + '-' + course.section+ '-' + assignmentName + '-user';
  
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

        { baseRepos ? 
          baseRepos
            .map(baseRepo => (
          <Grid item xs={3} key={baseRepo.id} className={classes.card}>
            <RepoCard baseRepo={baseRepo} users={users} course={course} />
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
            Student repo preview : <b>{Preview}</b>
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
      <Dialog open={error} onClose={() => setError(false)} aria-labelledby='form-dialog-title'>
        <DialogContent>
          <DialogContentText>
            Assignment name can not contain the character ' - ' 
          </DialogContentText>
        </DialogContent>
        <Button
           onClick={() => setError(false)} 
           variant='outlined'
           color='primary'
          >
            Ok
          </Button>
      </Dialog>
    </> 
  );}));