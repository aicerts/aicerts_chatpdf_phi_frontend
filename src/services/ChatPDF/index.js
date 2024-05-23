import ChatPdfAPI from "../API";
    
const uploadPDFByFile = (formData, callback) => {
    ChatPdfAPI({
          method: "POST",
          url: "/receive-file",
          data:formData
        })
          .then((response) => {
            console.log('ChatPdfApi', response)
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
        url: "/chat",
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