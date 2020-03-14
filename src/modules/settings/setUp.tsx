import { Button, FormControl, Grid, InputLabel, OutlinedInput, Switch, Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const SpacePadding = styled.div`
  margin-bottom: 20px;
`;

export const SetUp = (toggleTheme: any, theme: any) => {
  const [canvasHost, setCanvasHost] = React.useState(' ');
  const [gitlabHost, setGitlabHost] = React.useState(' ');
  const [canvasKey, setCanvasKey] = React.useState(' ');
  const [gitlabKey, setGitlabKey] = React.useState(' ');

  const handleChangeCH = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasHost(event.target.value);
  };

  const handleChangeGH = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitlabHost(event.target.value);
  };

  const handleChangeCK = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasKey(event.target.value);
  };

  const handleChangeGK = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitlabKey(event.target.value);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Canvas Host:', canvasHost, 'GitLab Host:', gitlabHost);
    console.log('Canvas Key:', canvasKey, 'GitLab Key:', gitlabKey);
    localStorage.setItem('CHdata', JSON.stringify(canvasHost));
    localStorage.setItem('GHdata', JSON.stringify(gitlabHost));
    localStorage.setItem('CKdata', JSON.stringify(canvasKey));
    localStorage.setItem('GKdata', JSON.stringify(gitlabKey));
  };

  const CanvasHost = JSON.parse(localStorage.getItem('CHdata') || 'null');
  const GitlabHost = JSON.parse(localStorage.getItem('GHdata') || 'null');
  const CanvasKey = JSON.parse(localStorage.getItem('CKdata') || 'null');
  const GitlabKey = JSON.parse(localStorage.getItem('GKdata') || 'null');

  return ( 
    <Grid 
     container
     direction='column'
     alignItems='center' 
     justify='center'
    >
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='canvasHost'>Canvas Host</InputLabel>
          <OutlinedInput 
           id='canvasHost' 
           defaultValue={CanvasHost}
           onChange={handleChangeCH} 
           label='canvasHost' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabHost'>GitLab Host</InputLabel>
          <OutlinedInput 
           id='gitlabHost'
           defaultValue={GitlabHost}
           onChange={handleChangeGH} 
           label='gitlabHost' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='canvasKey'>Canvas Key</InputLabel>
          <OutlinedInput 
           id='canvasKey' 
           defaultValue={CanvasKey}
           onChange={handleChangeCK} 
           label='canvasKey' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabKey'>GitLab Key</InputLabel>
          <OutlinedInput 
           id='gitlabKey' 
           defaultValue={GitlabKey}
           onChange={handleChangeGK} 
           label='gitlabKey' />
        </FormControl>
        
        <Switch
          checked={toggleTheme.theme === 'dark'}
          onClick={toggleTheme.toggleTheme}/>
        />
        <SpacePadding></SpacePadding>
        <Grid 
         container
         direction='column'
         alignItems='center' 
         justify='center'
        >
          <Button variant='outlined' type='submit'>Save</Button>
        </Grid>
      </form>
    </Grid>
  );
};