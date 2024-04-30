import chatPDF from '@/services/ChatPDF';
import allCommonApis from '@/services/Common';
import DataContext from '@/utils/DataContext';
import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';

const ChatSection = ({isLoading,setIsLoading}) => {
  const { pdfData, setPdfData, sourceId, chatMessage,setChatMessage,selectedTab } = useContext(DataContext);
  const[message, setMessage]=useState(false)
  const[userMessage, setUserMessage]=useState("")
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [show, setShow] = useState(false);
  const [link, setLink] = useState('');
const url = process.env.NEXT_PUBLIC_URL_LIVE;
  const handleClose = () => {
    setShow(false);
  };


const handleShow=(()=>{
  setShow(true)
  setLink(`${url}/widget/${sourceId}`)
})



  const sendMessage = (userMessages) => {
    
    const message = {
      sourceId: sourceId,
      messages: userMessages // Passing user messages to the API call
    };
    chatPDF.sendChat(message, async (response) => {
      if (response.status === "success") {
        setMessage(response.data);
        const newAssistantMessage = {
          role: "assistant", 
          content: response?.data?.content 
        };
        await handleChat(response?.data?.content,"assistant")
        const updatedMessages = [...userMessages, newAssistantMessage]; // Combine user and assistant messages
        setChatMessage(updatedMessages); // Update state after API call success
        
      } else {
        console.log("error");
       
      }
    });
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

  useEffect(()=>{

getMessages()
  },[selectedTab])
  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      role: "user", 
      content: userMessage
    };


    const newMessages = [...chatMessage, newMessage]; // Updating state before API call
    setChatMessage(newMessages); // Update state
    await sendMessage(newMessages); // Call API
    await handleChat(userMessage,"user")
    setUserMessage("");
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
    <div style={{height:"100%"}}>
      <div className='chat-header'>
<p>Chat</p>
<div className='chat-icons'>
{/* <div className="tooltip-container">
    <img className='icons' src='/icons/share.svg' />
    <span className="tooltip-text">Share</span>
  </div> */}
  {/* <div className="tooltip-container">
  <img className='icons' src='/icons/rename.svg' />
    <span className="tooltip-text">Rename</span>
  </div> */}
  <div className="tooltip-container">
  <img className='icons' src='/icons/download.svg' title='Download' onClick={exportChat} />
    <span className="tooltip-text">Export Chat</span>
  </div>
  <div className="tooltip-container">
  <img onClick={()=>{handleShow()}} className='icons' src='/icons/share.svg' />
    <span className="tooltip-text">Generate Link</span>
  </div>
  {/* <div className="tooltip-container" >
  <img className='icons' src='/icons/delete.svg' onClick={deleteChat} />
    <span className="tooltip-text">Delete Chat</span>
  </div> */}
  
  
  
  
</div>

      </div>
      <div className='chat-container-outer'>
        {
          isLoading?
          <div style={{marginTop:"200px",display:"flex", justifyContent:"center", alignItems:"center", textAlign:"center"}}>
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
          <img
            src='/icons/copied-icon.svg'
            alt='Copy Icon'
            className='copy-icon'
            onClick={() => handleCopyToClipboard(message.content)}
          />
        )}
        {message.content}
      </div>
    )
  ))
) : (
  <div className="cannot-read-pdf">
    Unable to read PDF content
  </div>
)}

<div ref={messagesEndRef} />
    </div>
    }
<form onSubmit={(e)=>{handleSubmit(e)}} className='input-container'>
  <input  className='input-enter' placeholder='Ask to PDF...'  value={userMessage} onChange={handleChange} />
  <div onClick={(e)=>{handleSubmit(e)}} className="send-icon-container">
  <img className='icon-send' src='/icons/send-icon.svg' />
  </div>
</form>
      </div>
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
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
     
        {showCopiedMessage ? <span className="copy-text-show">Copied</span>:
        <img
          src='/icons/copied-icon.svg'
          alt='Copy Icon'
          className='copy-icon'
          onClick={() => handleCopyToClipboard(link)}
        />
      }
    </InputGroup>
  </Modal.Body>
</Modal>


    </div>
  )
}

export default ChatSection
