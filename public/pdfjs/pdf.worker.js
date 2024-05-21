import Image from 'next/legacy/image';
import React, { useState, useRef, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useContext } from 'react';
import NProgress from 'nprogress'; 
import { useRouter } from 'next/router';
import DataContext from '@/utils/DataContext';
import chatPDF from '@/services/ChatPDF';
import allCommonApis from '@/services/Common';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generatePresignedUrl } from '@/utils/common';
export default function UploadPdf({ onFileSelect }) {
    const [pdfText, setPdfText] = useState('');
    const[isLoading, setIsLoading]=useState(false)
    const [pdfName, setPdfName] = useState(null);
    const [pdf, setPdf] = useState(null);
    const[user, setUser]=useState({})
    const fileInputRef = useRef(null);
    const router = useRouter()
    const { pdfData, setPdfData, setSourceId,setSelectedPdf,selectedPdf,selectedTab,setSelectedTab,chatMessage,setChatMessage  } = useContext(DataContext);

    useEffect(()=>{
      const user = JSON.parse(localStorage?.getItem("User"))
      if(user){
          setUser(user)
          
      }
    },[])

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


    const parsePDF = async (pdfData) => {
        try {
            const pdfjsLib = await import('pdfjs-dist/build/pdf');
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

            console.log('PDF.js library imported:', pdfjsLib);

            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            const pdf = await loadingTask.promise;
            const textArray = []; // Array to store text from each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => item.str).join(' '); // Join text items into a single string
                textArray.push(pageText); // Store text from each page in the array
            }
            const text = textArray.join(' '); // Join text from all pages into a single string
            console.log('Extracted PDF text:', text);
            return text;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            return ''; // Return empty string in case of error
        }
    }; 

    const sendMessage = (userMessages,sourceId) => {
        setIsLoading(true);
         // Extract the last 10 messages from the userMessages array
    const lastMessages = userMessages.slice(-10);
        const message = {
          sourceId: sourceId,
          messages: lastMessages // Passing user messages to the API call
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

      const handleChat=(async(message, role)=>{
        try{
          const messageData ={
            file_id: selectedTab,
            content: message,
            role: role,
            userId: user._id
          }
       
          const response = await allCommonApis(`/Chat/add-chat`,'post',messageData);
          if (response.status == 200) {
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

    const handleDefaultFile = async (formData, sourceId) => {
        try {
            // const formData = new FormData()
            // formData.append('file', selectedPdf)
            formData.append('user_id', user._id);  
            formData.append('sourceId', sourceId);  
            // Start NProgress when the signup process begins
            // NProgress.start();
            const response = await allCommonApis("/File/create-default-file",'post',formData)
            if (response.status=="200") {
const url = await generatePresignedUrl(response.data?.data?.fileUrl)                
              
                setSelectedPdf(url)
                setSelectedTab(response.data?.data?._id)
                setSourceId(response.data?.data?.sourceId)
                sessionStorage.setItem('selectedTab', response.data?.data?._id)
                sessionStorage.setItem('selectedPdf',url)
                sessionStorage.setItem('sourceId',response.data?.data?.sourceId)
                if(!chatMessage.length>=1){
                    await handleSendMessage(sourceId);
                  }
                router.push(`/chat/${sourceId}`);
            } else {
                // Handle other cases where the status code is 200 but login failed for some reason
                // setError('An error occurred while uploading file. Please try again.');
                toast.error("Error in uploading pdf")
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error in uploading pdf")
                setIsLoading(false);
            // setError('An error occurred while uploading. Please try again.');
        } finally {
            setIsLoading(false);
            // Make sure to stop NProgress even if there's an error
            NProgress.done();
        }
    };    
    // // PDF textual data 
    // useEffect(() => {
    //     console.log("pdfText: ", pdfText)
    // }, [pdfText]);

    const uploadPDFByFile = async (formData) => {
        setIsLoading(true);
        chatPDF.uploadPDFByFile(formData, async (response) => { // Make the callback function async
          if (response.status === "success") {
            setSourceId(response.data.sourceId);
            if (response.data.sourceId) {
              await handleDefaultFile(formData,response?.data?.sourceId);
              
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
      

      const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        // Check if the user is logged in
        const isLoggedIn = JSON.parse(localStorage.getItem('User'));
        const JWTToken = localStorage.getItem('JWTToken');
    
        if (!isLoggedIn || !JWTToken) {
            // User is not logged in
            alert('You need to login first.');
            return; // Stop further processing
        }
    
        if (file) {
            // Check file size
            if (file.size > 50 * 1024 * 1024) {
                // File size exceeds 2MB
                alert('File size exceeds 50MB. Please select a smaller file.');
                return; // Stop further processing
            }
    
            // Check file type
            if (file.type !== 'application/pdf') {
                // File type is not PDF
                alert('Please select a PDF file.');
                return; // Stop further processing
            }
    
            // File size and type are valid
            setPdf(file);
            setPdfName(file.name);
            let formData = new FormData();
            formData.append('File', file);
    
            try {
                await uploadPDFByFile(formData);
    
                if (typeof onFileSelect === 'function') {
                    onFileSelect(file);
                }
            } catch (error) {
                console.error('Error uploading PDF:', error);
                // Handle error here, you can reset input values
                setPdf(null);
                setPdfName(null);
                setSelectedPdf(null);
                toast.error("Error uploading PDF. Please try again.");
            }
        }
    };
    
    
    
    
    const handleFileChange = (event) => {
        handleFileUpload(event);
        // savePDF(event);
    };

    const handleButtonClick = () => {
        // Trigger the click event of the hidden file input
        fileInputRef.current.click();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];

        // Check if the file type is PDF
        if (file && file.type === 'application/pdf') {
            setPdfText(file);
            // Do something with the selected file
        } else {
            console.error('Please select a PDF file');
            setPdfText(null); // Reset selected file if not PDF
        }
        // Do something with the dropped file
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUrlClick = (event) => {
        event.stopPropagation();
        // Handle the click event for the URL option
        // Perform the necessary actions, e.g., open a dialog for entering URL
        console.log('URL option clicked');
    };

    const renderTooltip = (props) => (
        <Tooltip className='custom-tooltip' id="button-tooltip" {...props}>
            <Form.Control
                type="text"
                id="file-url"
                placeholder='https://example.com/file.pdf'
                onClick={handleUrlClick}
            />
        </Tooltip>
    );

    const CustomTooltip = ({ children }) => (
        <OverlayTrigger
            placement="bottom"
            trigger='click'
            overlay={renderTooltip}
            rootClose={true} // Close the overlay when clicking outside
        >
            {children}
        </OverlayTrigger>
    );

    return (
        <div
            className='upload-container'
            onClick={handleButtonClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
           <ToastContainer/>
            <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <div className='upload-file'>
            {isLoading ?
                 <div class="spinner-border text-primary" role="status">
                 <span class="visually-hidden">Loading...</span>
               </div>
               :
               <div className='cloud-upload'>
                    <Image
                        src='/icons/upload.svg'
                        layout='fill'
                        objectFit='contain'
                        alt='Upload File here'
                    />
                </div>
                }
                
                {!pdfName &&
                    <div className='file-name'>Drop PDF here.</div>
                }
              
                {pdfName && <div className='file-name'>{pdfName.name}</div>}
                <div className='link-wrapper d-flex justify-content-center'>
                    <div className='link-text'>Upload from Computer</div>
                    <div className='gap-text'>or</div>
                    <CustomTooltip>
                        <div className='link-text' onClick={handleUrlClick}>URL</div>
                    </CustomTooltip>
                </div>
                    <p className='text my-2'>MAX PDF (50MB)</p>
            </div>
        </div>
    );
}
