import { Alert, CircularProgress, Container, FormControl, Grow, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import { setToken, setUser } from '../../store/slices/authSlice';

/**
 * Register component that handles user registration.
 * 
 * Provides a registration form with validation for:
 * - Username, email, password, and password confirmation fields
 * - Password matching validation
 * - Form submission with success/error feedback
 * 
 * The component displays different states:
 * - Registration form (initial state)
 * - Loading state during submission
 * - Success/error feedback after submission
 * 
 * Registration requests bypass the auth interceptor since no token is available yet.
 * 
 * @returns {React.ReactElement} Registration form or feedback component
 */
export default function Register() {
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ isRegistrationSuccess, setIsRegistrationSuccess ] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [isLoginSuccess, setIsLoginSuccess] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const clearAllFields = () => {
        setCredentials({
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
        });
        setEmailError(false);
        setEmailErrorMessage('');
        setPasswordError(false);
        setPasswordErrorMessage('');
        setPasswordConfirmError(false);
        setPasswordConfirmErrorMessage('');
        setNameError(false);
        setNameErrorMessage('');
    };

    const validateInputs = () => {
        let isValid = true;

        // email
        if (!credentials.email || !/\S+@\S+\.\S+/.test(credentials.email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // password lenght
        if (!credentials.password || credentials.password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        // password confirmation match
        if (!credentials.password || credentials.password !== credentials.passwordConfirm) {
            setPasswordConfirmError(true);
            setPasswordConfirmErrorMessage('Passwords dont match.');
            isValid = false;
        } else {
            setPasswordConfirmError(false);
            setPasswordConfirmErrorMessage('');
        }

        //username
        if (!credentials.username || credentials.username < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid;
    };
     
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateInputs()) {
            return;
        }
        
        setIsSubmitted(true);
        setIsLoginSuccess(null);
        setIsRegistrationSuccess(null);

        try{
            const response = await api.post('/auth/register', credentials, {skipAuthInterceptor: true});
            setIsRegistrationSuccess(true);
            
            try{
                const responseLogin = await api.post('/auth/authenticate', { email: credentials.email, password: credentials.password }, { skipAuthInterceptor: true });
                dispatch(setToken(responseLogin.data.access_token));
                dispatch(setUser(responseLogin.data.access_token));
                setIsLoginSuccess(true);
                clearAllFields();
                navigate('/');
            }catch(error){
                setIsLoginSuccess(false);
                console.log("login after registration failed: " + error);
            }
            
        }catch(error){
            setIsRegistrationSuccess(false);
            console.error("registration error " + error);
        }finally{
            setIsSubmitted(false);
        }
    };

    let buttonContent;
    if (isSubmitted) {
    buttonContent = <CircularProgress size={24} sx={{ color: 'white' }} />;
    } else {
    buttonContent = 'Register';
    }




    return (
        <Container 
            maxWidth="sm"
            sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ height: 60, mb: 1, display: 'flex', alignItems: 'center' }}>
                {isRegistrationSuccess === false && (
                    <Grow in={!isRegistrationSuccess}>
                        <Alert
                            severity="error"
                            variant='filled'
                            sx={{
                                width: '100%',
                                maxWidth: 400
                            }} >
                            Registration failed
                        </Alert>
                    </Grow>
                )}
                {isRegistrationSuccess === true && (
                    <Grow in={isRegistrationSuccess}>
                        <Alert
                            severity="success"
                            variant='filled'
                            sx={{
                                width: '100%',
                                maxWidth: 400
                            }} >
                            Registration successful
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
                    Register
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <FormControl>
                        <TextField
                            fullWidth
                            label="Username"
                            autoComplete="username"
                            id="username"
                            value={credentials.username}
                            disabled={isSubmitted}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                username: e.target.value
                            })}
                            error={nameError}
                            helperText={nameErrorMessage}
                            color={nameError ? 'error' : 'white'}
                            sx={{
                                mb: 1,
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'grey.600' },
                                    '&:hover fieldset': { borderColor: 'grey.400' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                }
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            label="Email"
                            variant="outlined"
                            value={credentials.email}
                            disabled={isSubmitted}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                email: e.target.value
                            })}
                            error={emailError}
                            helperText={emailErrorMessage}
                            color={emailError ? 'error' : 'white'}
                            sx={{
                                mb: 1,
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'grey.600' },
                                    '&:hover fieldset': { borderColor: 'grey.400' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                }
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            fullWidth
                            name="password"
                            type="password"
                            id="password"
                            label="Password"
                            autoComplete="new-password"
                            variant="outlined"
                            value={credentials.password}
                            disabled={isSubmitted}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                password: e.target.value
                            })}
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            color={passwordError ? 'error' : 'white'}
                            sx={{
                                mb: 1,
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'grey.600' },
                                    '&:hover fieldset': { borderColor: 'grey.400' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                }
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            fullWidth
                            type="password"
                            name="passwordConfirm"
                            id="passwordConfirm"
                            label="Confirm Password"
                            autoComplete="passwordConfirm"
                            variant="outlined"
                            value={credentials.passwordConfirm}
                            disabled={isSubmitted}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                passwordConfirm: e.target.value
                            })}
                            error={passwordConfirmError}
                            helperText={passwordConfirmErrorMessage}
                            color={passwordConfirmError ? 'error' : 'white'}
                            sx={{
                                mb: 1,
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'grey.600' },
                                    '&:hover fieldset': { borderColor: 'grey.400' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                }
                            }}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitted}
                        sx={{ mt: 3, mb: 3 }}
                    >
                        {buttonContent}
                    </Button>
                </Box>
                <Divider sx={{ borderColor: 'grey.600', mb: 3 }} />
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: 'primary.light'
                            }
                        }}
                    >
                        Login now
                    </Link>
                </Typography>
            </Paper>
        </Container>
    )
}


