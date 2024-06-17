import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Content from './content';
import UploadPdf from '../../../../public/pdfjs/pdf.worker';
import PrevInfoComponent from './PrevInfo';

const Banner = () => {
useEffect(()=>{
    // Clear session storage
sessionStorage.clear();

},[])
    return (
        <div className='banner' style={{ backgroundImage: 'url(/bg/banner-bg.png)' }}>
            <Container>
                <Row>
                    <Col xs={12} md={8} lg={6}>
                        <Content />
                        <UploadPdf />
                    </Col>
                </Row>
            </Container>
            {/* <PrevInfoComponent /> */}
        </div>
    );
}

export default Banner;
