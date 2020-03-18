import { Button, createStyles, FormControl, Grid, InputLabel, makeStyles, Paper, Select, Theme } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { ICanvasClass } from '../../api/interfaces';

export const CreateCourse = (canvasIDs: any[], gitlabIDs: any[]) => {
  const [courses, setCourses] = React.useState<ICanvasClass[]>();
  // const [namespaces, setNamespaces] = React.useState<IGitNamespace[]>();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target);
    // const temp = JSON.parse(localStorage.getItem('courses') || '{}');
    // temp[`${event.target.canvasID}`] = event.target.gitlabID;
    // localStorage.setItem('courses', JSON.stringify(temp));
  };

  const CanvasAPI = new Canvas({
    canvas_token: '2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq',
    canvas_url: 'https://mst.instructure.com',
  });
  const GitLabAPI = new GL({
    gitlab_token: 'hwFLotsH2w61iEu3EC-f',
    gitlab_host: 'https://gitlab.instructure.com',
    namespace: '2020-senior-test',
  }); 
  
  React.useEffect(() => {
    CanvasAPI.getClasses()
      .then(classes => {
        setCourses(classes);
      })
      .catch(console.error);
  }, [CanvasAPI]);

  // React.useEffect(() => {
  //   GitLabAPI.getNamespaces()
  //     .then(namespaces => {
  //       setNamespaces(namespaces);
  //     })
  //     .catch(console.error);
  // }, [GitlabAPI]);

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3} style={{ minHeight: '70vh', minWidth: '60vh' }}>
        <Paper elevation={3} style={{ minHeight: '70vh', minWidth: '60vh', padding: '20px'}}>
          <FormControl>
            <InputLabel id='canvasIDlabel'>Canvas ID</InputLabel>
            <Select
              native
              onChange={handleChange}
              inputProps={{
                id: 'canvasID'
              }}
            >
              {
                courses ? courses.map(course => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                )) : 
                <option key='null' value='null'>
                  "No courses found"
                </option>
              })}
            </Select>
            <LinkIcon />
            <InputLabel id='githubIDlabel'>Gitlab ID</InputLabel>
            <Select
              native
              onChange={handleChange}
              inputProps={{
                id: 'gitlabID'
              }}
            >
              {
                courses ? courses.map(course => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                )) :
                  <option key='null' value='null'>
                    "No courses found"
                </option>
              })}
            </Select>
            <Button>
              Create
            </Button>
          </FormControl>
        </Paper>
      </Grid>
    </Grid>
  );
};