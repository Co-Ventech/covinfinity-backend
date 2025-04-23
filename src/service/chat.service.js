const openai = require("../config/openai-api");
const { queryPinecone } = require("../config/pinecone-config");
//const { model } = require("../util/openai-embedding");

const chatService = async (message) => {
  console.log("received message: ", message)
  const context = await queryPinecone(message);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `${message}\n\nContext: ${context}` },
    ],
  });

  return completion.choices[0].message.content;
};

module.exports = chatService;
