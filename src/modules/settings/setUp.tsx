import { Button, FormControl, Grid, InputLabel, OutlinedInput } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const SpacePadding = styled.div`
  margin-bottom: 20px;
`;

export const SetUp = () => {
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
  };

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
          <OutlinedInput id='canvasHost' value={canvasHost} onChange={handleChangeCH} label='canvasHost' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabHost'>GitLab Host</InputLabel>
          <OutlinedInput id='gitlabHost' value={gitlabHost} onChange={handleChangeGH} label='gitlabHost' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='canvasKey'>Canvas Key</InputLabel>
          <OutlinedInput id='canvasKey' value={canvasKey} onChange={handleChangeCK} label='canvasKey' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabKey'>GitLab Key</InputLabel>
          <OutlinedInput id='gitlabKey' value={gitlabKey} onChange={handleChangeGK} label='gitlabKey' />
        </FormControl>
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