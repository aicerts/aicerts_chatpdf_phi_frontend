import React, { useContext, useState } from 'react';
import PDFList from '../pdfs/PDFList';
import DisplayPdf from '../pdfs/displayPdf';
import DataContext from '@/utils/DataContext';

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
        <img src="/icons/zoom-in.svg" onClick={handleZoomIn} className="icon" alt="Zoom In" title='Zoom In' />
        <img src="/icons/reload.svg" onClick={handleResetZoom} className="icon reload-icon" alt="Reload" title='Reset' />
        <img src="/icons/zoom-out.svg" onClick={handleZoomOut} className="icon" alt="Zoom Out" title='Zoom Out' />
      </div>
      <div className="pdf-container">
        {selectedPdf && <DisplayPdf scale={scale} url={selectedPdf} />}
      </div>
    </div>
  );
};

export default Showpdf;
