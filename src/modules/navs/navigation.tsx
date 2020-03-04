import { Button, Typography } from '@material-ui/core';
import * as React from 'react';

export const Navigation = () => {
  return (
    <>
      <Typography variant="h3">GitGrader Home</Typography>
      <Button variant="outlined" href="#/courses">
        Courses
      </Button>
      <Button variant="outlined" href="#/setup">
        Settings
      </Button>
    </>
  )
}
