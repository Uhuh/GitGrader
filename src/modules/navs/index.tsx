import * as React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

export const HomeNav = () => {
  return (
    <>
      <Navbar bg='dark' variant='dark' fixed='top'>
        <Navbar.Brand href='#home'>GitGrader</Navbar.Brand>
        <Nav className='mr-auto'>
          <Nav.Link href='#home'>Home</Nav.Link>
          <Nav.Link href='#canvas'>Canvas</Nav.Link>
          <Nav.Link href='#git'>Git Repo</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};
