import { Box } from '@material-ui/core';
import { Button, Card, CardActions, CardContent , CardHeader, makeStyles, Typography} from '@material-ui/core/';
import  AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { ICanvasClass , ICanvasUser, IGitNamespace } from '../../api/interfaces';

const CanvasAPI = new Canvas();
CanvasAPI.setUrl('https://mst.instructure.com');
CanvasAPI.setToken('2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq');

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
    maxHeight: 200,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  addIcon: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 50,
    height: 50,
  },
  centerItem: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
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
  const [students, setStudents] = React.useState<ICanvasUser[]>();

  React.useEffect(() => {
    CanvasAPI.getStudents(courseId)
      .then(s => {
  	    setStudents(s);
      })
    .catch(console.error);
  }, [courseId]); 
  
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
        <p>
          Class Name: {courses[classIndex].name}
        </p> 
        <p>
          Total Student: {courses[classIndex].total_students}
        </p>
        <p>
          Course Instructor(s): 
          {courses[classIndex].teachers.map(teacher => <li>{teacher.display_name}</li>)}
        </p>
        <br />
        <div className='namespace'>
            {namespace.map(namespace => 
            <div>
              <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color='textSecondary' gutterBottom>
                      {namespace.name}
                    </Typography>
                </CardContent>
                <CardActions>
                  <Button size='small'>Learn More</Button>
                </CardActions>
              </Card>
              <br />
            </div>
            )}
        </div>
        <div>
          <Card className={classes.root}>
            <br />
            <AddIcon className={classes.addIcon}></AddIcon>
            <br />
          </Card>
              <label>
                Assignment Name:
                <input type='text' onChange={e => setAssignmentName(e.target.value)}/>
              </label>      
            <button onClick={handleSubmit}>hello</button>
        </div>
      </div>
    </Box>
  );
};