const { model } = require('./openai-embedding');

const generateAnswer = async (question, context) => {
  const prompt = `
The customer said: "${context}"
Based on the question: "${question}", generate a possible answer the customer might give.
`;

  const response = await model.call([
    { role: 'user', content: prompt }
  ]);

  return response.content.trim();
};

module.exports = generateAnswer;
