import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField } from '@material-ui/core';

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