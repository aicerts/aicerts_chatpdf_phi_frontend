import Link from 'next/link';
import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <div className='footer'>
            <Container className='d-flex align-items-center justify-content-between'>
                <div className='copyright'>Copyright © 2010-2024 AI CERTs.io. All rights reserved.</div>
                <div className='right-link'>
                    {/* <Link href="/">Terms & Conditions</Link>
                    <Link href="/">Policy</Link>
                    <Link href="/">Imprint</Link>
                    <Link href="/">|</Link> */}
                    {/* <Link href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path d="M23.0002 22.9999V17.1399C23.0002 14.2599 22.3802 12.0599 19.0202 12.0599C17.4002 12.0599 16.3202 12.9399 15.8802 13.7799H15.8402V12.3199H12.6602V22.9999H15.9802V17.6999C15.9802 16.2999 16.2402 14.9599 17.9602 14.9599C19.6602 14.9599 19.6802 16.5399 19.6802 17.7799V22.9799H23.0002V22.9999Z" fill="white"/>
                            <path d="M7.26025 12.3199H10.5803V22.9999H7.26025V12.3199Z" fill="white"/>
                            <path d="M8.92 7C7.86 7 7 7.86 7 8.92C7 9.98 7.86 10.86 8.92 10.86C9.98 10.86 10.84 9.98 10.84 8.92C10.84 7.86 9.98 7 8.92 7Z" fill="white"/>
                            <rect x="0.5" y="0.5" width="29" height="29" rx="5.5" stroke="white"/>
                        </svg>
                    </Link>
                    <Link href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path d="M16.3933 23V15.7022H18.8418L19.2092 12.8573H16.3933V11.0412C16.3933 10.2178 16.621 9.65661 17.8031 9.65661L19.3083 9.65599V7.11138C19.048 7.07756 18.1545 7 17.1145 7C14.9428 7 13.456 8.32557 13.456 10.7594V12.8573H11V15.7022H13.456V23H16.3933Z" fill="white"/>
                            <rect x="0.5" y="0.5" width="29" height="29" rx="5.5" stroke="white"/>
                        </svg>
                    </Link> */}
                </div>
            </Container>
        </div>
    );
}

export default Footer;
