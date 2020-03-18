import { Link } from '@material-ui/core';
import ThemeIcon from '@material-ui/icons/Brightness4';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

interface IProps {
  left: boolean;
}

const FloatingTop = styled.div<IProps>`
  position: fixed;
  ${p => p.left ? 'left' : 'right'}: 10px;
  top: 10px;
`;

const FloatingBottom = styled.div<IProps>`
  position: fixed;
  ${p => p.left ? 'left' : 'right'}: 10px;
  bottom: 10px;
`;

const BackButton = () => {
  return(
    <FloatingTop left>
      <Link 
       component={RouterLink} 
       onClick={() => {window.location.href = '#/'; window.location.reload();}} 
       to='/'>
        <HomeIcon fontSize='large'/>
      </Link>
    </FloatingTop>
  );
};

const SettingsButton = () => {
  return(
    <FloatingTop left={false}>
      <Link component={RouterLink} to='/settings'>
        <SettingsIcon fontSize='large'/>
      </Link>
    </FloatingTop>
  );
};

const ThemeButton = (props: { changeTheme: () => void }) => {
  return(
    <FloatingBottom 
      onClick={props.changeTheme}
      left
    >
      <ThemeIcon fontSize='large'/>
    </FloatingBottom>
  )
}
export { BackButton, SettingsButton, ThemeButton };