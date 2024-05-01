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
                src="/logo/Logo-original.png"
                width={284}
                height={50}
                alt='ChatPDF'
                onClick={handleHome}
                style={{ cursor: 'pointer' }}
            />
        </Navbar>
    );
}

export default NavLogoForFullBg;
