const openai = require("../config/openai-api");
const { queryPinecone } = require("../config/pinecone-config");
//const { model } = require("../util/openai-embedding");

const chatService = async (req) => {
    const query = req?.body?.client;
    const context = await queryPinecone(query);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `${query}\n\nContext: ${context}` },
    ],
  });

    return {"AI":completion.choices[0].message.content}
};

module.exports = chatService;
