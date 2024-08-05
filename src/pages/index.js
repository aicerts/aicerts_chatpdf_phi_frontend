import Banner from '@/component/home/banner/banner';
import React, { useState, useEffect, useRef  } from 'react';
import Navigation from '@/component/navigation/nav';
import About from '@/component/home/about/about';
// import Testimonial from '@/component/home/testimonial/testimonial';
import Footer from '@/component/footer/footer';
import FaqComponent from '@/component/home/Faq/Faq';
import Contact from '@/component/home/Contact/Contact';

const Index = () => {
    const [faqHeight, setFaqHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
    const contactRef = useRef(null);

    useEffect(() => {
        const faqElement = document.querySelector('.faq-component');
        const footerElement = document.querySelector('.home-footer');
        if (faqElement) {
            setFaqHeight(faqElement.offsetHeight);
        }
        if (footerElement) {
            setFooterHeight(footerElement.offsetHeight);
        }
    }, []);

    const overlapStyle = {
        marginTop: `-${faqHeight / .5}px`, // Adjust for half of the FaqComponent height
        marginBottom: `-${footerHeight / 1.5}px`, // Adjust for half of the Footer height
    };

    return (
        <>
            <Navigation />
            <Banner />
            <About />
            {/* <Testimonial /> */}
            <FaqComponent />
            <div className='contact-container' style={overlapStyle} ref={contactRef}>
                <Contact />
            </div>
            <div className='home-footer'>
                <Footer />
            </div>
        </>
    );
}

export default Index;
