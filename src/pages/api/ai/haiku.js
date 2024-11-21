import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { command, components } = req.body;

    // Create a structured prompt for the Haiku model
    const prompt = `You are a UI component modifier. Given the following components and command, determine the appropriate style modifications:

Components: ${JSON.stringify(components, null, 2)}
User Command: ${command}

Respond with valid style modifications in JSON format. Only include valid CSS properties.`;

    const response = await anthropic.messages.create({
      model: 'haiku',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    });

    // Parse the AI response and extract modifications
    const modifications = JSON.parse(response.content);

    return res.status(200).json({
      message: "Successfully processed modifications",
      modifications
    });
  } catch (error) {
    console.error('Haiku API error:', error);
    return res.status(500).json({ message: 'Error processing AI command' });
  }
} 