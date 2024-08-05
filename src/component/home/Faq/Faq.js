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
    // {
    //     'ques': 'Can Trainers Assistant 365 speak my language?',
    //     'ans' : 'Yes, Trainers Assistant 365 can read PDFs and answer questions in any language. You can upload a PDF in one language and ask questions in another. The greeting message will be in the PDF\'s language. After that, Trainers Assistant 365 will answer in the language you ask. If a message isn\'t in the language you want, just ask Trainers Assistant 365 to change it.'
    // },
    {
        'ques': 'What is Trainers Assistant 365',
        'ans' : "The Trainer's Assistant 365 is a web application designed to help users interact with PDF documents more effectively by providing assistance and answers to questions related to the content of the PDF."
    },
    {
        'ques': 'Can I chat with Multiple files at a Time? ',
        'ans' : 'Currently, Trainers Assistant 365 does not support chatting with multiple PDF files simultaneously within a single session. If you need to work with multiple PDF documents, you can switch between files by uploading a different document. '
    },
    {
        'ques': 'Can Trainers Assistant 365 Speak all Languages? ',
        'ans' : 'No, Currently Trainers assistant 365 can read PDFs and answer questions in English Language. '
    },
    {
        'ques': 'Is Trainers Assistant 365 Free? ',
        'ans' : 'Currently, Trainers assistant 365 allows you ask 30 questions per user account.  '
    },
    {
        'ques': 'Are My files Secure ',
        'ans' : 'Trainers Assistant 365 will never share your files with anyone. They are stored on a secure cloud storage and can be deleted at any time. '
    },
    {
        'ques': 'How Do I delete a PDF from Trainers Assistant 365? ',
        'ans' : 'From the Chat view, you will be able to view a delete ICON associated with each and every PDF uploaded; by clicking on the Delete ICON, you will be able to delete a PDF file from the List.  '
    },
    {
        'ques': 'Why Can’t Trainers Assistant 365 see all PDF Pages',
        'ans' : "For each answer, Trainers Assistant 365 can look at only a few paragraphs from the PDF at once. These paragraphs are the most related to the question. Trainers Assistant 365 might say it can't see the whole PDF or mention just a few pages because it can view only paragraphs from those pages for the current question."
    },
    {
        'ques': 'How Does Trainers assistant 365 work?',
        'ans' : 'In the analyzing step, Trainers Assistant 365 creates a semantic index over all paragraphs of the PDF. When answering a question, Trainers Assistant 365 finds the most relevant paragraphs from the PDF and uses the ChatGPT API from OpenAI to generate an answer.'
    },
    {
        'ques': 'Can Trainers assistant 365 understand images and tables in PDFs? ',
        'ans' : 'Trainers Assistant 365 cannot yet read images in the PDF, including images that consist of scanned text. Text in tables is read by Trainers Assistant 365 , but it might have problems correlating the correct rows and columns. '
    },
    {
        'ques': 'Where Can I reach out, if I have any further questions?',
        'ans' : 'You can reach out to us via our filling our contact us form or reach out to us via email. '
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
