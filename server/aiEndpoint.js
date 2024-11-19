const express = require('express');
const router = express.Router();
const { processAIRequest } = require('../src/services/ai/aiService');

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const response = await processAIRequest(message, history);
    res.json(response);
  } catch (error) {
    console.error('AI Endpoint Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 