import { Button, createStyles, FormControl, Grid, InputLabel, makeStyles, Paper, Select, Theme } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import * as React from 'react';
import { ICanvasClass, IGitNamespace } from '../../api/interfaces';
import {CanvasAPI, GitLabAPI} from '../../modules';

export const CreateCourse = (canvasIDs: any[], gitlabIDs: any[]) => {
  const [courses, setCourses] = React.useState<ICanvasClass[]>();
  const [namespaces, setNamespaces] = React.useState<IGitNamespace[]>();

  const [selectedNamespace, setSelectedNamespace] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState('');

  const handleChangeNamespace = (event: React.ChangeEvent<{ value: unknown }>) => {
    if(typeof event.target.value === 'string'){
      setSelectedNamespace(event.target.value);
    }
  }; 
  
  const handleChangeCourse = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (typeof event.target.value === 'string') {
      setSelectedCourse(event.target.value);
    }
  };

  const handleSubmit = () => {
    const temp = JSON.parse(localStorage.getItem('relations') || '{}');
    temp[selectedCourse] = {canvasID: selectedCourse, gitlabID: selectedNamespace};
    localStorage.setItem('relations', JSON.stringify(temp));
  }
  
  React.useEffect(() => {
    CanvasAPI.getClasses()
      .then(courses => {
        setCourses(courses);
      })
      .catch(console.error);
  }, [CanvasAPI]);

  React.useEffect(() => {
    GitLabAPI.getNamespaces()
      .then(namespaces => {
        setNamespaces(namespaces);
      })
      .catch(console.error);
  }, [GitLabAPI]);

  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justify='center'
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3} style={{ minHeight: '70vh', minWidth: '60vh' }}>
        <Paper elevation={3} style={{ minHeight: '70vh', minWidth: '60vh', padding: '20px'}}>
          <Grid item>
            <FormControl>
              <InputLabel id='canvasIDlabel'>Canvas ID</InputLabel>
              <Select
                native
                onChange={handleChangeCourse}
                label='canvasIDlabel'
                value={selectedCourse}
                inputProps={{
                  id: 'canvasID'
                }}
                >
                {
                  courses ? courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  )) : 
                  <option key='null' value='null'>
                    "No courses found"
                  </option>
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <LinkIcon />
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id='githubIDlabel'>Gitlab ID</InputLabel>
              <Select
                native
                onChange={handleChangeNamespace}
                label='githubIDlabel'
                value={selectedNamespace}
                inputProps={{
                  id: 'gitlabID'
                }}
                >
                {
                  namespaces ? namespaces.map(namespace => (
                    <option key={namespace.id} value={namespace.id}>
                      {namespace.name}
                    </option>
                  )) :
                  <option key='null' value='null'>
                      "No namespaces found"
                  </option>
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <Button onClick={handleSubmit} type='submit'>
                Create
              </Button>
            </FormControl>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};