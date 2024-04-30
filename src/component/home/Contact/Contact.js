import React from 'react';
import Button from '@/shared/button/button';
import SectionInfo from '@/shared/sectionInfo';
import { Container, Row, Col, Form } from 'react-bootstrap';

const sectionInfo = [
    {
        'title': 'Get In Touch.',
        'name' : 'Contact Us' 
    }
]

const Contact = () => {

    return (
        <div className='contact-wrapper'>
                <Container>
                    <div className='contact-container'>
                        <Row>
                            <Col xs={12} md={6} lg={6}>
                                {sectionInfo.map((item, index) => (
                                    <SectionInfo
                                        key={index}
                                        sectionName={item.name}
                                        sectionTitle={item.title}
                                        textLeft  
                                    />
                                ))}
                                 <Form className='form-container'>
                                    <Form.Group className="mb-4" controlId="full-name">
                                        <Form.Label>Full Name*</Form.Label>
                                        <Form.Control type="text" required />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="email">
                                        <Form.Label>Email ID*</Form.Label>
                                        <Form.Control type='text' required />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="comment">
                                        <Form.Label>Comment (Optional)</Form.Label>
                                        <Form.Control as="textarea" rows={3} />
                                    </Form.Group>
                                    <Button type="submit" className='golden-send white w-100 mt-4' label="Send" />
                                </Form>
                            </Col>
                            <Col xs={12} md={6} lg={6}></Col>
                        </Row>
                    </div>
                </Container>
        </div>
    );
}

export default Contact;
