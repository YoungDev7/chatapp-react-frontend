import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import api from '../../services/Api';

export default function Register() {
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ isRegistrationSuccess, setIsRegistrationSuccess ] = useState(null);
    const [showValidation, setShowValidation] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
     });
     
    const handlePasswordConfirmChange = (e) => {
        const confirmValue = e.target.value;
        setCredentials({
            ...credentials,
            passwordConfirm: confirmValue
        });
        setPasswordsMatch(credentials.password === confirmValue);
    };

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setCredentials({
            ...credentials,
            password: passwordValue
        });
        setPasswordsMatch(passwordValue === credentials.passwordConfirm);
    };
     
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowValidation(true);

        // Manual validation
        const isValid = credentials.username && 
                        credentials.email && 
                        credentials.password && 
                        credentials.passwordConfirm && 
                        credentials.password === credentials.passwordConfirm;

        if (!isValid) {
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
            <Container className='mt-5 bg-dark p-5 rounded text-white' style={{ width: '30vw' }}>
                {isRegistrationSuccess === null && (
                    <>
                        <h1 className='text-nowrap'>Registration submitted</h1>
                        <div className='pt-3'>please wait...</div>
                    </>
                )}
                {isRegistrationSuccess !== null && (
                    <>
                        {isRegistrationSuccess === true && (
                            <>
                                <h1>Registration Success</h1>
                                <div className='pt-3'>Registration was success! you can <a className='text-primary text-primary-hover text-decoration-underline' href="/login">Login</a> now</div>
                            </>
                        )}
                        {/* TODO: implement proper user feedback when username/email is taken */}
                        {isRegistrationSuccess === false && (
                            <>
                                <h1>Registration Error</h1>
                                <div className='pt-3'>There has been an error while registering, please try again later</div>
                            </>
                        )}
                    </>
                )}
            </Container>
        );
    }else {
        return (
        <Container className="mt-5 w-25 bg-dark p-5 rounded">
        <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label className='text-white'>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({
                        ...credentials,
                        username: e.target.value
                    })}
                    isInvalid={showValidation && !credentials.username}
                    isValid={showValidation && credentials.username}
                />
                <Form.Control.Feedback type="invalid">
                    Please choose a username.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className='text-white'>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({
                        ...credentials,
                        email: e.target.value
                    })}
                    isInvalid={showValidation && !credentials.email}
                    isValid={showValidation && credentials.email}
                />
                <Form.Control.Feedback type="invalid">
                    Please fill in email.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className='text-white'>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handlePasswordChange}
                    isInvalid={showValidation && !credentials.password}
                    isValid={showValidation && credentials.password}
                />
                <Form.Control.Feedback type="invalid">
                    Please fill in password.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className='text-white'>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    name="passwordConfirm"
                    value={credentials.passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                    isInvalid={showValidation && (!credentials.passwordConfirm || !passwordsMatch)}
                    isValid={showValidation && credentials.passwordConfirm && passwordsMatch}
                />
                <Form.Control.Feedback type="invalid">
                    {!credentials.passwordConfirm ? 'Please fill in password again.' : 'Passwords do not match.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Button className='w-100 mt-3' type="submit">Register</Button>

            <hr className="border border-3 border-dark-subtle" />

            <div className='text-white'>Already have an account? <a className='text-primary text-primary-hover text-decoration-underline' href="/login">Login now</a></div>
        </Form>
        </Container>
    );
    }
    
}

