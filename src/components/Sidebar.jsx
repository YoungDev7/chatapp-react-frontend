// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../style/Sidebar.css';

export default function Sidebar() {
  return (
    <Navbar bg='dark' >
      <Container>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='vh-100 p-3 flex-column w-100' variant='pills' defaultActiveKey="/">
            <Nav.Link className='text-white' href='/'>Chat</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
