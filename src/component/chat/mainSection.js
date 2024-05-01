import React, { useContext, useEffect, useState } from 'react'
import Showpdf from './showpdf';
import ChatSection from './chatSection';
import DataContext from '@/utils/DataContext';
import Image from 'next/image';

const MainSection = ({isCollapsed,setIsCollapsed, isLoading, setIsLoading}) => {
  const { selectedPdf } = useContext(DataContext);
  const [pdfName, setPdfName] = useState("")
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const pdfFileString = sessionStorage.getItem("pdfFile");
    if (pdfFileString) {
      const pdfFile = JSON.parse(pdfFileString);
      setPdfName(pdfFile?.name)
    }
  }, []);
  return (
    <div className='main-section'>
      <div className='main-header'>
            <Image alt='hideicon' width={20} height={20} onClick={toggleCollapse} className='hide-sidebar-icon' src='/icons/hide-sidebar.svg' />
            <p className='header-p'>{pdfName}</p>
      </div>
      <div className='main-body'>
  <div className='column'>
    <Showpdf isLoading={isLoading}/>
  </div>
  <div className="vertical-line"></div>
  <div  className='column'>
    <ChatSection isLoading={isLoading} setIsLoading={setIsLoading}/>
  </div>
</div>

    </div>
  )
}

export default MainSection
