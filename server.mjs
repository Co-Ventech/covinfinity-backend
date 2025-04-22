// const express = require("express");
// const { chat } = require("./src/controller/chat.controller");
// const bodyParser = require("body-parser");
// const { generateDataset } = require("./src/util/intents");
// const fs = require('fs');

// const app= express();
// app.use(bodyParser.json());

// app.post('/chat',chat)


// app.listen(4000,(err)=>{
//     if(err) console.log(err)
// })

// Required Packages
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Load environment variables
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  //environment: process.env.PINECONE_ENV,
});

const indexName = process.env.PINECONE_INDEX;

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

// 2. Create OpenAI embedding
async function embedText(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return res.data[0].embedding;
}

// 3. Upload to Pinecone
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

// Query Pinecone with user input
async function queryPinecone(query) {
  const index = pinecone.Index(indexName);
  const queryEmbedding = await embedText(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true,
  });

  return results.matches.map(match => match.metadata.text).join('\n');
}

// Main Logic
(async () => {
  // const filePath = path.join('coventech-info.txt');
  // const rawText = fs.readFileSync(filePath, 'utf-8');
  // console.log(rawText)

  // const chunks = splitText(rawText);
  // await uploadChunks(chunks);

  const query = 'can you provide these kind of services?';
  const context = await queryPinecone(query);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `${query}\n\nContext: ${context}` },
    ],
  });

  console.log('Answer:', completion.choices[0].message.content);
})();
