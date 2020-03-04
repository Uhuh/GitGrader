import { Button, Dialog, DialogActions, DialogContent,
         DialogContentText, DialogTitle, Tab, Tabs, TextField } from '@material-ui/core';
import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { TabPanel } from './navs';

const GitLabAPI = new GL({
  gitlab_host: 'https://git-classes.mst.edu',
  gitlab_token: '',
  namespace: '2020-senior-test'
});

const CanvasAPI = new Canvas({
  canvas_url: 'https://mst.instructure.com',
  canvas_token: ''
});

export const firstTimeDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>First Time Setup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField id="standard-basic" label="GitLab Access Key" />
            <TextField id="standard-basic" label="Canvas Access Key" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const App = () => {
  const [val, setVal] = React.useState(0);
  
  const handleChange = (event: any, newVal: any) => {
    setVal(newVal);
  };

  return (
    <>
      <Tabs
        value={val}
        onChange={handleChange}
      >
        <Tab label='GitGrader' />
        <Tab label='Canvas' />
        <Tab label='Gitlab' />
      </Tabs>
      <TabPanel value={val} index={0}>
        <p>The GitGrader tab</p>
        <Button variant="outlined" color="primary" onClick={firstTimeDialog}>Setup</Button>
      </TabPanel>
      <TabPanel value={val} index={1}><p>The Canvas tab</p></TabPanel>
      <TabPanel value={val} index={2}><p>The Gitlab tab</p></TabPanel>
    </>
  );
};
