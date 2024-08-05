import Button from '@/shared/button/button';
import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image'
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Navigation = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState("");
    const [firstName, setFirstName] = useState("");

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('User'))
        if(user){
            setIsLoggedIn(true)
            setFirstName(user?.firstName || "")
        }
    },[])

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('User');
        localStorage.removeItem('JWTToken');
        setIsLoggedIn(false);
        setFirstName('');

        // Redirect to login page
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/login')
    }

    const handleHome = () => {
        router.push('/')
    }

    return (
        <Navbar expand="lg" className="navbar bg-body-tertiary">
            <Container>
                <Navbar.Brand style={{ padding:"10px 0 0 0"}} onClick={handleHome}>
                    <Image 
                        src="/logo/Logo-original.png"
                        width={180}
                        height={40}
                        alt='ChatPDF'
                        style={{ cursor: 'pointer' }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-end align-items-center w-100">
                    {/* <Nav.Link href="#home">API</Nav.Link>
                    <Nav.Link href="#faq">FAQs</Nav.Link>
                    <Nav.Link href="#link">Affiliate</Nav.Link>
                    <Nav.Link href="#link">Contact</Nav.Link>
                    <Nav.Link href="#link">|</Nav.Link> */}
                    <Nav.Link>
                        {isLoggedIn?(
                            <>
                                    <span>Hello, {firstName}!</span>
                                    <button onClick={handleLogout} className="btn btn-primary m-2">Logout</button>
                                </>
                        ):(
                            <Button className='button outlined' label="Sign In" onClick={handleSignup} />

                        )    
                        }
                    </Nav.Link>
                    {/* <Nav.Link>
                        <Button className='button golden-upload' label="Get Premium" />
                    </Nav.Link> */}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
