import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import api from '../services/Api';
import { Form, Button, Container } from 'react-bootstrap';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the server, implicitly skipping the auth interceptor
      const response = await api.post('/Auth/login', credentials, {skipAuthInterceptor: true});
      setToken(response.data.accessToken);
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
          <Form.Label className='text-white'>Username</Form.Label>
          <Form.Control
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({
              ...credentials,
              username: e.target.value
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