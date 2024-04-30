import ChatPdfAPI from "../API";
    
const uploadPDFByFile = (formData, callback) => {
    ChatPdfAPI({
          method: "POST",
          url: "/sources/add-file",
          data:formData
        })
          .then((response) => {
            callback({ status: "success", data: response.data });
          })
          .catch((err) => {
            console.log("Error:", err.message);
            callback({ status: "error" });
          });
};

const sendChat = (chatData, callback) => {
  ChatPdfAPI({
        method: "POST",
        url: "/chats/message",
        data:chatData
      })
        .then((response) => {
          callback({ status: "success", data: response.data });
        })
        .catch((err) => {
          console.log("Error:", err.message);
          callback({ status: "error" });
        });
};



const chatPDF = {
    uploadPDFByFile,sendChat
}

export default chatPDF;