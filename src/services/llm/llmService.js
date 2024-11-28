import { ANTHROPIC_API_KEY } from '../../config/keys';
import { store } from '../../store/store';

const API_BASE_URL = process.env.REACT_APP_W3S_API_URL;
const LLM_ENDPOINT = `${API_BASE_URL}/llm/chat`;

export const LLMProviders = {
  ANTHROPIC_HAIKU: 'anthropic-haiku',
  ANTHROPIC_CLAUDE: 'anthropic-claude',
};

export const ModelIds = {
  [LLMProviders.ANTHROPIC_HAIKU]: 'claude-3-haiku-20240307',
  [LLMProviders.ANTHROPIC_CLAUDE]: 'claude-3-opus-20240229',
};

class LLMService {
  constructor(provider = LLMProviders.ANTHROPIC_HAIKU) {
    this.provider = provider;
    this.model = ModelIds[provider];
  }

  async sendAnthropicMessage(message, context) {
    console.log('Sending message to backend:', {
      message,
      model: this.model,
      provider: this.provider
    });

    try {
      const state = store.getState();
      const token = state.user.currentUser?.token;
      const isGuestMode = state.user.isGuestMode;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      if (isGuestMode) {
        headers['X-Guest-Mode'] = 'true';
      }

      const response = await fetch(LLM_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          model: this.model,
          provider: this.provider,
          context
        })
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(`API call failed: ${JSON.stringify(data)}`);
      }

      return {
        role: 'assistant',
        content: data.content,
        provider: this.provider
      };
    } catch (error) {
      console.error('Detailed LLM API Error:', {
        error,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async sendMessage(message, context = {}) {
    switch (this.provider) {
      case LLMProviders.ANTHROPIC_HAIKU:
      case LLMProviders.ANTHROPIC_CLAUDE:
        return this.sendAnthropicMessage(message, context);
      default:
        throw new Error(`Unsupported LLM provider: ${this.provider}`);
    }
  }
}

export default LLMService; 