import React, { useContext, useState } from 'react';
import DisplayPdf from './displayPdf';
import PDFList from './PDFList';
import DataContext from '@/utils/DataContext';

const ParentComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { selectedPdf, setSelectedPdf } = useContext(DataContext);
  const handleFileSelect = (file) => {
    // setSelectedFile(file);
    setSelectedPdf(file)
  };

  return (
    <>
      {/* <PDFList onFileSelect={handleFileSelect} /> */}
      {selectedFile && <DisplayPdf file={selectedFile} />}
    </>
  );
};

export default ParentComponent;