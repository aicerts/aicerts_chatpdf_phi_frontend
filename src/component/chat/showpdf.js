import React, { useContext, useState } from 'react';
import PDFList from '../pdfs/PDFList';
import DisplayPdf from '../pdfs/displayPdf';
import DataContext from '@/utils/DataContext';
import Image from 'next/image';

const Showpdf = () => {
  const { selectedPdf } = useContext(DataContext);
  const [scale, setScale] = useState(0.7);
 
  const handleZoomIn = () => {
    setScale(scale => scale + 0.1);
};

const handleZoomOut = () => {
    setScale(scale => scale - 0.1);
};

const handleResetZoom = () => {
    setScale(0.7);
};
  return (
    <div>
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input-pdf" />
        <Image width={20} height={20} src="/icons/zoom-in.svg" onClick={handleZoomIn} className="icon" alt="Zoom In" title='Zoom In' />
        <Image width={20} height={20} src="/icons/reload.svg" onClick={handleResetZoom} className="icon reload-icon" alt="Reload" title='Reset' />
        <Image width={20} height={20} src="/icons/zoom-out.svg" onClick={handleZoomOut} className="icon" alt="Zoom Out" title='Zoom Out' />
      </div>
      <div className="pdf-container">
        {selectedPdf && <DisplayPdf scale={scale} url={selectedPdf} />}
      </div>
    </div>
  );
};

export default Showpdf;
