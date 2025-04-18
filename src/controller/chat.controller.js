const { configurePinecone } = require("../config/pinecone-config")
const chatService = require("../service/chat.service")

const chat= async(req,res)=>{
    const result= await chatService(req);
    res.send(result)
}

module.exports={chat}