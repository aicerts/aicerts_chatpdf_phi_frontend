import React, { useState } from 'react';
import { Carousel, Button, Card } from 'react-bootstrap';

const EventCarousel = ({ events }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % events.length);
  };

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + events.length) % events.length);
  };

  const disablePrev = activeIndex === 0;
  const disableNext = activeIndex === events.length - 1;

  // Calculate indexes for displaying items
  const prevIndex = (activeIndex - 1 + events.length) % events.length;
  const nextIndex = (activeIndex + 1) % events.length;

  return (
    <div>
      <Carousel activeIndex={1} onSelect={() => {}}>
        <Carousel.Item style={{ display: 'block' }}>
          <Card style={{ width: '18rem', display: 'block' }}>
            <Card.Img variant="top" src={events[prevIndex].image} />
            <Card.Body>
              <Card.Title>{events[prevIndex].title}</Card.Title>
              <Card.Text>{events[prevIndex].description}</Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item style={{ display: 'block' }}>
          <Card style={{ width: '18rem', display: 'block' }}>
            <Card.Img variant="top" src={events[activeIndex].image} />
            <Card.Body>
              <Card.Title>{events[activeIndex].title}</Card.Title>
              <Card.Text>{events[activeIndex].description}</Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item style={{ display: 'block' }}>
          <Card style={{ width: '18rem', display: 'block' }}>
            <Card.Img variant="top" src={events[nextIndex].image} />
            <Card.Body>
              <Card.Title>{events[nextIndex].title}</Card.Title>
              <Card.Text>{events[nextIndex].description}</Card.Text>
            </Card.Body>
          </Card>
        </Carousel.Item>
      </Carousel>
      <Button onClick={handlePrev} disabled={disablePrev}>Prev</Button>
      <Button onClick={handleNext} disabled={disableNext}>Next</Button>
    </div>
  );
};

export default EventCarousel;
