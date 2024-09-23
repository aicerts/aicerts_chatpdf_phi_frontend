import React, { useEffect, useState } from 'react'
import Showpdf from './showpdf';
import ChatSection from './chatSection';
import Image from 'next/image';
import { Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';

const MainSection = ({isCollapsed,setIsCollapsed, isLoading, setIsLoading, childData, selectedFolder, pdfName}) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('User'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear('User')

    // Redirect to login page
    router.push('/login');
};

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className='main-section'>
      <div className='main-header justify-content-between'>
          <Image alt='hideicon' width={24} height={24} onClick={toggleCollapse} className='hide-sidebar-icon' src='/icons/hide-sidebar.svg' />
          <div class="user-profile">
            <Dropdown>
                <Dropdown.Toggle className='text-uppercase rounded-0 border-0 d-flex align-items-center'>
                  <Image src="/images/profile-pic.webp" width={30} height={30} alt="Profile Picture" />
                  {user ? (
                      <>{user?.firstName} {user?.lastName}</>
                  ) : (
                      <>NA</>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.99983 13.3333C9.89016 13.334 9.78144 13.3129 9.67991 13.2715C9.57838 13.23 9.48603 13.1689 9.40816 13.0917L4.40816 8.09166C4.25124 7.93474 4.16309 7.72192 4.16309 7.5C4.16309 7.27808 4.25124 7.06525 4.40816 6.90833C4.56508 6.75141 4.77791 6.66325 4.99983 6.66325C5.22175 6.66325 5.43458 6.75141 5.5915 6.90833L9.99983 11.325L14.4082 6.91666C14.5676 6.78014 14.7726 6.7088 14.9824 6.7169C15.1921 6.725 15.3911 6.81195 15.5395 6.96036C15.6879 7.10877 15.7748 7.30772 15.7829 7.51745C15.791 7.72718 15.7197 7.93225 15.5832 8.09166L10.5832 13.0917C10.4279 13.2456 10.2184 13.3324 9.99983 13.3333Z" fill="#5B5A5F"/>
                  </svg>
                </Dropdown.Toggle>
                <Dropdown.Menu className='rounded-0'>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
      </div>
      <div className='main-body'>
        <div className='column'>
          <Showpdf isLoading={isLoading} selectedFolder={selectedFolder} childData={childData} />
        </div>
        <div className="vertical-line"></div>
        <div  className='column'>
          <ChatSection isLoading={isLoading} setIsLoading={setIsLoading} selectedFolder={selectedFolder} childData={childData} pdfName={pdfName} />
        </div>
      </div>
    </div>
  )
}

export default MainSection
