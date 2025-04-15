const { Pinecone } = require("@pinecone-database/pinecone");
const { config } = require("dotenv");
const { readExcel } = require("../util/read-excel");
const getEmbedding = require("../util/openai-embedding");
config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const indexName = process.env.INDEXNAME;

const findIndex = async () => {
    return (await pc.listIndexes()).indexes.find(i => i.name === indexName);
}

const configurePinecone = async () => {
    let index = null;

    if (!await findIndex()) {
        console.log('index not found')
        pc.createIndex({
            name: indexName,
            dimension: 1536, // Replace with your model dimensions
            metric: 'cosine', // Replace with your model metric
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            },
        })
        return await insertRecords();
        
    } else {
        index = pc.index(indexName);
        return await insertRecords()
    }

}

const insertRecords = async() => {
    const index = pc.index(indexName)
    const excel_data = readExcel('covinfinity-dataset.xlsx')
    // Resolve all promises from async map
    const vectors = await Promise.all(
        excel_data.map(async (row, i) => {
            const embedding = await getEmbedding(row.Message);
            return {
                id: i.toString(), // required by Pinecone
                values: embedding, // must be under 'values'
                metadata: {
                    conversationId: row.ConversationID,
                    role: row.Role,
                    topic: row.Topic,
                    message: row.Message
                }
            };
        })
    );
    await index.upsertRecords(vectors);
    return {
        status: 200,
        message: 'inserted records successfully'
    }
    //await index?.upsertRecords(excel_data)
}

module.exports = { configurePinecone }