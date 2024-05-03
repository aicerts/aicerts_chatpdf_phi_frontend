import React, { useContext, useEffect, useState } from 'react';
import DataContext from '@/utils/DataContext';
import chatPDF from '@/services/ChatPDF';
import { useRouter } from 'next/router';
import allCommonApis from '@/services/Common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generatePresignedUrl } from '@/utils/common';
import { Modal } from 'react-bootstrap';
import Image from 'next/image';
const OptionSection = ({setIsLoading, isLoading}) => {
  const router = useRouter()
  const { setPdfList,folders,setFolders, pdfList,setSelectedPdf,setSourceId, sourceId,setChatMessage,chatMessage, selectedPdf,selectedTab,setSelectedTab } = useContext(DataContext);
 const[user, setUser]=useState({})
 const [show, setShow] = useState(false);
 const [inputValue, setInputValue] = useState('');
 const [folder_id, setFolder_id] = useState("")
  // State to manage folder visibility
  

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
  }, []);

  useEffect(()=>{

    getMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
      },[selectedTab])

  const handleClose = () => {
    setShow(false);
    setInputValue(''); // Clear input value when closing modal
  };

  const getMessages=(async()=>{
    try{
      const response = await allCommonApis(`/Chat/get-file-chat/${selectedTab}`);
          if (response.status === 200) {
    
    setChatMessage(response?.data?.data?.messages)
          }else {
            // Handle other cases where the status is not SUCCESS
            console.error('Error fetching PDF list:', response.error);
            setIsLoading(false);
            
          }
    } catch {
      // Handle other cases where the status is not SUCCESS
    toast.error("error fetching chats")
      setIsLoading(false);
    }
      })
      async function fetchPDFList() {
        const user = JSON.parse(localStorage?.getItem("User"));
        try {
            const response = await allCommonApis(`/Folder/get-all-folders/${user._id}`);
            if (response.status === 200) {
                // Set PDF list
                setPdfList(response?.data?.data);
                let selectedTabFromSession = sessionStorage.getItem('selectedTab');
                let selectedPdfFromSession = sessionStorage.getItem('selectedPdf');
                let sourceIdFromSession = sessionStorage.getItem('sourceId');
    
                if (selectedTabFromSession && selectedPdfFromSession && sourceIdFromSession) {
                    setSelectedTab(selectedTabFromSession);
                    setSelectedPdf(selectedPdfFromSession);
                    setSourceId(sourceIdFromSession);
                } else if (response?.data?.data[0]?.files[0]) {
                    const url = await generatePresignedUrl(response?.data?.data[0]?.files[0]?.fileUrl);
                    setSelectedTab(response?.data?.data[0]?.files[0]?._id);
                    setSelectedPdf(url);
                    setSourceId(response?.data?.data[0]?.files[0]?.sourceId);
                    sessionStorage.setItem('selectedTab', response?.data?.data[0]?.files[0]?._id);
                    sessionStorage.setItem('selectedPdf', url);
                    sessionStorage.setItem('sourceId', response?.data?.data[0]?.files[0]?.sourceId);
                }
    
                // Modify data and set folders
                const modifiedData = response?.data?.data?.map(item => {
                    return {
                        folder: item.folder.name === "___default___" ? { ...item.folder, name: "Default" } : item.folder,
                        files: item.files,
                        isOpen: folder_id ? item.folder._id === folder_id : item.folder.name === "___default___" // Set isOpen based on folderId
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
                console.error('Error fetching PDF list:', response.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching PDF list:', error);
            setIsLoading(false);
        }
    }
    
    
  useEffect(() => {
    fetchPDFList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const toggleFolder = (index) => {
    // Toggle the isOpen property of the clicked folder
    const updatedFolders = [...folders];
    updatedFolders[index].isOpen = !updatedFolders[index].isOpen;
    setFolders(updatedFolders);
  };


  useEffect(() => {

    if (selectedPdf) {
      // setSelectedTab(pdfFile?.name)
      handleClickPdf(selectedPdf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen=((e,id)=>{
    e.stopPropagation();
    setShow(true)
    setFolder_id(id)
  })


  const sendMessage = (userMessages,sourceId) => {
    setIsLoading(true);
    const message = {
      sourceId: sourceId,
      messages: userMessages // Passing user messages to the API call
    };
    chatPDF.sendChat(message, async (response) => {
      if (response.status === "success") {
        await handleChat(response?.data?.content,"assistant")

        const newAssistantMessage = {
          role: "assistant", 
          content: response?.data?.content 
        };
        const updatedMessages = [...userMessages, newAssistantMessage]; // Combine user and assistant messages
        setChatMessage(updatedMessages); // Update state after API call success
        setIsLoading(false);
      } else {
        console.log("error");
        setIsLoading(false);
      }
    });
  };
  useEffect(()=>{
    console.log(selectedTab,"tab")
  },[selectedTab])


  const handleChat=(async(message, role)=>{
    try{
      const messageData ={
        file_id: selectedTab,
        content: message,
        role: role
      }
   
      const response = await allCommonApis(`/Chat/add-chat`,'post',messageData);
      if (response.status === 200) {
      }else {
        // Handle other cases where the status is not SUCCESS
        console.error('Error fetching PDF list:', response.error);
        setIsLoading(false);
        
      }
    }
    catch{
      console.error('Error fetching PDF list:', error);
      setIsLoading(false);
    }
  })
  const uploadPDFByFile = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('File', inputValue);
    setIsLoading(true);
    chatPDF.uploadPDFByFile(formData, async (response) => { // Make the callback function async
      if (response.status === "success") {
        setSourceId(response.data.sourceId);
        if (response.data.sourceId) {
          await handleFile(response?.data?.sourceId);
          
          setIsLoading(false);
        } else{
            toast.error("Cannot read the PDF")
            setIsLoading(false);
        }
      } else {
        toast.error("Failed to upload pdf")
        setIsLoading(false);
      }
    });
  };

  const handleFile = async (sourceId) => {
    const formData = new FormData();
    formData.append('folder_id', folder_id);
    formData.append('sourceId', sourceId);
    formData.append('File', inputValue);
  
    try {
      const response = await allCommonApis(`/File/create-file`, 'post', formData);
      if (response.status === 200) {
        // Update selectedTab, selectedPdf, and sourceId states
        const url = await generatePresignedUrl(response?.data?.data?.fileUrl);
        setSelectedPdf(url);
        setSelectedTab(response?.data?.data?._id);
        setSourceId(response?.data?.data?.sourceId);
  
        // Update sessionStorage
        sessionStorage.setItem('selectedTab', response?.data?.data?._id);
        sessionStorage.setItem('selectedPdf', url);
        sessionStorage.setItem('sourceId', response?.data?.data?.sourceId);
  
        await fetchPDFList();
        handleClose();
        toast.success("File Added Successfully");
      } else {
        // Handle other cases where the status is not SUCCESS
        toast.error('Error Adding File');
        setIsLoading(false);
      }
    } catch (error) {
      // Handle other cases where the status is not SUCCESS
      toast.error("Error adding File")
      setIsLoading(false);
    }
  }
  

  const handleClickPdf = async (file) => {
    try {
const url = await generatePresignedUrl(file.fileUrl)
      setSelectedPdf(url)
      setSelectedTab(file?._id)
      setSourceId(file.sourceId);
      router.push(`/chat/${file.sourceId}`);
      sessionStorage.setItem('selectedTab', file?._id)
      sessionStorage.setItem('selectedPdf',url)
      sessionStorage.setItem('sourceId',file.sourceId)
      if(!chatMessage.length>=1){
        await handleSendMessage(file.sourceId);
      }
      // setSelectedPdf(blob);

    } catch (error) {
      // toast.error("unable to fetch pdf data")
      console.error('Error fetching or uploading PDF file:', error);
    }
  };
  const handleSendMessage = async (sourceId) => {
    const messages=  [
      {
        role: "user",
        content: "what questions can I ask in this PDF?"
      }
    ]
  
    setChatMessage(messages); // Update state
    await sendMessage(messages,sourceId); // Call API
  }

  const handleFileUpload = (file) => {
    setInputValue(file);
  };
  
  const handleDeleteFile=(async(file_id)=>{
    try{
      const response = await allCommonApis(`/File/delete-File/${file_id}`,'delete');
          if (response.status === 200) {
            fetchPDFList();
    toast.success("File deleted Successfully")

          }else {
            // Handle other cases where the status is not SUCCESS
            toast.error('Error deleting File');
            setIsLoading(false);
          }
    } catch {
      // Handle other cases where the status is not SUCCESS
    toast.error("Error deleting File")
      setIsLoading(false);
    }
      })

      const handleDeleteFolder=(async(folder_id)=>{
        try{
          const response = await allCommonApis(`/Folder/delete-Folder/${folder_id}`,'delete');
              if (response.status === 200) {
                fetchPDFList();
        toast.success("Folder deleted Successfully")
    
              }else {
                // Handle other cases where the status is not SUCCESS
                toast.error('Error deleting Folder');
                setIsLoading(false);
              }
        } catch {
          // Handle other cases where the status is not SUCCESS
        toast.error("Error deleting Folder")
          setIsLoading(false);
        }
          })
    


  return (
    <div className='options'>
      {/* Search input */}
      <input type='text' placeholder='Search for PDFs' className='search-input-option' />
<ToastContainer/>
      {/* Horizontal line */}
      <hr className='horizontal-line' />

      {/* Folders */}
      <div className='folder-container'>
      {folders.map((folder, index) => (
  <div key={index} className='folder'>
    {/* Folder icon, name, and delete button */}
    <div className='folder-info' onClick={() => toggleFolder(index)}>
      <div className='folder-icon'>
        <Image width={20} height={20}className='folder-icon-small' src='/icons/folder-icon-small.svg' alt='Folder Icon' />
        <span className='folder-name'>{folder?.folder?.name}</span>
      </div>
        
      {/* Delete folder icon */}
      {/* Conditionally render delete folder icon */}
      <div className='folder-right'>
      {folder.folder.name !== "Default" && (
        <Image width={20} height={20} 
        className='icons' 
        src='/icons/delete.svg' 
          alt='Delete Folder' 
          onClick={() => handleDeleteFolder(folder.folder._id)} 
        />
      )}
      <Image width={20} height={20} 
      onClick={(e) => {handleOpen(e,folder.folder._id)}} 
     className='add-icon-small mx-2' src='/icons/add-file.svg' alt='Add Icon' />
    </div>
    </div>

    {/* Files */}
    {folder.isOpen && (
      <div className='files-container'>
        {folder.files.map((file, idx) => (
          <div onClick={() => handleClickPdf(file)} key={idx} style={{ background: selectedTab == file._id ? "#CFA935" : "#F3F4F6" }} className='file file-color-golden'>
            <Image width={20} height={20} className='file-small-img' src={selectedTab == file._id ? '/icons/file-small.svg' : '/icons/file-small-gray.svg'} alt='File Icon' />
            <span className='file-name' style={{ color: selectedTab == file._id ? "#FFFFFF" : "#000000" }}>{file.name}</span>
            {/* Delete file icon */}
            <Image width={20} height={20}
              className='icons' 
              src='/icons/delete.svg' 
              alt='Delete File' 
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling to the folder toggle
                handleDeleteFile(file._id);
              }} 
            />
          </div>
        ))}
      </div>
    )}
  </div>
))}

      </div>

      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
  <Modal.Body className='p-5'>
    {isLoading ? (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      <form onSubmit={uploadPDFByFile}>
        <div className="form-group">
          {/* Replace text input with file input */}
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileUpload(e.target.files[0])} // Call handleFileUpload with the selected file
            required
          />
        </div>
        <button type="submit" className='btn btn-success m-2'>Upload</button>
        <button type="button" className='btn btn-warning' onClick={handleClose}>Cancel</button>
      </form>
    )}
  </Modal.Body>
</Modal>


    </div>
  );
};

export default OptionSection;
