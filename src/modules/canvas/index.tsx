import { Box } from '@material-ui/core';
import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { ICanvasClass , ICanvasUser, IGitNamespace } from '../../api/interfaces';
import { CourseList } from '../navs';

const CanvasAPI = new Canvas({
  canvas_url: 'https://mst.instructure.com',
  canvas_token: '2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq'
});

/**
 * We should be able to pass the course as well.
 * @todo this takes quite some time to load. Need to find a way to make it vrooom
 * @param props courseId - Canvas course id
 */
export const CanvasPage = (props: { courseId: string; courses: ICanvasClass[]; namespace: IGitNamespace[]; }) => {
  const { courseId, courses, namespace } = props;
  
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
        <div>
          <label>Namespace</label>
          <select className='namespace'>
            {namespace.map(namespace => 
              <option key={namespace.id} value={namespace.name}>{namespace.name}</option>
            )}
          </select>
        </div>
        <div>
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