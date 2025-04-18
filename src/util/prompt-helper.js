const openai = require("../config/openai-api");

const generateAnswer = async (context, question) => {
    const systemPrompt = `You are a helpful assistant. Use the context to answer the question.`;

    const userPrompt = `Context:\n${context.join('\n')}\n\nQuestion: ${question}`;

    const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    });

    return res.choices[0].message.content;
};

module.exports = generateAnswer;