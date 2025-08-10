import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import { setToken } from '../../store/slices/authSlice';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the server, implicitly skipping the auth interceptor
      const response = await api.post('/auth/authenticate', credentials, {skipAuthInterceptor: true});
      dispatch(setToken(response.data.access_token));
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (show message to user)
    }
  };

  return (
    <Container className="mt-5 w-50 bg-dark p-5 rounded">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className='text-white'>email</Form.Label>
          <Form.Control
            type="text"
            value={credentials.email}
            onChange={(e) => setCredentials({
              ...credentials,
              email: e.target.value
            })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className='text-white'>Password</Form.Label>
          <Form.Control
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials,
              password: e.target.value
            })}
          />
        </Form.Group>

        <Button type="submit">Login</Button>
      </Form>
    </Container>
  )
}