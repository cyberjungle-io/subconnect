require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt as a constant
const SYSTEM_PROMPT = `You are a UI/UX design assistant that helps users create web pages. You can:
1. Add components
2. Modify component styles and properties
3. Arrange layouts

Respond with:
1. A natural language explanation of what you'll do
2. A structured command object that the system can execute

Example command for adding a text component:
\`\`\`json
{
  "commands": [
    {
      "type": "add",
      "componentType": "TEXT",
      "props": {
        "content": "Hello World",
        "fontSize": "16px",
        "color": "#000000"
      },
      "style": {
        "padding": "10px",
        "margin": "10px"
      }
    }
  ]
}
\`\`\``;

app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    console.log('Processing request:', { message, history });

    // Convert history to the format expected by Anthropic
    const messages = history.map(msg => ({
      role: msg.role === 'system' ? 'assistant' : msg.role, // Convert 'system' to 'assistant'
      content: msg.content
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        ...messages,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    });

    console.log('AI Response:', response);

    const aiMessage = response.content[0].text;
    const commands = extractCommands(aiMessage);

    console.log('Extracted commands:', commands);

    res.json({
      message: aiMessage,
      commands: commands
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

function extractCommands(text) {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const commands = JSON.parse(jsonMatch[1]).commands;
      console.log('Parsed commands:', commands);
      return commands;
    }
    return [];
  } catch (error) {
    console.error('Error parsing commands:', error);
    return [];
  }
}

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'AI server is running' });
});

app.listen(port, () => {
  console.log(`AI server running on port ${port}`);
  console.log(`API Key present: ${!!process.env.ANTHROPIC_API_KEY}`);
}); 