const { config } = require("dotenv");
const { default: OpenAI } = require("openai");
config();

const openai= new OpenAI({apiKey:process.env.OPENAI_API_KEY});

module.exports= openai;