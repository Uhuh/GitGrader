import { Button, createStyles, FormControl, Grid, InputLabel, makeStyles, Paper, Select, Theme, TextField, withStyles } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import * as React from 'react';
import { ICanvasClass, IGitNamespace } from '../../api/interfaces';
import {CanvasAPI, GitLabAPI} from '../../app';

const MainGrid = withStyles({
  root: {
    position: 'absolute',
    top: '400px'
  }
})(Grid);

export const CreateCourse = (canvasIDs: any[], gitlabIDs: any[]) => {
  const [courses, setCourses] = React.useState<ICanvasClass[]>();
  const [namespaces, setNamespaces] = React.useState<IGitNamespace[]>();

  const [selectedNamespace, setSelectedNamespace] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState('');
  const [section, setSection] = React.useState('');

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
    temp[selectedCourse] = {
      canvasID: selectedCourse, 
      section: section, 
      gitlabID: selectedNamespace
    };
    localStorage.setItem('relations', JSON.stringify(temp));
    console.log(temp);
  };
  
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
    <MainGrid
      container
      direction='column'
      justify='center'
      alignItems='center'
      spacing={3}
    >
      <Grid
        container
        direction='row'
        justify='center'
        spacing={3}
      >
        <Grid item>
          <FormControl style={{width: 200}}>
            <InputLabel id='canvasIDlabel'>Canvas ID</InputLabel>
            <Select
              native
              labelWidth={20}
              onChange={handleChangeCourse}
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
          <LinkIcon fontSize='large'/>
        </Grid>
        <Grid item>
          <FormControl style={{ width: 200 }}>
            <InputLabel id='githubIDlabel'>Gitlab ID</InputLabel>
            <Select
              native
              labelWidth={20}
              onChange={handleChangeNamespace}
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
      </Grid>
      <Grid item>
        <TextField
          type='text'
          label='Class Section'
          onChange={e => setSection(e.target.value)}
        />
      </Grid>
      <Grid item>
        <FormControl>
          <Button onClick={handleSubmit} type='submit'>
            Create
              </Button>
        </FormControl>
      </Grid>
    </MainGrid>
  );
};