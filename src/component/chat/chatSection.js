import chatPDF from '@/services/ChatPDF';
import allCommonApis from '@/services/Common';
import DataContext from '@/utils/DataContext';
import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ChatSection = ({isLoading,setIsLoading}) => {
  const { pdfData, setPdfData, sourceId, chatMessage,setChatMessage,selectedTab, setSourceId,setSelectedTab,setSelectedPdf } = useContext(DataContext);
  const[message, setMessage]=useState(false)
  const[userMessage, setUserMessage]=useState("")
  const[user, setUser]=useState({})
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [show, setShow] = useState(false);
  const [link, setLink] = useState('');
  const router = useRouter();
const url = process.env.NEXT_PUBLIC_URL_LIVE;
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedSelectedTab = sessionStorage.getItem('selectedTab');
    const storedSelectedPdf = sessionStorage.getItem('selectedPdf');
    const storedSourceId = sessionStorage.getItem('sourceId');
    const user = JSON.parse(localStorage.getItem('User'));

    if(user){
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


const handleShow=(()=>{
  setShow(true)
  setLink(`${url}/widget/${sourceId}`)
})

useEffect(()=>{
  const { id } = router.query;
  if (id) {
    
    setSourceId(id);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[router.query.id])



  const sendMessage =async (userMessages) => {
    const lastMessages = userMessages?.slice(-10);
    const message = {
      kb_name: sourceId,
      user_prompt: lastMessages[lastMessages.length - 1].content // Passing user messages to the API call
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
// eslint-disable-next-line react-hooks/exhaustive-deps
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
        role: role,
        userId: user._id
      }
      const response = await allCommonApis(`/Chat/add-chat`,'post',messageData);
      if (response.status === 200) {
        return response.data
      }else {
        // Handle other cases where the status is not SUCCESS
        console.error('Error fetching PDF list:', response.error);
        toast.error(response.data.message || "Something went wrong")
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
   const chat = await handleChat(userMessage,"user")
   if(chat){
     await sendMessage(newMessages);
   }

     // Call API
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
  <div className="tooltip-container">
  <Image alt='downloadicon' height={10} width={10} className='icons' src='/icons/download.svg' title='Download' onClick={exportChat} />
    <span className="tooltip-text">Export Chat</span>
  </div>
  <div className="tooltip-container">
  <Image alt='shareicon' height={10} width={10} onClick={()=>{handleShow()}} className='icons' src='/icons/share.svg' />
    <span className="tooltip-text">Generate Link</span>
  </div>
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
          <Image
          width={10}
          height={10}
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
  <div
  className={`message admin-message`}
>
Hello! How can I assist you?
</div>
)}

<div ref={messagesEndRef} />
    </div>
    }
<form onSubmit={(e)=>{handleSubmit(e)}} className='input-container'>
  <input  className='input-enter' placeholder='Ask to PDF...'  value={userMessage} onChange={handleChange} />
  <div onClick={(e)=>{handleSubmit(e)}} className="send-icon-container">
  <Image alt='sendicon' width={20} height={20} className='icon-send' src='/icons/send-icon.svg' />
  </div>
</form>
      </div>
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
      
      <div style={{display:"flex",justifyContent:"flex-end",margin:"10px" ,cursor: "pointer", color: "gray", }}>
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
       <div style={{margin:"10px", cursor:"pointer"}}>
        {showCopiedMessage ? <span className="">Copied</span>:
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
