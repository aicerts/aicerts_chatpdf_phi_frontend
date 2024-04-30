import React from 'react';
import SectionInfo from '@/shared/sectionInfo';
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Container, Row } from 'react-bootstrap';
import EventCarousel from './testimonialCarousle';

const sectionInfo = [
    {
        'title': 'What People Say About Us?',
        'name' : 'TESTIMONIALS' 
    }
]

const events = [
    {
      title: 'Event 1',
      image: '/about/ForStudents.svg',
      description: 'Description of Event 1'
    },
    {
      title: 'Event 2',
      image: '/about/MultiFileChats.svg',
      description: 'Description of Event 2'
    },
    {
      title: 'Event 3',
      image: '/about/ForResearchers.svg',
      description: 'Description of Event 2'
    },
    {
      title: 'Event 4',
      image: '/about/ForProfessionals.svg',
      description: 'Description of Event 2'
    },
    {
      title: 'Event 5',
      image: '/about/CitedSources.svg',
      description: 'Description of Event 2'
    },
    {
        title: 'Event 5',
        image: '/about/AnyLanguage.svg',
        description: 'Description of Event 2'
    }
  ];

const Testimonial = () => {
    return (
        <div className='testimonial section-pad'>
            <Container>
                {sectionInfo.map((item, index) => (
                    <SectionInfo
                        key={index}
                        sectionName={item.name}
                        sectionTitle={item.title}
                        textLeft
                    />
                ))}
                <EventCarousel events={events} />
            </Container>
        </div>
    );
}

export default Testimonial;
