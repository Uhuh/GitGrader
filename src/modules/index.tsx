import { CssBaseline } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { ICanvasNamespace } from '../api/interfaces';
import { CanvasPage } from './canvas';
import { CreateCourse } from './create/createCourse';
import { BackButton, CourseList, SettingsButton, ThemeButton } from './navs';
import { SetUp } from './settings';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL();
export { GitLabAPI };
GitLabAPI.setToken(JSON.parse(localStorage.getItem('GTdata') || 'null') || '');
GitLabAPI.setHost(JSON.parse(localStorage.getItem('GHdata') || 'null') || 'https://gitlab.com');

const CanvasAPI = new Canvas();
export { CanvasAPI };
CanvasAPI.setToken(JSON.parse(localStorage.getItem('CTdata') || 'null') || '');
CanvasAPI.setUrl(JSON.parse(localStorage.getItem('CHdata') || 'null') || '');

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

export const App = () => {
  const [courses, setCourses] = React.useState<ICanvasNamespace[]>();
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');
  const relations = JSON.parse(localStorage.getItem('relations') || 'null');

  console.log(relations);
 
  const toggleTheme = () => {
    localStorage.setItem('theme', theme == 'dark' ? 'light' : 'dark');
    setTheme(theme == 'dark' ? 'light' : 'dark');
  };

  //Used for debugging local storage/rerouting
  //localStorage.clear();

  // We need the data from canas so on initial render let's try.
   // We need the data from canas so on initial render let's try.
   React.useEffect(() => {
    GitLabAPI.getNamespaces()
      .then(namespaces => {
        CanvasAPI.getClasses()
          .then(classes => {
            let connections: ICanvasNamespace[] = [];
            for(const c of classes) {
              if(relations[c.id]) {
                const info = relations[c.id];
                const n = namespaces.find(n => n.id == info.gitlabID);
                if (!n) {
                  continue;
                }
                connections = [
                  ...connections,
                  {
                    ...c,
                    section: info.section,
                    namespace: {
                      id: n.id,
                      name: n.name,
                      path: n.path
                    }
                  }
                ];
              }
            }
            setCourses(connections);
          })
          .catch(console.error);
      })
      .catch(console.error);
      
    // The CanvasAPI won't change so this prevents re-rendering.
  }, [CanvasAPI]);

  const [courses, setCourses] = React.useState<ICanvasClass[]>();

  React.useEffect(() => {
    CanvasAPI.getClasses()
      .then(classes => { 
        setCourses(classes);
      })
      .catch(console.error);
  });

  if(!courses){
    return (<div>UwU</div>);
  }

  return (
    <ThemeProvider theme={theme == 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <BackButton />
      <SettingsButton />
      <ThemeButton changeTheme={toggleTheme}/>
      <Switch>
        <Route
          exact
          path='/'
          key='courses'
          render={() => <CourseList courses={courses || []}/>}
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
            
            const course = courses.find(c => c.id == match.params.courseId);
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
