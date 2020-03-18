import { Button, CssBaseline, Paper } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { createMuiTheme, ThemeProvider, withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { ICanvasClass } from '../api/interfaces';
import { CreateCourse } from './create/createCourse';
import { BackButton, CourseList, SettingsButton, ThemeButton } from './navs';
import { MissingSettings, SetUp } from './settings';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL({
  gitlab_host: JSON.parse(localStorage.getItem('GHdata') || 'null'),
  gitlab_token: JSON.parse(localStorage.getItem('GTdata') || 'null'),
  namespace: '2020-senior-test'
});

const CanvasAPI = new Canvas({
  canvas_url: JSON.parse(localStorage.getItem('CHdata') || 'null'),
  canvas_token: JSON.parse(localStorage.getItem('CTdata') || 'null')
});

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

// TODO : This needs to be an actual page/component
const CoursePage = (obj: { match: any; location: any }) => {
  return <p>{obj.match.params.courseId}</p>;
};

export const App = () => {
  const [courses, setCourses] = React.useState<ICanvasClass[]>();

  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(theme == 'dark' ? 'light' : 'dark');
  };

  //Used for debugging local storage/rerouting
  //localStorage.clear();

  // We need the data from canas so on initial render let's try.
  React.useEffect(() => {
    CanvasAPI.getClasses()
      .then(classes => {
        setCourses(classes);
      })
      .catch(console.error);
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
          component={CoursePage} 
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
