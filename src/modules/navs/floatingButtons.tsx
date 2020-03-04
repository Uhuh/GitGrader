import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsIcon from '@material-ui/icons/Settings';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BackButton = () => {
  const Floating = styled.div`
    position: relative;
    float: left;
  `;
  return(
    <Floating>
      <Link to='/'>
        <ArrowBackIcon />
      </Link>
    </Floating>
  )
}

const SettingsButton = () => {
  const Floating = styled.div`
    position: relative;
    float: right;
  `;
  return(
    <Floating>
      <Link to='/settings'>
        <SettingsIcon />
      </Link>
    </Floating>
  )
}

export { BackButton, SettingsButton };