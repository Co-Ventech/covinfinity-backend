const { configurePinecone } = require("../config/pinecone-config")

const chat= async(req,res)=>{
    const pinecone= await configurePinecone()
    res.send(pinecone)
}

module.exports={chat}