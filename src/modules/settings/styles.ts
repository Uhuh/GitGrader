import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

interface ITheme {
  body: string;
  text: string;
  toggleBorder: string;
  gradient: string;
}

const lightTheme: ITheme = {
  body: '#E2E2E2',
  text: '#363537',
  toggleBorder: '#FFF',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
};

const darkTheme: ITheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  gradient: 'linear-gradient(#091236, #1E215D)',
};

const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  a {
    color ${({ theme }) => (theme as ITheme).text}
  }

  body {
    align-items: center;
    background: ${({ theme }) => (theme as ITheme).body};
    color: ${({ theme }) => (theme as ITheme).text};
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 5%;
    padding: 0;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
  }
`;

export { lightTheme, darkTheme, GlobalStyles };