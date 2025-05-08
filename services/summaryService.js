const axios = require('axios');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

async function getSummary(text) {
  if (!text?.trim()) return null;
  const MAX_LENGTH = 1000;
  const cleanText = text.slice(0, MAX_LENGTH);

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/summarize`, { text: cleanText });
    return response.data.summary;
  } catch (err) {
    console.error('Error in AI summary:', err.message);
    return null;
  }
}

module.exports = { getSummary };