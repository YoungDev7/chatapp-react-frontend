import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grow,
  Link,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import { useAppDispatch } from '../../store/hooks';
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
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoginSuccess(null);

    try {
      // Send login request to the server, implicitly skipping the auth interceptor
      const response = await api.post('/auth/authenticate', credentials, {skipAuthInterceptor: true});
      dispatch(setToken(response.data.access_token));
      dispatch(setUser(response.data.access_token));
      setIsLoginSuccess(true);
      navigate('/');
      
    } catch (error) {
      setIsLoginSuccess(false);
      console.error('Login failed:', error);

    } finally {
      setIsLoading(false);
    }
  };

  let buttonContent;
  if (isLoading) {
    buttonContent = <CircularProgress size={24} sx={{ color: 'white' }} />;
  } else {
    buttonContent = 'Login';
  }

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 5, 
        display: 'flex', 
        justifyContent: 'center', 
        flexDirection: 'column'
      }}
    >
      <Box sx={{ height: 60, mb: 1, display: 'flex', alignItems: 'center' }}>
        {isLoginSuccess === false && (
          <Grow in={!isLoginSuccess}>
            <Alert 
              severity="error" 
              variant='filled'
              sx={{
                width:'100%',
                maxWidth: 400
              }} >
                Login failed
              </Alert>
          </Grow>
        )}
        {isLoginSuccess === true && (
          <Grow in={isLoginSuccess}>
            <Alert
              severity="success"
              variant='filled'
              sx={{
                width: '100%',
                maxWidth: 400
              }} >
              Login successful
            </Alert>
          </Grow>
        )}
      </Box>
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
            disabled={isLoading}
            error={isLoginSuccess === null || isLoginSuccess === true ? false : true}
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
            disabled={isLoading}
            error={isLoginSuccess === null || isLoginSuccess === true ? false : true}
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
            disabled={isLoading}
            sx={{ mt: 3, mb: 3 }}
          >
            {buttonContent}
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