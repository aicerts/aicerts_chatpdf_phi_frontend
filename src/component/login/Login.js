import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Link from 'next/link';
import Button from '@/shared/button/button';
import NavLogoForFullBg from '../header/NavLogoForFullBg';
import NProgress from 'nprogress'; 
import { loginPostApi } from '@/services/Common';

const LoginComponent = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [passwordValid, setPasswordValid] = useState([]); // State to track password validity

    const handlePasswordChange = (e) => {
        // Get the new value of the password field
        const newValue = e.target.value;
        
        // Validate the password and update errors
        const errors = [];
        if (!/(?=.*[a-z])/.test(newValue)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/(?=.*[A-Z])/.test(newValue)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/(?=.*\d)/.test(newValue)) {
            errors.push('Password must contain at least one numeric digit.');
        }
        if (!/(?=.*[@$!%*?&])/.test(newValue)) {
            errors.push('Password must contain at least one special character.');
        }
        if (newValue.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        
        // Update the state with the password and errors
        setPassword(newValue);
        setPasswordValid(errors);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Start NProgress when the signup process begins
            NProgress.start();
            const response = await loginPostApi("/User/authenticate",{
                email: username,
                password,
            })
            console.log(response,"res")
            if (response.status=="200") {
                router.push('/');
            } else {
                // Handle other cases where the status code is 200 but login failed for some reason
                setError('An error occurred while logging in. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while logging in. Please try again.');
        } finally {
            // Make sure to stop NProgress even if there's an error
            NProgress.done();
        }
    };    

    return (
        <div className='login-wrapper'>
            <Container fluid>
                <Row>
                    <Col xs={12} md={7} lg={7}>
                        <NavLogoForFullBg />
                    </Col>
                    <Col xs={12} md={5} lg={5} className='form-container'>
                        <h1 className='title'>LogIn to your account.</h1>
                        <Form>
                            <Form.Group className='mb-4' controlId='email'>
                                <Form.Label>Enter Email</Form.Label>
                                <Form.Control type='email' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' 
                                    value={password} 
                                    onChange={handlePasswordChange} 
                                    className={passwordValid.length === 0 ? '' : 'border-danger-subtle'}
                                />
                                {passwordValid.map((error, index) => (
                                    <Form.Text key={index} className="text-danger">{error}</Form.Text>
                                ))}
                            </Form.Group>
                            {error && <Form.Text className="text-danger">{error}</Form.Text>}
                            <div className='d-flex align-items-center justify-content-between save-it'>
                                <Form.Check
                                    inline
                                    label='Remember me'
                                    name='group1'
                                    type='checkbox'
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <Link href='/reset-password'>Reset Password</Link>
                            </div>
                            <Button className='golden white w-100' label='Log in' onClick={handleLogin} />
                        </Form>
                        <div className='no-account text-center'>
                            Dont have an account? <Link href='/register'>Create an account.</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginComponent;
