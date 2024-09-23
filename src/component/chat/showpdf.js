import React, { useContext, useEffect, useState } from "react";
import DisplayPdf from "../pdfs/displayPdf";
import DataContext from "@/utils/DataContext";
import Image from "next/image";
import { Form, InputGroup } from 'react-bootstrap';
import { generatePresignedUrl } from "@/utils/common";

const Showpdf = ({selectedFolder, childData}) => {
  const { selectedPdf, setSelectedPdf } = useContext(DataContext);
  const [scale, setScale] = useState(0.7);
  const [query, setQuery] = useState("");

  const handleZoomIn = () => {
    setScale((scale) => scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((scale) => scale - 0.1);
  };

  const handleResetZoom = () => {
    setScale(0.7);
  };

  const handleSearch = (event) => {
    // console.log("Search");
    setQuery(event.target.value);
  };

  const handleSelectFile = async (fileUrl) => {
    const url = await generatePresignedUrl(fileUrl);
    setSelectedPdf(url);
  }

  return (
    <div>
      <div className="search-container">
        <InputGroup>
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder="Search..."
            className="search-input-option rounded-0"
            aria-describedby="search-pdf"
            style={{ borderRight: '0' }}
          />
          <InputGroup.Text id="search-pdf" className="bg-white rounded-0">
            <Image 
              src="/icons/magnify.svg"
              width={20}
              height={20}
              alt="Search for PDF"
            />
          </InputGroup.Text>
        </InputGroup>
        <div className="search-btn ">
          <Image
            width={20}
            height={20}
            src="/icons/zoom-in.svg"
            onClick={handleZoomIn}
            className="icon"
            alt="Zoom In"
            title="Zoom In"
          />
        </div>
        <div className="search-btn ">
          <Image
            width={20}
            height={20}
            src="/icons/zoom-out.svg"
            onClick={handleZoomOut}
            className="icon"
            alt="Zoom Out"
            title="Zoom Out"
          />
        </div>
        <div className="search-btn ">
          <Image
            width={20}
            height={20}
            src="/icons/reload.svg"
            onClick={handleResetZoom}
            className="icon reload-icon"
            alt="Reload"
            title="Reset"
          />
        </div>
      </div>
      {childData ? (
        <div className="display-file-list">
          <Form.Select className="rounded-0" onChange={(e) => handleSelectFile(e.target.value)}>
            <option><strong>Selected folder: {selectedFolder?.folder?.name}</strong></option>
            {selectedFolder && selectedFolder.files && selectedFolder.files.map((file, index) => (
              <option key={index} value={file?.fileUrl}>{file?.name}</option>
            ))}
          </Form.Select>
      </div>
      ) : (
        <></>
      )}
      <div className="pdf-container">
        {selectedPdf && (
          <DisplayPdf scale={scale} url={selectedPdf} searchQuery={query} />
        )}
      </div>
    </div>
  );
};

export default Showpdf;
