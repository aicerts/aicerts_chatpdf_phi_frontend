import chatPDF from '@/services/ChatPDF';
import allCommonApis from '@/services/Common';
import DataContext from '@/utils/DataContext';
import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { formatChatResponse } from '@/utils/common';

const ChatSection = ({ isLoading, setIsLoading, childData, selectedFolder }) => {
  const { pdfData, setPdfData, sourceId, chatMessage, setChatMessage, selectedTab, setSourceId, setSelectedTab, setSelectedPdf } = useContext(DataContext);
  const [message, setMessage] = useState(false)
  const [userMessage, setUserMessage] = useState("")
  const [user, setUser] = useState({})
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [show, setShow] = useState(false);
  const [link, setLink] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const url = "https://userdevapp.certs365.io";
  const handleClose = () => {
    setShow(false);
  };
  const [activeFolderIndex, setActiveFolderIndex] = useState(null);
  const [getFileName, setGetFileName] = useState(null);

  useEffect(() => {
    const storedSelectedFolder = sessionStorage.getItem('folderKbName');
    const storedFileName = sessionStorage.getItem('pdfFile');  
    setActiveFolderIndex(storedSelectedFolder);

    if(storedFileName) {
      setGetFileName(storedFileName)
    }
  }, []);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedSelectedTab = sessionStorage.getItem('selectedTab');
    const storedSelectedPdf = sessionStorage.getItem('selectedPdf');
    const storedSourceId = sessionStorage.getItem('sourceId');
    const user = JSON.parse(localStorage.getItem('User'));

    if (user) {
      setUser(user)
    }
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

  const handleShow = (() => {
    setShow(true)
    setLink(`${url}/widget/${sourceId}`)
  })

  useEffect(() => {
    const { id } = router.query;
    if (id) {

      setSourceId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id])

  const sendMessage = async (userMessages) => {
    const trimmedMessages = userMessages.map(message => message.content.trim()); // Trim leading/trailing spaces
    const lastMessages = trimmedMessages.slice(-1)[0];
    if (lastMessages) {
      const message = {
        kb_name: sourceId,
        user_prompt: lastMessages // Passing user messages to the API call
      };
      chatPDF.sendChat(message, async (response) => {
        if (response.status === "success") {
          setMessage(response.data);
          const newAssistantMessage = {
            role: "assistant",
            content: response.data.content
          };
          await handleChat(response.data.content, "assistant")
          const updatedMessages = [...userMessages, newAssistantMessage]; // Combine user and assistant messages
          setChatMessage(updatedMessages); // Update state after API call success
          setLoading(false);
        } else {
          console.log("error");

        }
      });
    } else {
      toast.error("Empty Message sent")
    }
  };

  const getMessages = (async () => {
    try {
      const response = await allCommonApis(`/Chat/get-file-chat/${selectedTab}`);
      if (response.status === 200) {

        setChatMessage(response?.data?.data?.messages)
      } else {
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

  useEffect(() => {

    getMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab])


  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessage]);

  const handleChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleChat = (async (message, role) => {

    try {
      const messageData = {
        file_id: selectedTab,
        content: message,
        role: role,
        userId: user._id
      }
      const response = await allCommonApis(`/single_chat`, 'post', messageData);
      if (response.status === 200) {
        return response.data
      } else {
        // Handle other cases where the status is not SUCCESS
        console.error('Error fetching PDF list:', response.error);
        toast.error(response.data.message || "Something went wrong")
        setIsLoading(false);
      }
    }
    catch (error) {
      console.error('Error fetching PDF list:', error);
      setIsLoading(false);
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage) {
      const newMessage = {
        role: "user",
        content: trimmedMessage
      };
      setLoading(false);
      const newMessages = [...chatMessage, newMessage]; // Updating state before API call
      setChatMessage(newMessages); // Update state
      const chat = await handleChat(trimmedMessage, "user")
      if (chat) {
        await sendMessage(newMessages);
      }  
      // Call API
      setUserMessage("");
    } else {
      // toast.error("Empty message entered Please enter a message to send")
    }
  }

  const handleChatFolder = (async (message, role) => {

    try {
      const messageData = {
        kb_Name: activeFolderIndex,
        content: message,
        role: role,
        userId: user._id
      }
      const response = await allCommonApis(`/chat`, 'post', messageData);
      if (response.status === 200) {
        return response.data
      } else {
        // Handle other cases where the status is not SUCCESS
        console.error('Error fetching PDF list:', response.error);
        toast.error(response.data.message || "Something went wrong")
        setIsLoading(false);
      }
    }
    catch (error) {
      console.error('Error fetching PDF list:', error);
      setIsLoading(false);
    }
  })

  const sendMessageFolder = async (userMessages) => {
    const trimmedMessages = userMessages.map(message => message.content.trim()); // Trim leading/trailing spaces
    const lastMessages = trimmedMessages.slice(-1)[0];
    if (lastMessages) {
      const message = {
        kb_name: activeFolderIndex,
        user_prompt: lastMessages // Passing user messages to the API call
      };
      chatPDF.sendChat(message, async (response) => {
        if (response.status === "success") {
          setMessage(response.data);
          const newAssistantMessage = {
            role: "assistant",
            content: response.data.content
          };
          await handleChatFolder(response.data.content, "assistant")
          const updatedMessages = [...userMessages, newAssistantMessage]; // Combine user and assistant messages
          setChatMessage(updatedMessages); // Update state after API call success
          setLoading(false);
        } else {
          console.log("error");

        }
      });
    } else {
      toast.error("Empty Message sent")
    }
  };

  const handleSubmitFolder = async (e) => {
    e.preventDefault();
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage) {
      const newMessage = {
        role: "user",
        content: trimmedMessage
      };
      setLoading(false);
      const newMessages = [...chatMessage, newMessage]; // Updating state before API call
      setChatMessage(newMessages); // Update state
      const chat = await handleChatFolder(trimmedMessage, "user")
      if (chat) {
        await sendMessageFolder(newMessages);
      }
  
      // Call API
      setUserMessage("");
    } else {
      // toast.error("Empty message entered Please enter a message to send")
    }
  }

  const handleCopyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000);

  };

  const exportChat = () => {
    // Download chat messages as text file
    const filename = 'chat_messages.txt';

    // Parse JSON data
    const messages = chatMessage.map(message => `${message.role}: ${message.content}`);

    // Join messages with newlines
    const text = messages.join('\n');

    // Create Blob with text data
    const blob = new Blob([text], { type: 'text/plain' });

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    // Append link to document body, click, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  // const deleteChat = () => {
  //   // Clear chat messages
  //   setChatMessage([]);
  // };


  // useEffect(async()=>{

  //  const messages=  [
  //     {
  //       role: "user",
  //       content: "what questions can I ask in this PDF?"
  //     }
  //   ]

  // await sendMessage(messages)
  // },[])

  return (
    <div style={{ height: "100%" }}>
      <div className='chat-header'>
        <div className='chat-icon d-flex align-items-center'>
          {getFileName && childData === false ? (
            <>
              <div className='icon-container'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.14062 20H15.8594C16.8287 20 17.6172 19.2115 17.6172 18.2422V5.85938H13.5156C12.5463 5.85938 11.7578 5.07086 11.7578 4.10156V0H4.14062C3.17133 0 2.38281 0.788516 2.38281 1.75781V18.2422C2.38281 19.2115 3.17133 20 4.14062 20ZM6.48438 8.24219H13.5156C13.8395 8.24219 14.1016 8.50426 14.1016 8.82812C14.1016 9.15199 13.8395 9.41406 13.5156 9.41406H6.48438C6.16051 9.41406 5.89844 9.15199 5.89844 8.82812C5.89844 8.50426 6.16051 8.24219 6.48438 8.24219ZM6.48438 10.5859H13.5156C13.8395 10.5859 14.1016 10.848 14.1016 11.1719C14.1016 11.4957 13.8395 11.7578 13.5156 11.7578H6.48438C6.16051 11.7578 5.89844 11.4957 5.89844 11.1719C5.89844 10.848 6.16051 10.5859 6.48438 10.5859ZM6.48438 12.9297H13.5156C13.8395 12.9297 14.1016 13.1918 14.1016 13.5156C14.1016 13.8395 13.8395 14.1016 13.5156 14.1016H6.48438C6.16051 14.1016 5.89844 13.8395 5.89844 13.5156C5.89844 13.1918 6.16051 12.9297 6.48438 12.9297ZM6.48438 15.2734H11.1719C11.4957 15.2734 11.7578 15.5355 11.7578 15.8594C11.7578 16.1832 11.4957 16.4453 11.1719 16.4453H6.48438C6.16051 16.4453 5.89844 16.1832 5.89844 15.8594C5.89844 15.5355 6.16051 15.2734 6.48438 15.2734Z" fill="white"/>
                    <path d="M13.5156 4.68744H17.2739L12.9297 0.343262V4.1015C12.9297 4.42479 13.1923 4.68744 13.5156 4.68744Z" fill="white"/>
                  </svg>
              </div>
              {getFileName ? getFileName+'.pdf' : 'No file selected'}
            </>
          ):(
              <>
                <div className='icon-container'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                    <path d="M10 0.166664C10 1.08333 9.25417 1.83333 8.33333 1.83333H4.16667H1.66667C0.746167 1.83333 0 2.58333 0 3.5V10.1667V12.6667C0 13.5833 0.746192 14.3333 1.66667 14.3333H18.3333C19.2542 14.3333 20 13.5833 20 12.6667V10.1667V1.83333C20 0.916664 19.2542 0.166664 18.3333 0.166664H10Z" fill="white"/>
                  </svg>
                </div>
                <p>{selectedFolder?.folder?.name ? selectedFolder?.folder?.name : 'No Folder selected'}</p>
              </>
            )}
          </div>
        <div className='chat-icons'>
          <div className="tooltip-container">
            <Image alt='downloadicon' height={20} width={20} className='icons' src='/icons/download.svg' title='Download' onClick={exportChat} />
            <span className="tooltip-text">Export Chat</span>
          </div>
          <div className="tooltip-container">
            <Image alt='shareicon' height={20} width={20} onClick={() => { handleShow() }} className='icons' src='/icons/share.svg' />
            <span className="tooltip-text">Generate Link</span>
          </div>
        </div>

      </div>
      <div className='chat-container-outer'>
        {isLoading ?
            <div style={{ marginTop: "200px", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            :
            <div className="chat-container-inner">
              {chatMessage.length > 1 ? (
                chatMessage.map((message, index) => (
                  // Check if message content and role match the condition
                  (message.content !== "what questions can I ask in this PDF?" || message.role !== "user") && (
                    <div
                      key={index}
                      className={`message ${message.role === 'user' ? 'user-message' : 'admin-message'}`}
                    >
                      {message.role === 'assistant' && (
                        <Image
                          width={10}
                          height={10}
                          src='/icons/copied-icon.svg'
                          alt='Copy Icon'
                          className='copy-icon'
                          onClick={() => handleCopyToClipboard(message.content)}
                        />
                      )}
                      <div
                        key={index}
                        className={`message ${message.role === 'user' ? 'user-message' : 'admin-message'}`}
                        dangerouslySetInnerHTML={{ __html: formatChatResponse(message) }} // Render HTML content
                      />
                    </div>
                  )
                ))
              ) : (
                <div
                  className={`message admin-message`}
                >
                  Hello! How can I assist you?
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
        }
         
        {childData === false ? 
          (
            <form onClick={(e) => { handleSubmit(e) }} className='input-container'>
              {/* <button className='delete-btn'>
                <Image alt='delete' width={20} height={20} className='icon-delete' src="/icons/delete1.svg"/>
              </button> */}
              <input disabled={loading} className='input-enter rounded-0' placeholder={`Ask to file ${getFileName}`} value={userMessage} onChange={handleChange} />
              <div onClick={(e) => { handleSubmit(e) }} className="send-icon-container">
                <Image alt='sendicon' width={20} height={20} className='icon-send' src={loading ? '/icons/spinner.gif':'/icons/send-icon.svg'} />
              </div>
            </form>
          ) : (            
            <form onClick={(e) => { handleSubmitFolder(e) }} className='input-container'>
              <button className='delete-btn'>
                <Image alt='delete' width={20} height={20} className='icon-delete' src="/icons/delete1.svg"/>
              </button>
              <input disabled={loading} className='input-enter rounded-0' placeholder={`Chat with the folder: ${selectedFolder?.folder?.name}`} value={userMessage} onChange={handleChange} />
              <div onClick={(e) => { handleSubmitFolder(e) }} className="send-icon-container">
                <Image alt='sendicon' width={20} height={20} className='icon-send' src={loading ? '/icons/spinner.gif':'/icons/send-icon.svg'} />
              </div>
          </form>
          )}
      </div>
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>

        <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px", cursor: "pointer", color: "gray", }}>
          <Image

            height={13}
            width={13}
            onClick={handleClose}
            src='/icons/cross.svg'
            alt='close'
          />

        </div>


        <Modal.Body className='p-5'>
          <p>Copy the link below</p>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="URL"
              aria-label="URL"
              aria-describedby="basic-addon2"
              value={link}
              disabled
            />
            <div style={{ margin: "10px", cursor: "pointer" }}>
              {showCopiedMessage ? <span className="">Copied</span> :
                <Image width={15} height={30}
                  src='/icons/copied-icon.svg'
                  alt='Copy Icon'
                  // className='copy-icon'
                  onClick={() => handleCopyToClipboard(link)}
                />
              }
            </div>

          </InputGroup>

        </Modal.Body>
      </Modal>


    </div>
  )
}

export default ChatSection
