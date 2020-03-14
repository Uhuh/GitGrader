import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
         FormControl, Grid, InputLabel, OutlinedInput, Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const SpacePadding = styled.div`
  margin-bottom: 20px;
`;

const Centered = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

export const SetUp = () => {
  const [canvasHost, setCanvasHost] = React.useState('');
  const [gitlabHost, setGitlabHost] = React.useState('');
  const [canvasToken, setCanvasToken] = React.useState('');
  const [gitlabToken, setGitlabToken] = React.useState('');
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);

  let CanvasHost = JSON.parse(localStorage.getItem('CHdata') || 'null');
  let GitlabHost = JSON.parse(localStorage.getItem('GHdata') || 'null');
  let CanvasToken = JSON.parse(localStorage.getItem('CTdata') || 'null');
  let GitlabToken = JSON.parse(localStorage.getItem('GTdata') || 'null');  
  const settingsForm = document.getElementById('settings') as HTMLFormElement;

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('CHdata', JSON.stringify(canvasHost));
    localStorage.setItem('GHdata', JSON.stringify(gitlabHost));
    localStorage.setItem('CTdata', JSON.stringify(canvasToken));
    localStorage.setItem('GTdata', JSON.stringify(gitlabToken));
    setCanvasHost('');
    setGitlabHost('');
    setCanvasToken('');
    setGitlabToken('');
    console.log('Canvas Host:', canvasHost, 'GitLab Host:', gitlabHost);
    console.log('Canvas Token:', canvasToken, 'GitLab Token:', gitlabToken);
    settingsForm.reset();
  };
  
  const clearForm = () => { 
    localStorage.setItem('CHdata', JSON.stringify(''));
    localStorage.setItem('GHdata', JSON.stringify(''));
    localStorage.setItem('CTdata', JSON.stringify(''));
    localStorage.setItem('GTdata', JSON.stringify(''));
    setCanvasHost('');
    setGitlabHost('');
    setCanvasToken('');
    setGitlabToken('');
    console.log('Canvas Host:', canvasHost, 'GitLab Host:', gitlabHost);
    console.log('Canvas Token:', canvasToken, 'GitLab Token:', gitlabToken);
    settingsForm.reset();
    handleAlertClose();
  };
  
  const inputEmpty = () => {
    if(canvasHost.length === 0 || gitlabHost.length == 0 ||
      canvasToken.length === 0 || gitlabToken.length === 0) {
      return true;
    } else {
      return false;
    }
  }; 

  const clearEmpty = () => {
    if(!CanvasHost || !GitlabHost || !CanvasToken || !GitlabToken) {
      return true;
    } else {
      return false;
    }
  }; 

  return (
    <Centered>
    <Grid 
     container
     direction='column'
     alignItems='center' 
     justify='center'>
      <form id='settings' onSubmit={handleSubmit} autoComplete='off'>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='canvasHost'>Canvas Host URL</InputLabel>
          <OutlinedInput 
           id='canvasHost' 
           placeholder='Please enter the host URL'
           onChange={(e) => {setCanvasHost(e.target.value)}} 
           label='Canvas Host URL' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabHost'>GitLab Host URL</InputLabel>
          <OutlinedInput 
           id='gitlabHost'
           placeholder='Please enter the host URL'
           onChange={(e) => {setGitlabHost(e.target.value)}} 
           label='GitLab Host URL' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='canvasToken'>Canvas Access Token</InputLabel>
          <OutlinedInput 
           id='canvasToken' 
           placeholder='Please enter your token'
           onChange={(e) => {setCanvasToken(e.target.value)}} 
           label='Canvas Access Token' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabToken'>GitLab Access Token</InputLabel>
          <OutlinedInput 
           id='gitlabToken' 
           placeholder='Please enter your token'
           onChange={(e) => {setGitlabToken(e.target.value)}} 
           label='GitLab Access Token' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <Grid 
         container
         direction='column'
         alignItems='center' 
         justify='center'>
          <Button 
           disabled={inputEmpty()} 
           variant='outlined'
           type='submit'
           onClick={handleConfirmOpen}>
            Update
          </Button>
          <Dialog open={confirmOpen} onClose={handleConfirmClose}>
            <DialogTitle>{'Settings Updated'}</DialogTitle>
          </Dialog>
        </Grid>
      </form>
    </Grid>
    <SpacePadding></SpacePadding>
    <Grid 
     container
     direction='column'
     alignItems='flex-start' 
     justify='center'>
      <Typography align='left' variant='h6'>Canvas Host URL: {CanvasHost}</Typography>
      <Typography align='left' variant='h6'>GitLab Host URL: {GitlabHost}</Typography>
      <Typography align='left' variant='h6'>Canvas Access Token: {CanvasToken}</Typography>
      <Typography align='left' variant='h6'>GitLab Access Token: {GitlabToken}</Typography>
      <Grid 
       container
       direction='column'
       alignItems='center' 
       justify='center'>
        <SpacePadding></SpacePadding>   
        <Button 
         disabled={clearEmpty()}
         variant='outlined' 
         onClick={handleAlertOpen}>
            Clear
        </Button>
        <Dialog open={alertOpen} onClose={handleAlertClose}>
          <DialogTitle>{'Are you sure you want to clear all fields?'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Clearing all fields will reset all values. You will need to enter
              and save new host URLs and access tokens in order to ensure that 
              GitGrader functions properly.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={clearForm}>
              Yes
            </Button>
            <Button variant='outlined' onClick={handleAlertClose}>
              No
            </Button>
          </DialogActions>
        </Dialog>
        <SpacePadding></SpacePadding>
        <Button variant='outlined' onClick={() => {setHelpOpen(true)}}>
          Help
        </Button>
        <Dialog 
        open={helpOpen} 
        scroll='paper'
        onClose={() => {setHelpOpen(false)}}>
          <DialogTitle>{'How to Get Host URLs and Access Tokens'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              PLACEHOLDER
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
    </Centered>
  );
};