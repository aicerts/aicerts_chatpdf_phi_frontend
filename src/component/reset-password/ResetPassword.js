import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Button from '@/shared/button/button';
import NavLogoForFullBg from '../header/NavLogoForFullBg';
import NProgress from 'nprogress'; 
import { registerApi } from '@/services/Common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
const ResetPasswordComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState([]); // State to track password validity
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [code, setCode] = useState("");
    const router = useRouter();

    const [otpTimer, setOtpTimer] = useState(60); // Timer for OTP

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

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

        // Check if passwords match
        setPasswordMatch(confirmPassword === newValue);
    };

    const handleConfirmPasswordChange = (e) => {
        // Update confirm password value
        setConfirmPassword(e.target.value);

        // Check if passwords match
        setPasswordMatch(password === e.target.value);
    };   

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            NProgress.start();
            const response = await registerApi('/User/forgetPassword', 
               {
                    email,
                    password,
                    code 
                });
            if (response.data.status == "SUCCESS") {
                toast.success("Password Changed Successfully")
                setResetSuccess(false);
                router.push("/login")

            } else {
                // Password reset failed
                console.error("something went wrong"); // Handle error response
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Make sure to stop NProgress even if there's an error
            NProgress.done();
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault()
        try {
            // Start NProgress when the verification process begins
            NProgress.start();
    
            const response = await registerApi('/verify/send-verification-code', {
                    email: email
            });

    
            if (response.status=='200') {
                // Verification successful, set signupSuccess to true or perform other actions
                setResetSuccess(true);
                toast.success('Code sent to your registered mail')
                setOtpTimer(60);
            } else {
                // Verification failed, handle error

                console.error('Verification failed:', data);
            }
        } catch (error) {
            console.error('Error:', error);

        } finally {
            // Make sure to stop NProgress even if there's an error
            NProgress.done();
        }
    }

    // Effect to start countdown timer when signupSuccess is true
    useEffect(() => {
        let intervalId;
        if (resetSuccess) {
            intervalId = setInterval(() => {
                setOtpTimer((prevTimer) => {
                    if (prevTimer === 0) {
                        clearInterval(intervalId);
                        // Optionally, handle timeout
                    }
                    return prevTimer -1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalId); // Cleanup
    }, [resetSuccess]);

    // Function to handle resend OTP
    const handleResendOTP = (e) => {
        handleVerification(e)
        // Reset OTP timer to 30 seconds
        
        // Add logic to resend OTP
    }; 

    const isFormValid = email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '';

    return (
        <div className='login-wrapper'>
            <ToastContainer/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={7} lg={7}>
                        <NavLogoForFullBg />
                    </Col>
                    <Col xs={12} md={5} lg={5} className='form-container'>
                        <h1 className='title'>Reset Password.</h1>
                        {resetSuccess ? (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='mb-4' controlId='code'>
                                    <Form.Label>Enter Code</Form.Label>
                                    <Form.Control type='text' value={code} onChange={handleCodeChange} />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group controlId='password'>
                                            <Form.Label>Enter New Password</Form.Label>
                                            <Form.Control type='password'
                                                value={password} 
                                                onChange={handlePasswordChange} 
                                                className={passwordValid.length === 0 ? '' : 'border-danger-subtle'}
                                            />
                                            {passwordValid.map((error, index) => (
                                                <Form.Text key={index} className="text-danger">{error}</Form.Text>
                                            ))}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-4" controlId="confirmPassword">
                                            <Form.Label>Confirm Password*</Form.Label>
                                            <Form.Control 
                                                type='password' 
                                                name="confirmPassword" 
                                                value={confirmPassword} 
                                                onChange={handleConfirmPasswordChange} 
                                                className={passwordMatch ? '' : 'border-danger-subtle'}
                                                required 
                                            />
                                            {!passwordMatch && (
                                                <Form.Text className="text-danger">Passwords do not match.</Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    {otpTimer>0?(
                                        <p className='text-center mt-3'><span className='text'>Resend OTP  in {otpTimer} seconds</span></p>
                                    ):(
<p className='text-center mt-3'>
  <span className='text-danger' style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={handleResendOTP}>
    Resend OTP
  </span>
</p>
                                    )
                                }
                                </Row>
                                
                                <Button className='golden white w-100 mt-5' label='Reset Password' type="submit" disabled={!isFormValid} />
                            </Form>
                        ):(
                                <Form onSubmit={handleVerification}>
                                    <Form.Group className="mb-4" controlId="otp">
                                        <Form.Label>Enter Email</Form.Label>
                                        <Form.Control value={email} onChange={handleEmailChange} type="email" name="email" />
                                    </Form.Group>

                                  
                                    
                                    <Button className='golden white w-100' label='Send OTP' />
                                </Form>
                            
                        )}
                        
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResetPasswordComponent;
