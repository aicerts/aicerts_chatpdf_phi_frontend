// components/PDFList.js
import DataContext from '@/utils/DataContext';
import { useContext, useEffect, useState } from 'react';

export default function PDFList({ onFileSelect }) {
  const [pdfFiles, setPDFFiles] = useState([]);
  const { setSelectedPdf } = useContext(DataContext);

  useEffect(() => {
    async function fetchPDFList() {
      try {
        const response = await fetch('/api/pdfList');
        if (response.ok) {
          const data = await response.json();
          setPDFFiles(data.files);
        } else {
          console.error('Failed to fetch PDF list:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching PDF list:', error);
      }
    }

    fetchPDFList();
  }, []);

  const handleFileClick = async (file) => {
    try {
      const response = await fetch(`/pdf/${file}`);
      if (response.ok) {
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        onFileSelect(pdfUrl);
        handleFileUpload(file)
      } else {
        console.error('Failed to fetch PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  return (
    <div>
      <h2>List of PDF Files</h2>
      <ul>
        {pdfFiles.map((file, index) => (
          <li style={{ cursor: 'pointer' }} key={index} onClick={() => handleFileClick(file)} >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}
