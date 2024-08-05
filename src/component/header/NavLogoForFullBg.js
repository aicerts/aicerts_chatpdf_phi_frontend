import React from 'react';
import Image from 'next/legacy/image'
import { Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router';

const NavLogoForFullBg = () => {
    const router = useRouter();
    const handleHome = () => {
        router.push('/');
    };

    return (
        <Navbar>
            <Image 
                src="/logo/logo-white.png"
                width={180}
                height={40}
                alt='ChatPDF'
                onClick={handleHome}
                style={{ cursor: 'pointer' }}
            />
        </Navbar>
    );
}

export default NavLogoForFullBg;
