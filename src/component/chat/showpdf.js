import React, { useContext, useState } from "react";
import PDFList from "../pdfs/PDFList";
import DisplayPdf from "../pdfs/displayPdf";
import DataContext from "@/utils/DataContext";
import Image from "next/image";

const Showpdf = () => {
  const { selectedPdf } = useContext(DataContext);
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
    console.log("Search");
    setQuery(event.target.value);
  };
  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-input-pdf"
          onChange={handleSearch}
        />
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
            src="/icons/reload.svg"
            onClick={handleResetZoom}
            className="icon reload-icon"
            alt="Reload"
            title="Reset"
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
      </div>
      <div className="pdf-container">
        {selectedPdf && (
          <DisplayPdf scale={scale} url={selectedPdf} searchQuery={query} />
        )}
      </div>
      {/* <nav id="raiseup">
        <ul>
          <li>
            <a href="#">Direct link 1</a>
          </li>
          <li>
            <a href="#">Direct link 2</a>
          </li>
          <li>
            <p>Menu with sub menu</p>
            <ul>
              <li>
                <a href="#">Sub-entry 1</a>
              </li>
              <li>
                <p>Sub-entry 2 with submenu</p>
                <ul>
                  <li>
                    <a href="#">3rd level link 1</a>
                  </li>
                  <li>
                    <a href="#">3rd level link 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#">Sub-entry 3</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">Direct link 3</a>
          </li>
        </ul>
      </nav> */}
    </div>
  );
};

export default Showpdf;
