import React, { useContext, useEffect, useState } from 'react'
import Showpdf from './showpdf';
import ChatSection from './chatSection';
import Image from 'next/image';

const MainSection = ({isCollapsed,setIsCollapsed, isLoading, setIsLoading, childData}) => {
  const [pdfName, setPdfName] = useState("");
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
            <p className='header-p'>{pdfName}</p>
      </div>
      <div className='main-body'>
        <div className='column'>
          <Showpdf isLoading={isLoading}/>
        </div>
        <div className="vertical-line"></div>
        <div  className='column'>
          <ChatSection isLoading={isLoading} setIsLoading={setIsLoading} childData={childData}/>
        </div>
      </div>

    </div>
  )
}

export default MainSection
