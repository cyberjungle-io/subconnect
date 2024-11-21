import { Anthropic } from '@anthropic-ai/sdk';
import { systemPrompt } from './prompts/systemPrompt';
import { validateCommand } from './validators/validators';
import { processAICommands } from './processors';

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_KEY,
});

export const processAIRequest = async (message, history = []) => {
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages,
      temperature: 0.7,
    });

    const aiResponse = response.content[0].text;
    let commands = [];

    try {
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const parsedCommands = JSON.parse(jsonMatch[1]).commands;
        const validatedCommands = parsedCommands.map(command => validateCommand(command));
        commands = processAICommands(validatedCommands);
      }
    } catch (error) {
      console.error('Error processing AI commands:', error);
    }

    return {
      message: aiResponse,
      commands
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}; 