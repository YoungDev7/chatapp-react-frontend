// eslint-disable-next-line no-unused-vars
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { handleLogout } from '../store/slices/authSlice';
import '../style/Sidebar.css';

/**
 * Sidebar component that provides navigation and user actions.
 * 
 * Contains navigation links for the application and a logout button.
 * The logout functionality dispatches a logout action to clear user session
 * and authentication state.
 * 
 * @returns {React.ReactElement} Sidebar navigation component
 */
export default function Sidebar() {
  const dispatch = useDispatch();

  return (
    <Navbar bg='dark' >
      <Container>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='vh-100 p-3 flex-column w-100' variant='pills' defaultActiveKey="/">
            <Nav.Link className='text-white' href='/'>Chat</Nav.Link>
            <Nav.Link onClick={() => dispatch(handleLogout())} className=' text-light mt-auto bg-dark'>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
