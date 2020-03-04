import { Button, Input, TextField } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const CenteredDiv = styled.div`
  width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

export const SetUp = () => {  
  return ( 
    <CenteredDiv>
      <form>
        <TextField
          id='canvasKey'
          label='Canvas Access Key'
          variant='outlined'
          />
        <TextField
          id='gitlabKey'
          label='GitLab Access Key'
          variant='outlined'
          />
      </form>
    </CenteredDiv>
  );
};