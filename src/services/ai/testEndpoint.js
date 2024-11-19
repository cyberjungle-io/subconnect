const express = require('express');
const router = express.Router();

router.post('/test', async (req, res) => {
  try {
    res.json({ 
      message: 'Test successful',
      receivedKey: req.headers['x-api-key'] ? 'Key present' : 'No key found'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 