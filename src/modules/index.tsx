import { CssBaseline, Paper } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { ICanvasClass } from '../api/interfaces';
import { BackButton, CourseList, SettingsButton } from './navs';
import { SetUp } from './settings';

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

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  }
});

// TODO : This needs to be an actual page/component
const CoursePage = (obj: { match: any; location: any }) => {
  return <p>{obj.match.params.courseId}</p>;
};

export const App = () => {
  const [courses, setCourses] = React.useState<ICanvasClass[]>();

  const [theme, setTheme] = React.useState('dark');

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BackButton />
      <SettingsButton />
      <Switch>
        <Route
          exact
          path='/'
          key='courses'
          render={() => 
            <>
              {courses ? 
              <CourseList courses={courses}/> :
              <p>No Courses loaded yet</p>}
            </>
          }
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
