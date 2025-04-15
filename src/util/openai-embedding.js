const { config } = require("dotenv")
const { default: OpenAI } = require("openai")

config();

const openai= new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const getEmbedding= async(text)=>{
    const res= await openai.embeddings.create({
        input: text,
        model:'text-embedding-ada-002'
    });
    return res.data[0].embedding;
}

module.exports= getEmbedding;