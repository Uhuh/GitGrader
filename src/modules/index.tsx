import { CssBaseline } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { CanvasPage } from './canvas';
import { CreateCourse } from './create/createCourse';
import { BackButton, CourseList, SettingsButton, ThemeButton } from './navs';
import { SetUp } from './settings';
import { inject, observer } from 'mobx-react';
import relationStore from '../stores/RelationStore';
import styled from 'styled-components';

const Centered = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
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

export const App = 
inject('RelationStore')
(observer(
() => {
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    localStorage.setItem('theme', theme == 'dark' ? 'light' : 'dark');
    setTheme(theme == 'dark' ? 'light' : 'dark');
  };

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
          render={() => <CourseList courses={relationStore.all() || []}/>}
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
            const course = relationStore.get(match.params.courseId);

            if(!course) {
              return (<Centered>Course not found.</Centered>);
            }

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
}));
