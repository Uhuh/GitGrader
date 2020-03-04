import { Button, Input, TextField } from '@material-ui/core';
import * as React from 'react';

export const SetUp = () => {  
    return ( 
      <>
        <Button variant="outlined" href="#/">Home</Button>
        <form>
          <div>
            <TextField
              id="canvasKey"
              label="Canvas Access Key"
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              id="gitlabKey"
              label="GitLab Access Key"
              variant="outlined"
            />
          </div>
        </form>
      </>
    );
  };