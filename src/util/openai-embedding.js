const { config } = require("dotenv")
const { default: OpenAI } = require("openai")

config();

const openai= new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const getEmbeddings= async(data)=>{
    const messages = data.map((d) => d.message);

    const res= await openai.embeddings.create({
        input: data,
        model:'text-embedding-ada-002'
    });
    return res.data.map((item) => item.embedding);
}

module.exports= getEmbeddings;