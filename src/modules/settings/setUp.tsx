import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
         FormControl, Grid, InputLabel, Popover, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

/*
THINGS TO DO:
-
*/

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

export const MissingSettings = () => {
  const noSettings = (localStorage.getItem('CHdata') === null || localStorage.getItem('GHdata') === null ||
                      localStorage.getItem('CTdata') === null || localStorage.getItem('GTdata') === null ||
                      localStorage.getItem('CHdata') === '' || localStorage.getItem('GHdata') === '' ||
                      localStorage.getItem('CTdata') === '' || localStorage.getItem('GTdata') === '') 
                      ? true : false;

  return (
    <Dialog open={noSettings}>
      <DialogTitle>{'Missing Settings'}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          One or more host URLs and access tokens are missing or have yet
          to be setup. Please input the missing host URLs or access tokens in
          the settings page.
        </DialogContentText>
        <DialogActions>
          <Button 
           variant='outlined' 
           color='primary'
           href='#/settings'>
            Settings
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export const SetUp = () => {
  const [canvasHost, setCanvasHost] = React.useState('');
  const [gitlabHost, setGitlabHost] = React.useState('');
  const [canvasToken, setCanvasToken] = React.useState('');
  const [gitlabToken, setGitlabToken] = React.useState('');
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [anchorCT, setAnchorCT] = React.useState<HTMLButtonElement | null>(null);
  const [anchorGT, setAnchorGT] = React.useState<HTMLButtonElement | null>(null);

  const showCT = Boolean(anchorCT);
  const showGT = Boolean(anchorGT);
  const settingsForm = document.getElementById('settings') as HTMLFormElement;

  const CanvasHost = JSON.parse(localStorage.getItem('CHdata') || 'null');
  const GitlabHost = JSON.parse(localStorage.getItem('GHdata') || 'null');
  const CanvasToken = JSON.parse(localStorage.getItem('CTdata') || 'null');
  const GitlabToken = JSON.parse(localStorage.getItem('GTdata') || 'null'); 
  
  const hostRegex = new RegExp(/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);

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
    if(canvasHost.length != 0){
      localStorage.setItem('CHdata', JSON.stringify(canvasHost));}
    if(gitlabHost.length != 0){
      localStorage.setItem('GHdata', JSON.stringify(gitlabHost));}
    if(canvasToken.length != 0){
      localStorage.setItem('CTdata', JSON.stringify(canvasToken));}
    if(gitlabToken.length != 0){
      localStorage.setItem('GTdata', JSON.stringify(gitlabToken));}
    setCanvasHost('');
    setGitlabHost('');
    setCanvasToken('');
    setGitlabToken('');
    settingsForm.reset();
  };
  
  const clearForm = () => { 
    localStorage.setItem('CHdata', '');
    localStorage.setItem('GHdata', '');
    localStorage.setItem('CTdata', '');
    localStorage.setItem('GTdata', '');
    setCanvasHost('');
    setGitlabHost('');
    setCanvasToken('');
    setGitlabToken('');
    settingsForm.reset();
    handleAlertClose();
  };
  
  const inputEmpty = () => {
    if((!CanvasHost && !GitlabHost && !CanvasToken && !GitlabToken) ||
        (CanvasHost === '' && GitlabHost === '' &&
         CanvasToken === '' && GitlabToken === '')){
      if(canvasHost.length === 0 || gitlabHost.length == 0 ||
        canvasToken.length === 0 || gitlabToken.length === 0) {
        return true;
      } else {
        return false;
      }
    }
    if(!(hostRegex.test(canvasHost)) || !(hostRegex.test(gitlabHost))){
      return true;
    }
    if(canvasHost.length === 0 && gitlabHost.length == 0 &&
       canvasToken.length === 0 && gitlabToken.length === 0) {
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
          <TextField
           id='canvasHost'
           variant='outlined' 
           error={hostRegex.test(canvasHost) ? false : true}
           helperText={hostRegex.test(canvasHost) ? '' :'Invalid URL (Did you use "https://"?)'}
           onChange={(e) => {setCanvasHost(e.target.value);}} 
           label='Canvas Host URL' />
        </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <FormControl variant='outlined'>
          <TextField 
           id='gitlabHost'
           variant='outlined'
           error={hostRegex.test(gitlabHost) ? false : true}
           helperText={hostRegex.test(gitlabHost) ? '' : 'Invalid URL (Did you use "https://"?)'}
           onChange={(e) => {setGitlabHost(e.target.value);}} 
           label='GitLab Host URL' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <FormControl variant='outlined'>
          <TextField 
           id='canvasToken' 
           variant='outlined'
           onChange={(e) => {setCanvasToken(e.target.value);}} 
           label='Canvas Access Token' />
        </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <FormControl variant='outlined'>
          <TextField 
           id='gitlabToken' 
           variant='outlined'
           onChange={(e) => {setGitlabToken(e.target.value);}} 
           label='GitLab Access Token' />
        </FormControl>
        <SpacePadding></SpacePadding>
        <Grid 
         container
         direction='row'
         alignItems='center' 
         justify='center'>
          <Button 
           disabled={inputEmpty()}
           color='primary' 
           variant='outlined'
           style={{maxWidth: '100px', maxHeight: '40px', minWidth: '100px', minHeight: '40px'}}
           type='submit'
           onClick={handleConfirmOpen}>
            Update
          </Button>
          <Dialog open={confirmOpen} onClose={handleConfirmClose}>
            <DialogTitle>{'Settings Updated'}</DialogTitle>
          </Dialog>
          &nbsp;&nbsp;&nbsp;
          <Button 
            disabled={clearEmpty()}
            color='primary'
            variant='outlined' 
            style={{maxWidth: '100px', maxHeight: '40px', minWidth: '100px', minHeight: '40px'}}
            onClick={handleAlertOpen}>
              Clear
          </Button>
          <Dialog open={alertOpen} onClose={handleAlertClose}>
            <DialogTitle>{'Are you sure you want to clear all fields?'}</DialogTitle>
            <DialogContent dividers>
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
    <SpacePadding></SpacePadding>
    <Grid 
     container
     direction='column'
     alignItems='flex-start' 
     justify='center'>
      <div style={{display:'flex'}}>
        <Typography 
         color='primary' 
         align='left' 
         variant='h6'>
          Canvas Host URL:&nbsp;
        </Typography>
        <Typography  
         align='left' 
         variant='h6'>
          {CanvasHost}
        </Typography>
      </div>
      <div style={{display:'flex'}}>
        <Typography 
         color='primary' 
         align='left' 
         variant='h6'>
          GitLab Host URL:&nbsp;
        </Typography>
        <Typography  
         align='left' 
         variant='h6'>
          {GitlabHost}
        </Typography>
      </div>
      <div style={{display:'flex'}}>
        <Typography 
         color='primary' 
         align='left' 
         variant='h6'>
          Canvas Access Token:&nbsp;
        </Typography>
        <Button 
         onClick={(e: React.MouseEvent<HTMLButtonElement>) => {setAnchorCT(e.currentTarget);}}>
           Show
        </Button>
        <Popover
         open={showCT}
         anchorEl={anchorCT}
         onClose={() => {setAnchorCT(null);}}
         anchorOrigin={{
           vertical: 'center',
           horizontal: 'left',
         }}
         transformOrigin={{
           vertical: 'center',
           horizontal: 'left',
         }}>
          <Typography
           align='left'
           variant='h6'>
            {CanvasToken}
           </Typography>
        </Popover>
      </div>
      <div style={{display:'flex'}}>
        <Typography 
         color='primary' 
         align='left' 
         variant='h6'>
          GitLab Access Token:&nbsp;
        </Typography>
        <Button 
         onClick={(e: React.MouseEvent<HTMLButtonElement>) => {setAnchorGT(e.currentTarget);}}>
           Show
        </Button>
        <Popover
         open={showGT}
         anchorEl={anchorGT}
         onClose={() => {setAnchorGT(null);}}
         anchorOrigin={{
           vertical: 'center',
           horizontal: 'left',
         }}
         transformOrigin={{
           vertical: 'center',
           horizontal: 'left',
         }}>
          <Typography
           align='left'
           variant='h6'>
            {GitlabToken}
           </Typography>
        </Popover>
      </div>
      <Grid 
       container
       direction='column'
       alignItems='center' 
       justify='center'>
        <SpacePadding></SpacePadding>
        <Button
         variant='outlined' 
         color='secondary' 
         onClick={() => {setHelpOpen(true);}}>
          Help
        </Button>
        <Dialog 
         open={helpOpen} 
         scroll='paper'
         onClose={() => {setHelpOpen(false);}}>
          <DialogTitle>{'How to Get Host URLs and Access Tokens'}</DialogTitle>
          <DialogContent dividers>
            <h3>Canvas Information</h3>
            <ul>
              <li>
                Canvas host URLs are typically of the form &nbsp;
                <code>https://???.instructure.com</code> &nbsp; where &nbsp; 
                <code>???</code> &nbsp; is replaced with your institution's name.
              </li>
              <li>
                Canvas API access tokens must be generated and can be found at &nbsp;
                <code>https://???.instructure.com/profile/settings</code>
              </li>
            </ul>
            <h3>GitLab Information</h3>
            <ul>
              <li>
                The default GitLab URL is &nbsp; <code>https://gitlab.com</code>, however
                your institution's GitLab server may differ.
              </li>
              <li>
                GitLab API access tokens must be generated and can be found at in
                User Settings > Access Tokens.
              </li>
            </ul>
            <h4>NOTE: Host URLs MUST be preceeded with <code>https://</code></h4>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
    </Centered>
  );
};