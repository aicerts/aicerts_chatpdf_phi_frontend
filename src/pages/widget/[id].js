import chatPDF from '@/services/ChatPDF';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { formatChatResponse } from '@/utils/common';

const Widget = () => {
  const router = useRouter();
  const [sourceId, setSourceId] = useState(null);
  const[message, setMessage]=useState(false)
  const[userMessage, setUserMessage]=useState("")
  const[isLoading,setIsLoading]=useState(false)
  const[chatMessage,setChatMessage] =useState([])

  const sendMessage = (userMessages) => {
    const lastMessages = userMessages.slice(-10);
    setIsLoading(true)
    const message = {
      kb_name: sourceId,
      user_prompt: lastMessages  // Passing user messages to the API call
    };
    chatPDF.sendChat(message, async (response) => {
      if (response.status === "success") {
        setMessage(response.data);
        const newAssistantMessage = {
          role: "assistant", 
          content: response?.data?.content 
        };
        let formettedText = formatChatResponse(response)
        await handleChat(formettedText, "assistant")
        const updatedMessages = [...userMessages, newAssistantMessage]; // Combine user and assistant messages
        setChatMessage(updatedMessages); // Update state after API call success
        setIsLoading(false)
        
      } else {
        console.log("error");
        setIsLoading(false)
       
      }
    });
  };

  const handleChat = (async (message, role) => {

    try {
      const messageData = {
        file_id: selectedTab,
        content: message,
        role: role,
        userId: user._id
      }
      const response = await allCommonApis(`/Chat/add-chat`, 'post', messageData);
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

  useEffect(() => {
    // Extracting id from the URL query parameters
    const { id } = router.query;
    if (id) {
      setSourceId(id);
      const newMessage = {
        role: "assistant", 
        content:"Hello! How can I assist you?"
      };


      setChatMessage([...chatMessage,newMessage])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);



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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage) {
      const newMessage = {
        role: "user",
        content: trimmedMessage
      };
      const newMessages = [...chatMessage, newMessage]; // Updating state before API call
      setChatMessage(newMessages); // Update state
      const chat = await handleChat(trimmedMessage, "user")
      if (chat) {
        await sendMessage(newMessages);
      }
  
      // Call API
      setUserMessage("");
    } else {
      toast.error("Empty message entered Please enter a message to send")
    }
  }
  const handleCopyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    
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



  return (
    <div className='main-cont' style={{height:"100vh", width:"100v"}}>
      <div className='chat-header'>
<p>Chat</p>

      </div>
      <div className='chat-container-outer'>

      <div className="chat-container-inner">
  {chatMessage.map((message, index) => (
    // Check if message content and role match the condition
    (message.content !== "what questions can I ask in this PDF?" || message.role !== "user") && (
      <div
        key={index}
        className={`message ${message.role === 'user' ? 'user-message' : 'admin-message'}`}
      >
       
        {message.content}

      </div>
    )
  ))}
    {isLoading && <div
        className='message admin-message'
      >
    Loading...
      </div>}
   
  <div ref={messagesEndRef} />
</div>

    
<form onSubmit={(e)=>{handleSubmit(e)}} className='input-container'>
  <input  className='input-enter' placeholder='Ask to PDF...'  value={userMessage} onChange={handleChange} />
  <div onClick={(e)=>{handleSubmit(e)}} className="send-icon-container">
  <Image alt='sendicon' width={20} height={20} className='icon-send' src='/icons/send-icon.svg' />
  </div>
</form>
      </div>
      
    </div>
  )
}

export default Widget
