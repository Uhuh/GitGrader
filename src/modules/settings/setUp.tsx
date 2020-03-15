import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
         FormControl, Grid, InputLabel, OutlinedInput, Popover, Typography } from '@material-ui/core';
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
  const [anchorCT, setAnchorCT] = React.useState<HTMLButtonElement | null>(null);
  const [anchorGT, setAnchorGT] = React.useState<HTMLButtonElement | null>(null);

  const showCT = Boolean(anchorCT);
  const showGT = Boolean(anchorGT);
  const settingsForm = document.getElementById('settings') as HTMLFormElement;

  let CanvasHost = JSON.parse(localStorage.getItem('CHdata') || 'null');
  let GitlabHost = JSON.parse(localStorage.getItem('GHdata') || 'null');
  let CanvasToken = JSON.parse(localStorage.getItem('CTdata') || 'null');
  let GitlabToken = JSON.parse(localStorage.getItem('GTdata') || 'null');  

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
        
        <Switch
          checked={theme.theme === 'dark'}
          onClick={theme.toggleTheme}
        />
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
           type='submit'
           onClick={handleConfirmOpen}>
            Update
          </Button>
          <Dialog open={confirmOpen} onClose={handleConfirmClose}>
            <DialogTitle>{'Settings Updated'}</DialogTitle>
          </Dialog>
         <SpacePadding></SpacePadding>   
         <Button 
          disabled={clearEmpty()}
          color='primary'
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
         onClick={(e: React.MouseEvent<HTMLButtonElement>) => {setAnchorCT(e.currentTarget)}}>
           Show
        </Button>
        <Popover
         open={showCT}
         anchorEl={anchorCT}
         onClose={() => {setAnchorCT(null)}}
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
         onClick={(e: React.MouseEvent<HTMLButtonElement>) => {setAnchorGT(e.currentTarget)}}>
           Show
        </Button>
        <Popover
         open={showGT}
         anchorEl={anchorGT}
         onClose={() => {setAnchorGT(null)}}
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
         onClick={() => {setHelpOpen(true)}}>
          Help
        </Button>
        <Dialog 
         open={helpOpen} 
         scroll='paper'
         onClose={() => {setHelpOpen(false)}}>
          <DialogTitle>{'How to Get Host URLs and Access Tokens'}</DialogTitle>
          <DialogContent>
            <h3>Canvas Information</h3>
            <ul>
              <li>
                Canvas host URLs are typically of the form &nbsp;
                <code>???.instructure.com</code> &nbsp; where &nbsp; 
                <code>???</code> &nbsp; is replaced with your institution's name.
              </li>
              <li>
                Canvas API access tokens must be generated and can be found at &nbsp;
                <code>???.instructure.com/profile/setings</code>
              </li>
            </ul>
            <h3>GitLab Information</h3>
            <ul>
              <li>
                The default GitLab URL is &nbsp; <code>gitlab.com</code>, however
                your institution's GitLab server will differ.
              </li>
              <li>
                GitLab API access tokens must be generated and can be found at &nbsp;
                <code>git-classes.???.edu/profile/personal_access_tokens</code>
              </li>
            </ul>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
    </Centered>
  );
};