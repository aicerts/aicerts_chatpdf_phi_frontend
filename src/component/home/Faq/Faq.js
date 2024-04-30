import React from 'react';
import SectionInfo from '@/shared/sectionInfo';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import Contact from '../Contact/Contact';

const sectionInfo = [
    {
        'title': 'Frequently Asked Questions',
        'name' : 'FAQs' 
    }
]

const accordionInfo = [
    {
        'ques': 'Can ChatPDF speak my language?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Can I chat with multiple PDF files at the same time?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'How do I delete a PDF from ChatPDF?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'What is the cancellation policy?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Where do I post feature requests or bug reports?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Is ChatPDF free?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Are my files secure?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Why can\'t ChatPDF see all PDF pages?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Can ChatPDF understand images and tables in PDFs?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Is there an API to integrate ChatPDF?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    },
    {
        'ques': 'Are my files secure?',
        'ans' : 'Yes, ChatPDF can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, ChatPDF will answer in the language you ask. If a message isn\'t in the language you want, just ask ChatPDF to change it.'
    }
]

const FaqComponent = () => {
    // Split accordion items into two columns
    const firstColumnItems = accordionInfo ? accordionInfo.slice(0, 6) : [];
    const secondColumnItems = accordionInfo ? accordionInfo.slice(6) : [];   

    return (
        <div className='faq-arapper section-pad' id="faq">
            <Container>
                {sectionInfo.map((item, index) => (
                    <SectionInfo
                        key={index}
                        sectionName={item.name}
                        sectionTitle={item.title}
                        textCenter  
                    />
                ))}
                <Row>
                    {/* First column */}
                    <Col md={6}>
                        <Accordion defaultActiveKey="0" flush>
                            {firstColumnItems.map((item, index) => (
                                <Accordion.Item eventKey={index} key={index}>
                                    <Accordion.Header>
                                        {item.ques}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {item.ans}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Col>

                    {/* Second column */}
                    <Col md={6}>
                        <Accordion defaultActiveKey="0" flush>
                            {secondColumnItems.map((item, index) => (
                                <Accordion.Item  eventKey={index} key={index}>
                                    <Accordion.Header>
                                        {item.ques}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {item.ans}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default FaqComponent;
