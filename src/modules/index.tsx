import { Button, CssBaseline, Paper } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { createMuiTheme, ThemeProvider, withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { ICanvasNamespace, IGitNamespace,  } from '../api/interfaces';
import { CanvasPage } from './canvas';
import { CreateCourse } from './create/createCourse';
import { BackButton, CourseList, SettingsButton, ThemeButton } from './navs';
import { MissingSettings, SetUp } from './settings';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL();
export { GitLabAPI };
GitLabAPI.setToken('Cax44W7ysyF-gv39SeyP');
GitLabAPI.setHost('https://git-classes.mst.edu');

const CanvasAPI = new Canvas();
export { CanvasAPI };
CanvasAPI.setToken('2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq');
CanvasAPI.setUrl('https://mst.instructure.com');

const Centered = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
`;

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: grey,
  }
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: grey,
  }
});

/*  GitLabAPI.createBaseRepo('hw100', '2453')
  .then(base_repo => {
    GitLabAPI.createAssignment(
      base_repo,
      '101',
      '2020-SP',
      'duwtgb'
    )
      .then(console.log)
      .catch(console.error);
  })
  .catch(console.error); */

// TODO : This needs to be an actual page/component
const CoursePage = (obj: { match: any; location: any }) => {
  return <p>{obj.match.params.courseId}</p>;
};

export const App = () => {
  const [courses, setCourses] = React.useState<ICanvasNamespace[]>();

  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(theme == 'dark' ? 'light' : 'dark');
  };

  //Used for debugging local storage/rerouting
  //localStorage.clear();

  // We need the data from canas so on initial render let's try.
   // We need the data from canas so on initial render let's try.
   React.useEffect(() => {
    if (CanvasAPI.ready()) {
      CanvasAPI.getClasses()
        .then(classes => {
          setCourses(
            [
              {
                id: '123',
                name: 'Senior Design',
                section: '234',
                total_students: '69',
                teachers: [
                  {
                    id: '123',
                    display_name: 'Mike Gosnell',
                    avatar_image_url: 'Xd'
                  }
                ],
                namespace: {
                  id: '2453',
                  name: 'senior-test'
                }
              }
           ]
          );
        })
        .catch(console.error);
    }
    // The CanvasAPI won't change so this prevents re-rendering.
  }, [CanvasAPI]);

  return (
    <ThemeProvider theme={theme == 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <BackButton />
      <SettingsButton />
      <Button onClick={toggleTheme}><ThemeButton/></Button>
      <Switch>
        <Route
          exact
          path='/'
          key='courses'
          render={() => 
            <>
              {courses ? 
              <CourseList courses={courses}/> :
              <Centered>
                <h3>Loading Courses...</h3>
                <Link to={'/settings'}>
                  Courses not loading? Check your settings.
                </Link>
                <MissingSettings/>
              </Centered>}
            </>
          }
        />
        <Route
          exact
          path='/add'
          key='add'
          component={CreateCourse}
        />
        <Route
          exact
          path='/settings'
          key='settings'
          render={() => <SetUp />}
        />
        <Route 
          exact 
          path='/course/:courseId' 
          render={({ match }) => {
            // Match will be the course id.
            if (!courses || courses.length === 0) {
              return (<div>How did you get here? Wacky.</div>);
            }
            
            const course = courses.find(c => c.id === match.params.courseId);
            return (
              <CanvasPage { ...match.params } course={course} />
            );
          }} 
        />
        <Route
          key='error'
          render={() => (
            <Link to='/'>
              <p>Route not found!</p>
            </Link>
          )}
        />
      </Switch>
    </ThemeProvider>
  );
};
