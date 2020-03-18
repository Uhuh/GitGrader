import { Box, Button, Card, Dialog , DialogActions, DialogContent, 
  DialogContentText, DialogTitle ,Grid , makeStyles, TextField } from '@material-ui/core/';
import  AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { GitLabAPI } from '..';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { IBaseRepo, ICanvasNamespace, ICanvasUser } from '../../api/interfaces';
import { RepoCard } from './repoCards';

const CanvasAPI = new Canvas();
CanvasAPI.setUrl('https://mst.instructure.com');
CanvasAPI.setToken('2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq');

const useStyles = makeStyles({
  root: {
    width: 345,
    height: 280,
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
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    height: '100%',
  },
  centerItem: {
    textAlign: 'center',
  }
});

/**
 * We should be able to pass the course as well.
 * @todo this takes quite some time to load. Need to find a way to make it vrooom
 * @param props courseId - Canvas course id
 */
export const CanvasPage = (props: { courseId: string; course: ICanvasNamespace; }) => {
  const { courseId, course } = props;
  const classes = useStyles();
  
  const [assignmentName, setAssignmentName] = React.useState('');
  const [baseRepos, setBaseRepo] = React.useState<IBaseRepo[]>([]);
  const [students, setStudents] = React.useState<ICanvasUser[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    CanvasAPI.getStudents(courseId)
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
  }, [courseId]); 

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
        console.log(repo);
        setBaseRepo([...baseRepos, repo]);
      })
      .catch(console.error);
    setOpen(false);
  };

  return (
    <Box>
      <div>
        <h1 className={classes.centerItem}>
          <strong>Class Name: {course.name}</strong>
        </h1> 
        <h2 className={classes.centerItem}>
          <strong>Total Student: {course.total_students}</strong>
        </h2>
        <h2 className={classes.centerItem}> 
        <strong>Course Instructor(s): 
          {course.teachers.map(teacher => <li key={teacher.id}>{teacher.display_name}</li>)}</strong>
        </h2>
        <Grid
          container
          justify='center'
          alignItems='center'
          spacing={3}
          style={{ minHeight: '100vh' }}
        >
          {baseRepos ? baseRepos.map((baseRepo: IBaseRepo) => (
            <Grid item xs={3} key={baseRepo.id} spacing={10}>
              <RepoCard baseRepo={baseRepo} students={students} course={course} />
            </Grid>
          )):[]}
          <div>
          <Card className={classes.root} onClick={() => setOpen(true)}>
            <AddIcon className={classes.addIcon}></AddIcon>
          </Card>
          <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>
              Add Assignment
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the name of the assignment you are assigning
              </DialogContentText>
                <TextField 
                  id='outlined-basic' 
                  label='Assignment Name' 
                  type='text' 
                  onChange={e => setAssignmentName(e.target.value)} 
                />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color='primary'>
                Cancel
              </Button>
              <Button onClick={createAssignment} color='primary'>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        </Grid>
      </div>
    </Box>
  );
};