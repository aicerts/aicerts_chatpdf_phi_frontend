import SectionInfo from '@/shared/sectionInfo';
import React from 'react';
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Container, Row } from 'react-bootstrap';

const sectionInfo = [
    {
        'title': 'Our PDF tools are trusted by over 6,000 <br/> Businesses worldwide',
        'name' : 'WHY US?' 
    }
]

const aboutInfo = [
    {
        'image': '/about/ForStudents.svg',
        'title': 'For Students',
        'text' : 'Study for exams, get help with homework, and answer multiple choice questions effortlessly.'
    },
    {
        'image': '/about/ForResearchers.svg',
        'title': 'For Researchers',
        'text' : 'Dive into scientific papers, academic articles, and books to get the information you need for your research.'
    },
    {
        'image': '/about/ForProfessionals.svg',
        'title': 'For Professionals',
        'text' : 'Navigate legal contracts, financial reports, manuals, and training material. Ask questions to any PDF for fast insights.'
    },
    {
        'image': '/about/MultiFileChats.svg',
        'title': 'Multi-File Chats',
        'text' : 'Create folders to organize your files and chat with multiple PDFs in one single conversation.'
    },
    {
        'image': '/about/CitedSources.svg',
        'title': 'Cited Sources',
        'text' : 'Answers contain references to their source in the original PDF document. No more flipping pages.'
    },
    {
        'image': '/about/AnyLanguage.svg',
        'title': 'Any Language',
        'text' : 'Works worldwide! ChatPDF accepts PDFs in any language and can chat in any language.'
    }
]

const About = () => {
    return (
        <div className='about-container section-pad'>
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
                    {aboutInfo?.map((item, index) => {
                        return(
                            <Col xs={12} md={4} lg={4} key={index}>
                                <Card>
                                    <CardBody>
                                        <CardImg
                                            src={item.image}
                                            alt={item.title}
                                        />
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardText>{item.text}</CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        )
                    })}                    
                </Row>
            </Container>
        </div>
    );
}

export default About;
