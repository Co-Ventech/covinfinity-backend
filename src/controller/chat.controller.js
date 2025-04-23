const chatService = require("../service/chat.service")

const chat= async(message)=>{
    const result= await chatService(message);
    return result
}

module.exports={chat}