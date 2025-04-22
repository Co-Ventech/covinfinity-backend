const openai = require("../config/openai-api");
const { configurePinecone } = require("../config/pinecone-config");
const { embedConversation } = require("../embeddings/embedder");
//const { model } = require("../util/openai-embedding");

const chatService = async (req,res) => {
    const userConversation = req?.body?.conversation;
    const index= await configurePinecone();
    const vector= await embedConversation(userConversation);

    const queryResponse = await index.query({
        topK: 3,
        vector,
        includeMetadata: true,
    });

    const retrievedConvos = queryResponse.matches.map(m => m.metadata);

    const prompt = `
    You are a form assistant AI.
    Based on the user's answers:
    ${JSON.stringify(userConversation)}
    
    Here are some past conversations:
    ${JSON.stringify(retrievedConvos)}
    
    What is the best next question to ask the user?
    Only return the question.
    `;

    const chatResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    });

    const nextQuestion = chatResponse.choices[0].message.content.trim();
    return {nextQuestion}
};

module.exports = chatService;
