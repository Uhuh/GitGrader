import { Link } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsIcon from '@material-ui/icons/Settings';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

interface IProps {
  left: boolean;
}

const Floating = styled.div<IProps>`
  position: fixed;
  ${p => p.left ? 'left' : 'right'}: 10px;
  top: 10px;
`;

const BackButton = () => {
  return(
    <Floating left>
      <Link component={RouterLink} to='/'>
        <ArrowBackIcon fontSize='large'/>
      </Link>
    </Floating>
  );
};

const SettingsButton = () => {
  return(
    <Floating left={false}>
      <Link component={RouterLink} to='/settings'>
        <SettingsIcon fontSize='large'/>
      </Link>
    </Floating>
  );
};

export { BackButton, SettingsButton };