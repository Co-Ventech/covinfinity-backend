const { configurePinecone } = require("../config/pinecone-config");
const generateAnswer = require("../util/prompt-helper");
const { vectorSearch } = require("../util/vector-search");

const chatService= async(req)=>{
    const userQuestion = `Hi there,
I came across your company, Co-Ventech, and was really impressed with the kind of work you do. I'm currently planning to develop a custom web application for my business to manage client bookings and automate some internal processes. I’m not too technical, so I’m looking for a team who can guide me through the process from start to finish.
Would love to understand how you usually work, what your typical timelines and pricing look like, and whether we could hop on a quick call to discuss things further.
Looking forward to hearing from you!
Best,
Ryan M.`;
    const index= await configurePinecone()
    const contextRecords = await vectorSearch(index,userQuestion);
    console.log(contextRecords)
    //const contextMessages = contextRecords.map(r => r.text);
    
    const answer = await generateAnswer(contextRecords, userQuestion);
    return answer;
}

module.exports= chatService;