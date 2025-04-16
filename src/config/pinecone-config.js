const { Pinecone } = require("@pinecone-database/pinecone");
const { config } = require("dotenv");
const { readExcel } = require("../util/read-excel");
const getEmbeddings = require("../util/openai-embedding");
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
        await pc.createIndex({
            name: indexName,
            dimension: 1536, // Replace with your model dimensions
            vectorType:'',
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
    const index = pc.Index(indexName)
    const excel_data = readExcel('covinfinity-dataset.xlsx')
    // Resolve all promises from async map
    const embeddings = await getEmbeddings(excel_data);
    const vectors = excel_data.map((d, i) => ({
        id: `${d.id}-${d.Role}`, // make unique ID (since IDs are repeating)
        values: embeddings,
        metadata: {
          text: d.Message,
          role: d.Role,
          topic: d.Topic,
        },
      }));
    await index.upsert(vectors, 'ns1');

    //await index.namespace('ns1').upsertRecords(vectors);
    return {
        status: 200,
        message: 'inserted records successfully'
    }
    //await index?.upsertRecords(excel_data)
}

module.exports = { configurePinecone }