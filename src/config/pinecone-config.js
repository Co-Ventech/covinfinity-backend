// pinecone-config.js
const { OpenAI } = require("openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { readExcel } = require("../util/read-excel");
const { config } = require("dotenv");
config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.INDEXNAME);

const getEmbedding = async (text) => {
    const res = await openai.embeddings.create({
        input: text,
        model: "text-embedding-ada-002"
    });
    return res.data[0].embedding;
};

const configurePinecone = async () => {
    const excelData = readExcel("covinfinity-dataset.xlsx");

    const formattedRecords = await Promise.all(
        excelData.map(async (row, i) => {
            const embedding = await getEmbedding(row.Message);
            return {
                id: String(i), // required as string
                values: embedding,
                metadata: {
                    conversationId: row.ConversationID,
                    role: row.Role,
                    topic: row.Topic,
                    message: row.Message
                }
            };
        })
    );

    await index.upsertRecords(formattedRecords);
    console.log("Uploaded to Pinecone!");
};

module.exports = { configurePinecone };
