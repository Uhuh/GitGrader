import { Button, Input, TextField } from '@material-ui/core';
import * as React from 'react';

export const SetUp = () => {
    return (
      <div>
        <form>
          <div>
            <label>
              Canvas Access Key:
              <input type="text" name="canvasKey" />
            </label>
            <input type="submit" value="Submit" />
          </div>
          <div>
            <label>
              GitLab Access Key:
              <input type="text" name="gitlabKey" />
            </label>
            <input type="submit" value="Submit" />
          </div>
        </form>
        <p>keys: <span id="canvasKey"></span></p>
        <Button href="#/">Return</Button>
      </div>
    );
  };