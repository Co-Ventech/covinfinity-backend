const XLSX = require('xlsx');

function readExcel(path = './rag_dataset.xlsx') {
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const conversations = [];
  let currentConv = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (!row.message || !row.client_reply) continue;

    currentConv.push({
      question: row.message,
      answer: row.client_reply
    });

    // Optional: group conversations by blank rows or topics
    if (i === data.length - 1 || data[i + 1].topic === 'User Information' && currentConv.length > 0) {
      conversations.push({ conversation: [...currentConv] });
      currentConv = [];
    }
  }

  return conversations;
}

module.exports={readExcel}