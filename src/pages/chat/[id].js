import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/component/chat/sidebar';
import OptionSection from '@/component/chat/optionSection';
import MainSection from '@/component/chat/mainSection';

const Chat = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const[isLoading, setIsLoading]=useState(false)
  const [childData, setChildData] = useState('');
  const [selectedFolder, setSelectedFolder] = useState([]);

  const handleChildData = (data) => {
    setChildData(data);
  };

  const handleSelectFolder = (newFolder) => {
    setSelectedFolder(newFolder);
  };

  return (
    <div className='chat-container'>
      <div className={`section first-section`}>
        <Sidebar  />
      </div>
      <div className={`section second-section ${isCollapsed ? 'collapse' : ''}`}>
        <OptionSection setIsLoading={setIsLoading} isLoading={isLoading} onSendData={handleChildData} onSelectFolder={handleSelectFolder} />
      </div>
      <div className={`section third-section ${isCollapsed ? 'full-width' : ''}`}>
        <MainSection 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          setIsCollapsed={setIsCollapsed} 
          isCollapsed={isCollapsed} 
          childData={childData}
          selectedFolder={selectedFolder}
        />
      </div>
    </div>
  );
};

export default Chat;
