import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Link from 'next/link';
import Button from '@/shared/button/button';
import NavLogoForFullBg from '../header/NavLogoForFullBg';
import NProgress from 'nprogress'; 
import { registerApi } from '@/services/Common';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
const RegisterComponent = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [signupSuccess, setSignupSuccess] = useState(false); // State to track signup success to OTP
    const [otpTimer, setOtpTimer] = useState(60); // Timer for OTP
    const [passwordValid, setPasswordValid] = useState([]); // State to track password validity
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [nameError, setNameError] =useState({
        firstName:"",
        lastName:""
    })
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        agreedToTerms: false,
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // useEffect(() => {
    //     // Check if the token is available in localStorage
    //     const storedUser = JSON.parse(localStorage?.getItem('user'));
    
    //     if (storedUser && storedUser?.JWTToken) {
    //       // If token is available, set it in the state
    //       setToken(storedUser?.JWTToken);
    //     } else {
    //       // If token is not available, redirect to the login page
    //       router.push('/');
    //     }
    // }, [router]);


    const [verificationData, setVerificationData] = useState({
        email: '',
        code:  ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        let error = '';
        // Validate firstName and lastName for special characters
    if (name === 'firstName' || name === 'lastName') {
        if (!/^[a-zA-Z ]+$/.test(value)) {
            error = 'Only letters and spaces are allowed.';
        }
        setNameError({ ...nameError, [name]: error }); // Update nameError state
    }
        if (name === 'password') {
            validatePassword(value);
            setPasswordMatch(value === formData.confirmPassword);
        } else if (name === 'confirmPassword') {
            setPasswordMatch(value === formData.password);
        } 

        // Validate phone number format using regex
        if (name === 'phoneNumber') {
            // Allow only digits, spaces, dashes, and parentheses in the phone number
            newValue = newValue.replace(/[^0-9\s\-()]/g, '');
            // Limit the phone number to 10 digits
            newValue = newValue.slice(0, 10);
        }

        setFormData({ ...formData, [name]: newValue  });
    };

    const validatePassword = (password) => {
        // Validate the password and update errors
        const errors = [];
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter.</br>');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one numeric digit.');
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push('Password must contain at least one special character.');
        }
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        setPasswordValid(errors);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Start NProgress when the signup process begins
            NProgress.start();

            const response = await registerApi('/User/signup',formData);
            if (response?.data?.data) {
                // Signup successful, redirect to login page or any other page
                // Signup successful, set signupSuccess to true
                setVerificationData({ email: formData.email, code: '' });
                toast.success("Otp Send to registered Email")
                setSignupSuccess(true);
                // Optionally, clear form data
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    address: '',
                    agreedToTerms: false,
                });
            } else {
                // Signup failed, handle error
                console.error('Signup failed:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("something went wrong")

        } finally {
            // Make sure to stop NProgress even if there's an error
            NProgress.done();
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            // Start NProgress when the verification process begins
            NProgress.start();

            // Get the OTP code entered by the user
            const otpCode = e.target.elements.otp.value;
    
            const response = await registerApi('/verify/verify-code',
                {
                    email: verificationData.email, // Use email from formData
                    code: otpCode, // Use code from verificationData
                })
            // Log the response data
            if (response.data.status == "PASSED") {
                // Verification successful, set signupSuccess to true or perform other actions
                toast.success("successfully Verified")
                setSignupSuccess(false);
                // Optionally, clear verificationData
                setVerificationData({
                    email: '',
                    code: '',
                });
                router.push("/login")
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
    
    const handleVerificationResend = async () => {
        
        try {
            // Start NProgress when the verification process begins
            NProgress.start();
    
            const response = await registerApi('/verify/send-verification-code',{
                email: verificationData.email, 
            });
          
    
           
    
            if (response.data.status=="PASSED") {
                toast.success("Otp send to registered email")
                // Verification successful, set signupSuccess to true or perform other actions
                setSignupSuccess(true);
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
        if (signupSuccess) {
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
    }, [signupSuccess]);

    // Function to handle resend OTP
    const handleResendOTP = () => {
        handleVerificationResend({});
        // Reset OTP timer to 30 seconds
        setOtpTimer(60);
        // Add logic to resend OTP
    };

    return (
        <div className='login-wrapper register'>
             <ToastContainer/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={7} lg={7}>
                        <NavLogoForFullBg />
                    </Col>
                    <Col xs={12} md={5} lg={5} className='form-container'>
                        <h1 className='title'>Register an Account</h1>
                        {!signupSuccess ? (
                            <>
                                <Form onSubmit={handleSignup}>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-4" controlId="firstName">
                                                <Form.Label>First Name*</Form.Label>
                                                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                                {nameError.firstName && (
                                                    <Form.Text className="text-danger">{nameError?.firstName}</Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-4" controlId="lastName">
                                                <Form.Label>Last Name*</Form.Label>
                                                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                                {nameError.lastName && (
                                                    <Form.Text className="text-danger">{nameError?.lastName}</Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-4" controlId="email">
                                        <Form.Label>Email Address*</Form.Label>
                                        <Form.Control type='email' name="email" value={formData.email} onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Row>
                                        <Col>
                                        <Form.Group className="mb-4" controlId="password">
    <Form.Label>Password*</Form.Label>
    <div style={{ position: 'relative' }}>
        <Form.Control 
            type={showPassword?'text':'password'} 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
            className={passwordValid.length === 0 ? '' : 'border-danger-subtle'}
            required 
        />
        {showPassword ? 
            <AiFillEyeInvisible onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} /> : 
            <AiFillEye onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
        }
    </div>
    {passwordValid.map((error, index) => (
        <Form.Text key={index} className="text-danger" dangerouslySetInnerHTML={{ __html: error }} />
    ))}
</Form.Group>

                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-4" controlId="confirmPassword">
    <Form.Label>Confirm Password*</Form.Label>
    <div style={{ position: 'relative' }}>
        <Form.Control 
            type={showPassword?'text':'password'} 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleInputChange} 
            className={passwordMatch ? '' : 'border-danger-subtle'}
            required 
        />
        {showPassword ? 
            <AiFillEyeInvisible onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} /> : 
            <AiFillEye onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
        }
    </div>
    {!passwordMatch && (
        <Form.Text className="text-danger">Passwords do not match.</Form.Text>
    )}
</Form.Group>

                                        </Col>
                                    </Row>
                                    
                                    <Form.Group className="mb-4" controlId="phoneNumber">
                                        <Form.Label>Phone Number*</Form.Label>
                                        <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="address">
                                        <Form.Label>Address (Optional)</Form.Label>
                                        <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} />
                                    </Form.Group>
                                    <div className='save-it'>
                                        <Form.Check
                                            inline
                                            label={(
                                                <>I agree to the <Link target='_blank' href="https://www.aicerts.io/privacy-policy">terms and conditions.</Link></>
                                            )}
                                            name="agreedToTerms"
                                            type='checkbox'
                                            checked={formData.agreedToTerms}
                                            onChange={handleCheckboxChange}
                                        />
                                    </div>
                                    <Button 
                                        className='golden white w-100' 
                                        label='Sign up' 
                                        type="submit" 
                                        disabled={
                                            !formData.agreedToTerms || 
                                            !formData.firstName ||
                                            !formData.lastName ||
                                            !formData.email ||
                                            !formData.password ||
                                            !formData.phoneNumber ||
                                            nameError.firstName  ||
                                            nameError.lastName || 
                                            !passwordMatch ||
                                            !passwordValid.length<1


                                        } 
                                    />
                                </Form>
                                <div className='no-account text-center'>
                                    Already have an account? <Link href="/login">Log In</Link>
                                </div>
                            </>
                        ) : (
                            // Render OTP input or Resend OTP button based on otpTimer
                            otpTimer > 1 ? (
                                <Form onSubmit={handleVerification}>
                                    <Form.Group className="mb-4" controlId="otp">
                                        <Form.Label>Enter OTP*</Form.Label>
                                        <Form.Control type="text" name="otp" />
                                    </Form.Group>
                                    <p className='text-center mt-3'>OTP will expire in <span className='text-danger'>{otpTimer}</span> seconds</p>
                                    <Button className='golden white w-100' label='Submit OTP' />
                                </Form>
                            ) : (
                                <Form onSubmit={handleVerification}>
                                    <Form.Group className="mb-4" controlId="otp">
                                        <Form.Label>Enter OTP*</Form.Label>
                                        <Form.Control type="text" name="otp" />
                                    </Form.Group>
                                    <p className='text-center mt-3'>OTP expired. <span className='text-danger' onClick={handleResendOTP}>Resend OTP?</span> seconds</p>
                                    <Button className='golden white w-100' label='Submit OTP' />
                                </Form>
                                // <div>
                                //     <Button className='golden white w-100' label='Resend OTP'  />
                                //     <p className='text-center mt-3 text-danger'>OTP expired. Resend OTP?</p>
                                // </div>
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default RegisterComponent;
