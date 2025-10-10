import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import { setToken, setUser } from '../../store/slices/authSlice';

/**
 * Login component that handles user authentication.
 * 
 * Provides a login form with email and password fields. On successful authentication,
 * stores the access token and user data in Redux state and navigates to the home page.
 * The authentication request bypasses the auth interceptor since no token is available yet.
 * 
 * @returns {React.ReactElement} Login form component
 */
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
      dispatch(setUser(response.data.access_token));
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (show message to user)
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 5, 
        display: 'flex', 
        justifyContent: 'center' 
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'grey.900',
          color: 'white'
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: '100%',
            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
            mb: 3
          }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({
              ...credentials,
              email: e.target.value
            })}
            sx={{ 
              mb: 3,
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'grey.600' },
                '&:hover fieldset': { borderColor: 'grey.400' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
            InputLabelProps={{ style: { color: 'white' } }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials,
              password: e.target.value
            })}
            sx={{ 
              mb: 3,
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'grey.600' },
                '&:hover fieldset': { borderColor: 'grey.400' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
            InputLabelProps={{ style: { color: 'white' } }}
          />

          <Button 
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 3 }}
          >
            Login
          </Button>

          <Divider sx={{ borderColor: 'grey.600', mb: 3 }} />

          <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
            Dont have an account?{' '}
            <Link 
              href="/register" 
              sx={{ 
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'primary.light'
                }
              }}
            >
              Register now
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}