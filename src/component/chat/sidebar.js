import allCommonApis from '@/services/Common';
import DataContext from '@/utils/DataContext';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const { setPdfList,setFolders, setSelectedPdf, setSourceId, setChatMessage, selectedPdf, selectedTab, setSelectedTab } = useContext(DataContext);

  useEffect(() => {
    const user = JSON.parse(localStorage?.getItem("User"));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedSelectedTab = sessionStorage.getItem('selectedTab');
    const storedSelectedPdf = sessionStorage.getItem('selectedPdf');
    const storedSourceId = sessionStorage.getItem('sourceId');

    // Update states if data is found in sessionStorage
    if (storedSelectedTab) {
      setSelectedTab(storedSelectedTab);
    }
    if (storedSelectedPdf) {
      setSelectedPdf(storedSelectedPdf);
    }
    if (storedSourceId) {
      setSourceId(storedSourceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setShow(false);
    setInputValue(''); // Clear input value when closing modal
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const response = await allCommonApis(`/Folder/create-folder`, "post", {
        name: inputValue,
        user_id: user?._id
      });
      if (response.status === 200) {
        fetchPDFList();
      } else {
        toast.error(response?.data?.data?.error || 'Error creating folder');
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error  || 'Error creating folder');
      setIsLoading(false);
    }
  };

  async function fetchPDFList() {
    const user = JSON.parse(localStorage?.getItem("User"));
    try {
      const response = await allCommonApis(`/Folder/get-all-folders/${user._id}`);
      if (response.status === 200) {
        // Set PDF list
        setPdfList(response?.data?.data);
        handleClose();
        toast.success("Folder created successfully")
        
        // Modify data and set folders
        const modifiedData = response?.data?.data?.map(item => {
          return {
            folder: item.folder.name === "___default___" ? { ...item.folder, name: "Default" } : item.folder,
            files: item.files,
            isOpen: item.folder.name === "___default___" ? true : false // Set isOpen to true for the "Default" folder, false for others
          };
        });

        // Reorder the folders so that "Default" comes first
        const sortedFolders = modifiedData.sort((a, b) => {
          if (a.folder.name === "Default") return -1;
          if (b.folder.name === "Default") return 1;
          return 0;
        });

        // Set the folders
        setFolders(sortedFolders);
      } else {
        // Handle other cases where the status is not SUCCESS
        toast.error('Error fetching PDF list');
        setIsLoading(false);
        handleClose();
        
      }
    } catch (error) {
      console.error('Error fetching PDF list:', error);
      setIsLoading(false);
    }
  }

  const handleNavigateToHome = () => {
    router.push('/');
  };

  return (
    <div className='sidebar'>
      <Image width={20} height={20} src='/icons/robot.svg' onClick={()=>{handleNavigateToHome()}} alt='robot' className='robot-icon' />
      <hr className='line' />
      <div className='icons-container'>
        <div className='top-icons'>

          <Image width={20} height={20} onClick={() => setShow(true)} src='/icons/folder-icon.svg' alt='icon2' className='icon' title='New Folder' />
        </div>

        <div className='bottom-icons'>
          <Image width={20} height={20} src='/icons/premium-icon.svg' alt='icon1' className='icon' title='Upgrade' />
          <hr className='line' />
          <Image width={20} height={20} src='/icons/help-icon.svg' alt='icon2' className='icon' title='help' />
        </div>
      </div>
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body className='p-5'>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Folder Name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='btn btn-success m-2 '>Create</button>
            <button type="button" className='btn btn-warning' onClick={handleClose}>Cancel</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Sidebar;
