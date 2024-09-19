import React, { useEffect, useState } from 'react';
import SectionInfo from '@/shared/sectionInfo';
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import allCommonApis from '@/services/Common';
import moment from 'moment';

const sectionInfo = [
    {
        'title': 'Continue where you left...',
        'name' : 'Chat History' 
    }
];

const PrevInfoComponent = () => {
    const router = useRouter();
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const fetchData = async (userId) => {
        try {
            const response = await allCommonApis(`/Chat/chat-history/${userId}`);
            if(response.status === 200) {
                console.log(response.data)
                setChatHistory(response.data);
                console.log('chatHistory',chatHistory)
            } else {
                console.error("Error fetching chat history", response.error);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('User'));
        if (user) {
            setIsLoggedIn(user);
            fetchData(user._id);
        }
    }, []);

    return (
        <div className='section-pad prev-info'>
            {isLoggedIn ? (
                chatHistory.length === 0 ? (
                    <p>No chat history found, Upload file</p>
                ) : (
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
                            {chatHistory.map((chat, index) => (
                                <Col xs={12} md={4} lg={4} key={index}>
                                    <div className='prev-info position-relative' onClick={() => router.push(`/chat/${chat.sourceId}`)}>
                                        <Image
                                            src="/icons/folders.svg"
                                            layout="fill"
                                            objectFit="contain"
                                            alt="Previous information"
                                        />
                                        <div className='my-chat'>{chat.folder.name}</div>
                                        <div className='file-name'>{chat.name || 'My Chat'}</div>
                                        <div className='last-used'>Last Used: <strong>{moment(chat.created_at).format("DD-MM-YYYY HH:mm") || 'N/A'}</strong></div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                )
            ) : (
                <></>
            )}
            {!isLoggedIn && (
                <div className='signin text-center'>
                    <Link href="/login">Sign In</Link>
                    <span>&nbsp;to save your chat history.</span>
                </div>
            )}
        </div>
    );
};

export default PrevInfoComponent;
