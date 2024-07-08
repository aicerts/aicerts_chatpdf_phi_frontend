import Image from 'next/legacy/image';
import React, { useState, useRef, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useContext } from 'react';
import NProgress from 'nprogress'; 
import { useRouter } from 'next/router';
import DataContext from '@/utils/DataContext';
import chatPDF from '@/services/ChatPDF';
import allCommonApis from '@/services/Common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generatePresignedUrl } from '@/utils/common';

export default function UploadPdf({ onFileSelect }) {
    const [pdfText, setPdfText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfNames, setPdfNames] = useState([]);
    const [pdfs, setPdfs] = useState([]);
    const [user, setUser] = useState({});
    const fileInputRef = useRef(null);
    const router = useRouter();
    const { pdfData, setPdfData, setSourceId, setSelectedPdf, selectedPdf, selectedTab, setSelectedTab, chatMessage, setChatMessage } = useContext(DataContext);

    useEffect(() => {
        const user = JSON.parse(localStorage?.getItem("User"));
        if (user) {
            setUser(user);
        }
    }, []);

    useEffect(() => {
        const storedSelectedTab = sessionStorage.getItem('selectedTab');
        const storedSelectedPdf = sessionStorage.getItem('selectedPdf');
        const storedSourceId = sessionStorage.getItem('sourceId');

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

            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            const pdf = await loadingTask.promise;
            const textArray = [];
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => item.str).join(' ');
                textArray.push(pageText);
            }
            const text = textArray.join(' ');
            return text;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            return '';
        }
    };

    const sendMessage = (userMessages, sourceId) => {
        setIsLoading(true);
        const lastMessages = userMessages.slice(-10);
        const message = {
            sourceId: sourceId,
            messages: lastMessages
        };
        chatPDF.sendChat(message, async (response) => {
            if (response.status === "success") {
                await handleChat(response?.data?.content, "assistant");
                const newAssistantMessage = {
                    role: "assistant",
                    content: response?.data?.content
                };
                const updatedMessages = [...userMessages, newAssistantMessage];
                setChatMessage(updatedMessages);
                setIsLoading(false);
            } else {
                console.log("error");
                setIsLoading(false);
            }
        });
    };

    const handleChat = async (message, role) => {
        try {
            const messageData = {
                file_id: selectedTab,
                content: message,
                role: role,
                userId: user._id
            };
            const response = await allCommonApis(`/Chat/add-chat`, 'post', messageData);
            if (response.status != 200) {
                console.error('Error fetching PDF list:', response.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching PDF list:', error);
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (sourceId) => {
        const messages = [
            {
                role: "user",
                content: "what questions can I ask in this PDF?"
            }
        ];
        setChatMessage(messages);
        await sendMessage(messages, sourceId);
    };

    const handleDefaultFile = async (formData, sourceId) => {
        try {
            formData.append('user_id', user._id);
            formData.append('sourceId', sourceId);
            const response = await allCommonApis("/File/create-default-file", 'post', formData);
            console.log(response);
            if (response.status == "200") {
                const url = await generatePresignedUrl(response.data.data[0].fileUrl);
                setSelectedPdf(url);
                setSelectedTab(response.data?.data[0]._id);
                setSourceId(response.data?.data[0].sourceId);
                sessionStorage.setItem('selectedTab', response.data?.data[0]._id);
                sessionStorage.setItem('selectedPdf', url);
                sessionStorage.setItem('sourceId', response.data?.data[0].sourceId);
                if (!chatMessage.length >= 1) {
                    await handleSendMessage(sourceId);
                }
                router.push(`/chat/${sourceId}`);
            } else {
                toast.error("Error in uploading pdf");
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error in uploading pdf");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            NProgress.done();
        }
    };

    const uploadPDFByFiles = async (formData, files) => {
        setIsLoading(true);
        chatPDF.uploadPDFByFile(formData, async (response) => {
            if (response.status === "success") {
                setSourceId(response.data.kb_name);
                formData.delete('file');
                for (let file of files) {
                    formData.append('File', file);
                }
                formData.delete('kb_name');
                if (response.data.kb_name) {
                    await handleDefaultFile(formData, response?.data?.kb_name);
                    setIsLoading(false);
                } else {
                    toast.error("Cannot read the PDF");
                    setIsLoading(false);
                }
            } else {
                toast.error("Failed to upload pdf");
                setIsLoading(false);
            }
        });
    };

    function generateName() {
        const timestamp = new Date().getTime();
        return `src_${timestamp}`;
    }

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        const isLoggedIn = JSON.parse(localStorage.getItem('User'));
        const JWTToken = localStorage.getItem('JWTToken');

        if (!isLoggedIn || !JWTToken) {
            alert('You need to login first.');
            return;
        }

        if (files.length > 0) {
            for (let file of files) {
                if (file.size > 50 * 1024 * 1024) {
                    alert('File size exceeds 50MB. Please select a smaller file.');
                    return;
                }

                if (file.type !== 'application/pdf') {
                    alert('Please select a PDF file.');
                    return;
                }
            }

            setPdfs(files);
            setPdfNames(files.map(file => file.name));
            let formData = new FormData();
            files.forEach(file => formData.append('file', file));
            formData.append("kb_name", generateName());

            try {
                await uploadPDFByFiles(formData, files);
                if (typeof onFileSelect === 'function') {
                    onFileSelect(files);
                }
            } catch (error) {
                console.error('Error uploading PDFs:', error);
                setPdfs([]);
                setPdfNames([]);
                setSelectedPdf(null);
                toast.error("Error uploading PDFs. Please try again.");
            }
        }
    };

    const handleFileChange = (event) => {
        handleFileUpload(event);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);

        if (files.every(file => file.type === 'application/pdf')) {
            setPdfText(files);
        } else {
            console.error('Please select PDF files');
            setPdfText(null);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUrlClick = (event) => {
        event.stopPropagation();
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
            rootClose={true}
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
                accept='application/pdf'
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
            />
            <div className='upload-file'>
                {isLoading ?
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
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
                {!pdfNames.length &&
                    <div className='file-name'>Drop PDF here.</div>
                }
                {pdfNames.length > 0 && pdfNames.map((name, index) => (
                    <div className='file-name' key={index}>{name}</div>
                ))}
                <div className='link-wrapper d-flex justify-content-center'>
                    <div className='link-text'>Upload from Computer</div>
                    {/* <div className='gap-text'>or</div> */}
                    {/* <CustomTooltip>
                        <div className='link-text' onClick={handleUrlClick}>URL</div>
                    </CustomTooltip> */}
                </div>
                <p className='text my-2'>MAX PDF (50MB each)</p>
            </div>
        </div>
    );
}
