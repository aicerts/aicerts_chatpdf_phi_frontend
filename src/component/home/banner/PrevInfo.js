import React, { useEffect, useState } from 'react';
import SectionInfo from '@/shared/sectionInfo';
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/legacy/image';
import Link from 'next/link'
import { useRouter } from 'next/router';
const sectionInfo = [
    {
        'title': 'Continue where you left...',
        'name' : 'Chat History' 
    }
]

const PrevInfoComponent = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState("");


    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('User'))
        if(user){
            setIsLoggedIn(user)
        }
    },[])

   
    return (
        <div className='section-pad prev-info'>
            <Container className='folders-container'>
                {sectionInfo.map((item, index) => (
                    <SectionInfo
                        key={index}
                        sectionName={item.name}
                        sectionTitle={item.title}
                        textCenter
                        white
                    />
                ))}
                <Row className='folders'>
                    <Col xs={12} md={4} lg={4}>
                        <div className='prev-info position-relative'>
                            <Image
                                src="/icons/folders.svg"
                                layout="fill"
                                objectFit="contain"
                                alt="Previous information"
                            />
                            <div className='my-chat'>My Chat</div>
                            <div className='file-name'>My Chat</div>
                            <div className='last-used'>Last Used: <strong>12/04/2024</strong></div>
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div className='prev-info position-relative'>
                            <Image
                                src="/icons/folders.svg"
                                layout="fill"
                                objectFit="contain"
                                alt="Previous information"
                            />
                            <div className='my-chat'>My Chat</div>
                            <div className='file-name'>My Chat</div>
                            <div className='last-used'>Last Used: <strong>12/04/2024</strong></div>
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div className='prev-info position-relative'>
                            <Image
                                src="/icons/folders.svg"
                                layout="fill"
                                objectFit="contain"
                                alt="Previous information"
                            />
                            <div className='my-chat'>My Chat</div>
                            <div className='file-name'>My Chat</div>
                            <div className='last-used'>Last Used: <strong>12/04/2024</strong></div>
                        </div>
                    </Col>
                </Row>
                <div className='signin text-center'>
                {!isLoggedIn && (
                    <>
                        <Link href="/login">Sign In</Link>
                        <span>&nbsp;to save your chat history.</span>
                    </>
                )}
                </div>
            </Container>
        </div>
    );
}

export default PrevInfoComponent;
