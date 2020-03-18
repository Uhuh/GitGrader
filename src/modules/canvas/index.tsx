import { Box, Button, Card, CardActions, CardContent , CardHeader, Dialog , DialogActions, DialogContent, 
  DialogContentText, DialogTitle ,Grid , makeStyles, TextField, Typography } from '@material-ui/core/';
import  AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { GitLabAPI } from '..';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { GitAccess , IBaseRepo, ICanvasClass, ICanvasUser, IGitNamespace } from '../../api/interfaces';
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
export const CanvasPage = (props: { courseId: string; courses: ICanvasClass[]; namespace: IGitNamespace[]; }) => {
  const { courseId, courses, namespace } = props;
  const classes = useStyles();
  
  let classIndex = 0;

  const [assignmentName, setAssignmentName] = React.useState('');
  const [baseRepos, setBaseRepo] = React.useState<IBaseRepo[]>();
  const [students, setStudents] = React.useState<ICanvasUser[]>();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    CanvasAPI.getStudents(courseId)
      .then(s => {
  	    setStudents(s);
      })
    .catch(console.error);
  }, [courseId]); 

  React.useEffect(() => {
    GitLabAPI.getRepos('2453','666')
      .then(b => {
        console.log(b);
  	    setBaseRepo(b.base_repos);
      })
    .catch(console.error);
  }); 
  
  for (const i of courses) {
    if(i.id == courseId)
    {
      break;
    }
    classIndex++;
  } 
  return (
    <Box>
      <div>
        <h1 className={classes.centerItem}>
          <strong>Class Name: {courses[classIndex].name}</strong>
        </h1> 
        <h2 className={classes.centerItem}>
          <strong>Total Student: {courses[classIndex].total_students}</strong>
        </h2>
        <h2 className={classes.centerItem}> 
        <strong>Course Instructor(s): 
          {courses[classIndex].teachers.map(teacher => <li>{teacher.display_name}</li>)}</strong>
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
              <RepoCard baseRepo={baseRepo} />
            </Grid>
          )):[]}
          <div>
          <Card className={classes.root} onClick={handleClickOpen}>
            <AddIcon className={classes.addIcon}></AddIcon>
          </Card>
          <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>Add Assignment</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the name of the assignment you are assigning
              </DialogContentText>
                <TextField id='outlined-basic' label='Assignment Name' 
                  type='text' onChange={e => setAssignmentName(e.target.value)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
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