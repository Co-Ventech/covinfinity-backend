
// Define AI prompts and client reply options under each intent
const intents = {
  "User Information": [
    {
      message: "What is your name?",
      replies: ["My name is Aahil", "I'm Sarah", "Call me Raj", "It's Priya"]
    },
    {
      message: "Kindly share your email",
      replies: ["john@example.com", "sarah@gmail.com", "raj@tech.in", "priya@yahoo.com"]
    }
  ],
  "Project Idea": [
    {
      message: "Okay, share your idea and thought. How can I help?",
      replies: [
        "I want to create a delivery app",
        "I'm planning a meditation app",
        "I need a learning management system",
        "I want to QA an app from your company"
      ]
    },
    {
      message: "What platform do you want the app on?",
      replies: ["Android", "iOS", "Both Android and iOS", "Web only"]
    }
  ],
  "Timeline": [
    {
      message: "What's your estimated project timeline?",
      replies: ["3-4 weeks", "1 month", "Around 6 weeks", "2 months"]
    },
    {
      message: "Is the timeline flexible?",
      replies: ["Yes", "No", "Somewhat", "Depends on complexity"]
    }
  ],
  "Budget": [
    {
      message: "What is your estimated budget?",
      replies: ["Rs. 3k", "$500", "Around ₹10,000", "Under $1000"]
    },
    {
      message: "Is your budget flexible?",
      replies: ["Yes", "No", "If needed", "Can increase slightly"]
    }
  ],
  "Support": [
    {
      message: "Do you need QA and testing support?",
      replies: ["Yes", "Only basic testing", "Not right now", "QA would be great"]
    },
    {
      message: "Do you require deployment support?",
      replies: ["Yes", "We'll handle it", "Only for Android", "Yes, on AWS"]
    }
  ]
};

// Function to get random item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate N entries
function generateDataset(n = 30) {
  const dataset = [];
  const intentKeys = Object.keys(intents);

  while (dataset.length < n) {
    const topic = getRandom(intentKeys);
    const qaPair = getRandom(intents[topic]);

    // Avoid duplicate exact pairs
    const message = qaPair.message;
    const client_reply = getRandom(qaPair.replies);

    const exists = dataset.some(entry => entry.message === message && entry.client_reply === client_reply);
    if (!exists) {
      dataset.push({
        message,
        topic,
        client_reply
      });
    }
  }

  return dataset;
}

module.exports={generateDataset}
