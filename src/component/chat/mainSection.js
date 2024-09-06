import React, { useEffect, useState } from 'react'
import Showpdf from './showpdf';
import ChatSection from './chatSection';
import Image from 'next/image';

const MainSection = ({isCollapsed,setIsCollapsed, isLoading, setIsLoading, childData, selectedFolder}) => {
  const [pdfName, setPdfName] = useState("");
  // const [selectedFolder, setSelectedFolder] = useState([]);

  // const handleSelectFolder = (newFolder) => {
  //   setSelectedFolder(newFolder);
  // };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const pdfFileString = sessionStorage.getItem("pdfFile");
    if (pdfFileString) {
      setPdfName(pdfFileString)
    }
  }, []);

  return (
    <div className='main-section'>
      <div className='main-header'>
            <Image alt='hideicon' width={24} height={24} onClick={toggleCollapse} className='hide-sidebar-icon' src='/icons/hide-sidebar.svg' />
            {/* <p className='header-p'>{pdfName}</p> */}
      </div>
      <div className='main-body'>
        <div className='column'>
          <Showpdf isLoading={isLoading} selectedFolder={selectedFolder} childData={childData} />
        </div>
        <div className="vertical-line"></div>
        <div  className='column'>
          <ChatSection isLoading={isLoading} setIsLoading={setIsLoading} selectedFolder={selectedFolder} childData={childData}/>
        </div>
      </div>

    </div>
  )
}

export default MainSection
