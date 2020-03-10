import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsIcon from '@material-ui/icons/Settings';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BackButton = () => {
  const Floating = styled.div`
    position: fixed;
    left: 10px;
    top: 10px;
  `;
  return(
    <Floating>
      <Link to='/'>
        <ArrowBackIcon fontSize='large'/>
      </Link>
    </Floating>
  );
};

const SettingsButton = () => {
  const Floating = styled.div`
    position: fixed;
    right: 10px;
    top: 10px;
  `;
  return(
    <Floating>
      <Link to='/settings'>
        <SettingsIcon fontSize='large'/>
      </Link>
    </Floating>
  );
};

export { BackButton, SettingsButton };