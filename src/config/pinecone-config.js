const { Pinecone } = require("@pinecone-database/pinecone");
const { config } = require("dotenv");
const { readExcel } = require("../util/read-excel");
const getEmbeddings = require("../util/openai-embedding");
config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const indexName = process.env.PINECONE_INDEX;

const findIndex = async () => {
    return (await pc.listIndexes()).indexes.find(i => i.name === indexName);
}

const configurePinecone = async () => {
    let index = null;

    if (!await findIndex()) {
        console.log('index not found')
        await pc.createIndex({
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
        console.log(insertRecords())
        //return await insertRecords();
        
    } else {
        index = pc.index(indexName);
        //await insertRecords()
    }

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
  
    await index.upsert(vectors,'ns1');
    console.log(`Uploaded ${vectors.length} vectors to Pinecone`);
  }

const insertRecords = async() => {
    const index = pc.Index(indexName)
    const excel_data = readExcel('rag-dataset.xlsx')
    // Resolve all promises from async map
    const embeddings = await getEmbeddings(excel_data);
    console.log(embeddings)
    const vectors = excel_data.map((d,i) => ({
        id: `${d.id}-${d.Role}`, // make unique ID (since IDs are repeating)
        values: embeddings[i],
        metadata: {
          message: d.message,
          client_reply: d.client_reply,
          topic: d.topic,
        },
      }));
    await index.upsert(vectors, 'ns1');

    //await index.namespace('ns1').upsertRecords(vectors);
    console.log({
        status: 200,
        message: 'inserted records successfully'
    })
    //await index?.upsertRecords(excel_data)
}

module.exports = { configurePinecone }