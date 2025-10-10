import { Container, FormControl, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import api from '../../services/Api';

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
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

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

        try{
            const response = await api.post('/auth/register', credentials, {skipAuthInterceptor: true});
            setIsRegistrationSuccess(true);
        }catch(error){
            setIsRegistrationSuccess(false);
            console.error("registration error " + error);
        }
    };

    if(isSubmitted){
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
                    {isRegistrationSuccess === null && (
                        <>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    fontSize: 'clamp(1.5rem, 10vw, 2rem)',
                                    mb: 2,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Registration submitted
                            </Typography>
                            <Typography variant="body1" sx={{ pt: 3 }}>
                                please wait...
                            </Typography>
                        </>
                    )}
                    {isRegistrationSuccess !== null && (
                        <>
                            {isRegistrationSuccess === true && (
                                <>
                                    {/* TODO: change to immedietly login user */}
                                    <Typography
                                        component="h1"
                                        variant="h4"
                                        sx={{
                                            fontSize: 'clamp(1.5rem, 10vw, 2rem)',
                                            mb: 2
                                        }}
                                    >
                                        Registration Success
                                    </Typography>
                                    <Typography variant="body1" sx={{ pt: 3 }}>
                                        Registration was success! you can{' '}
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
                                            Login
                                        </Link>
                                        {' '}now
                                    </Typography>
                                </>
                            )}
                            {/* TODO: implement proper user feedback when username/email is taken */}
                            {isRegistrationSuccess === false && (
                                <>
                                    <Typography
                                        component="h1"
                                        variant="h4"
                                        sx={{
                                            fontSize: 'clamp(1.5rem, 10vw, 2rem)',
                                            mb: 2
                                        }}
                                    >
                                        Registration Error
                                    </Typography>
                                    <Typography variant="body1" sx={{ pt: 3 }}>
                                        There has been an error while registering, please try again later
                                    </Typography>
                                </>
                            )}
                        </>
                    )}
                </Paper>
            </Container>
        );
    }else {
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
                            sx={{ mt: 3, mb: 3 }}
                        >
                            Register
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
    
}

