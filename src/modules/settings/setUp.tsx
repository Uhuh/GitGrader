import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
         FormControl, Grid, InputLabel, OutlinedInput, Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const SpacePadding = styled.div`
  margin-bottom: 20px;
`;

export const SetUp = () => {
  const [canvasHost, setCanvasHost] = React.useState('');
  const [gitlabHost, setGitlabHost] = React.useState('');
  const [canvasToken, setCanvasToken] = React.useState('');
  const [gitlabToken, setGitlabToken] = React.useState('');
  const [alertOpen, setAlertOpen] = React.useState(false);
  
  const handleChangeCH = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasHost(event.target.value);
  };

  const handleChangeGH = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitlabHost(event.target.value);
  };

  const handleChangeCK = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasToken(event.target.value);
  };

  const handleChangeGK = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitlabToken(event.target.value);
  };

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Canvas Host:', canvasHost, 'GitLab Host:', gitlabHost);
    console.log('Canvas Token:', canvasToken, 'GitLab Token:', gitlabToken);
    localStorage.setItem('CHdata', JSON.stringify(canvasHost));
    localStorage.setItem('GHdata', JSON.stringify(gitlabHost));
    localStorage.setItem('CTdata', JSON.stringify(canvasToken));
    localStorage.setItem('GTdata', JSON.stringify(gitlabToken));
  };
  
  //Clearing, then changing pages and coming back retains old defaultValue, not sure why
  const clearForm = () => { 
    const settingsForm = document.getElementById('settings') as HTMLFormElement;
    CanvasHost='';
    GitlabHost='';
    CanvasToken='';
    GitlabToken='';
    setCanvasHost('');
    setGitlabHost('');
    setGitlabToken('');
    setCanvasToken('');
    settingsForm.reset();
    console.log('Canvas Host:', CanvasHost, 'GitLab Host:', GitlabHost);
    console.log('Canvas Token:', CanvasToken, 'GitLab Token:', GitlabToken);
    handleAlertClose();
  };
  
  //Need to find way to allow changes if only one field is changed
  const inputEmpty = () => {
    if(!CanvasHost || !GitlabHost || !CanvasToken || !GitlabToken) {  
      if(canvasHost.length === 0 || gitlabHost.length == 0 ||
        canvasToken.length === 0 || gitlabToken.length === 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };
      
  let CanvasHost = JSON.parse(localStorage.getItem('CHdata') || 'null');
  let GitlabHost = JSON.parse(localStorage.getItem('GHdata') || 'null');
  let CanvasToken = JSON.parse(localStorage.getItem('CTdata') || 'null');
  let GitlabToken = JSON.parse(localStorage.getItem('GTdata') || 'null');  

  return ( 
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
           defaultValue={CanvasHost}
           onChange={handleChangeCH} 
           label='Canvas Host URL' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabHost'>GitLab Host URL</InputLabel>
          <OutlinedInput 
           id='gitlabHost'
           placeholder='Please enter the host URL'
           defaultValue={GitlabHost}
           onChange={handleChangeGH} 
           label='GitLab Host URL' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='canvasToken'>Canvas Access Token</InputLabel>
          <OutlinedInput 
           id='canvasToken' 
           placeholder='Please enter your token'
           defaultValue={CanvasToken}
           onChange={handleChangeCK} 
           label='Canvas Access Token' />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='gitlabToken'>GitLab Access Token</InputLabel>
          <OutlinedInput 
           id='gitlabToken' 
           placeholder='Please enter your token'
           defaultValue={GitlabToken}
           onChange={handleChangeGK} 
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
           type='submit'>
            Save
          </Button>
          <Button variant='outlined' onClick={handleAlertOpen}>
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
        </Grid>
      </form>
    </Grid>
  );
};