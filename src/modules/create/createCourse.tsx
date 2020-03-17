import * as React from 'react';
import { Typography, Dialog, DialogTitle } from '@material-ui/core';

export const CreateCourse = () => {
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ canvasID: string, gitlabID: string }>) => {
    const temp = JSON.parse(localStorage.getItem('courses') || '{}');
    temp[`${event.target.canvasID}`] = event.target.gitlabID;
    localStorage.setItem('courses', JSON.stringify(temp))
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add Course</DialogTitle>
    </Dialog>
  );
};