// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Nav } from 'react-bootstrap';
import '../style/Sidebar.css';

export default function Sidebar() {
  return (
    <div className='sidebar bg-dark'>
      <Nav className='flex-column'>
        <Nav.Link href='/'>Chat</Nav.Link>
      </Nav>
    </div>
  )
}
