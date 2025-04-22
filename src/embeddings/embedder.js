const { default: OpenAI } =require('openai')
const fs =require('fs');
const openai = require('../config/openai-api');

const embedConversation = async (conversation) => {
    console.log(conversation)
    const text = conversation.map(c => `${c.question} ${c.answer}`).join('\n');
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    return embedding.data[0].embedding;
};

// export const loadConversations = () => {
//     const lines = fs.readFileSync('./data/conversations.jsonl', 'utf-8').split('\n');
//     return lines.filter(Boolean).map(line => JSON.parse(line));
// };

module.exports={embedConversation}