const getEmbeddings = require("./openai-embedding");

const vectorSearch = async (index,query) => {

    // getEmbeddings expects an array of objects with a "Message" key
    const [embedding] = await getEmbeddings([{ Message: query }]);

    const queryResult = await index.query({
        vector: embedding,
        topK: 1,
        includeMetadata: true,
    });

    return queryResult.matches.map(match => match.metadata);
};

module.exports={vectorSearch}