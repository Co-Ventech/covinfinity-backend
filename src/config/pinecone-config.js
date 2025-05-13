const { Pinecone } = require("@pinecone-database/pinecone");
const { config } = require("dotenv");
const embedText = require("../util/openai-embedding");
const path = require('path');
const fs= require('fs')

config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const indexName = process.env.PINECONE_INDEX;

const findIndex = async () => {
    return (await pinecone.listIndexes()).indexes.find(i => i.name === indexName);
}

// 1. Split text into chunks
function splitText(text, chunkSize = 1000) {
    const paragraphs = text.split('\n').filter(Boolean);
    const chunks = [];

    let chunk = '';
    for (let para of paragraphs) {
        if ((chunk + para).length > chunkSize) {
            chunks.push(chunk.trim());
            chunk = '';
        }
        chunk += para + '\n';
    }
    if (chunk) chunks.push(chunk.trim());

    return chunks;
}


const configurePinecone = async () => {
    let index = null;

    if (!await findIndex()) {
        console.log('index not found')
        await pinecone.createIndex({
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
        const filePath = path.join('coventech-info.txt');
        const rawText = fs.readFileSync(filePath, 'utf-8');
        console.log(rawText)

        const chunks = splitText(rawText);
        await uploadChunks(chunks);
        //return await insertRecords();

    } else {
        console.log("index found")
        //await insertRecords()
    }

    index = pinecone.index(indexName);
    return index;
}

async function uploadChunks(chunks) {
    const index = pinecone.Index(indexName);
    const vectors = await Promise.all(
        chunks.map(async (chunk, i) => ({
            id: `co-ventech-${i}`,
            values: await embedText(chunk),
            metadata: { text: chunk },
        }))
    );

    await index.upsert(vectors, 'ns1');
    console.log(`Uploaded ${vectors.length} vectors to Pinecone`);
}

// Query Pinecone with user input
async function queryPinecone(query) {
    const index = await configurePinecone();
    const queryEmbedding = await embedText(query);

    const results = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true,
    });

    return results.matches.map(match => match.metadata.text).join('\n');
}


module.exports = { configurePinecone, queryPinecone }