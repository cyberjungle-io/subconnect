import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import LLMService, { LLMProviders } from '../services/llm/llmService';
import { componentConfig } from '../components/Components/componentConfig';

const initialState = {
  isVisible: false,
  messages: [],
  isLoading: false,
  error: null,
  provider: LLMProviders.ANTHROPIC_HAIKU,
};

const llmService = new LLMService();

const generateAvailableCommands = () => {
  return Object.entries(componentConfig)
    .map(([_, config]) => `- "Add a ${config.name}" - Creates a new ${config.name.toLowerCase()} on the canvas`)
    .join('\n');
};

export const sendMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async (message, { getState, dispatch }) => {
    try {
      const state = getState();
      const selectedIds = state.editor.selectedIds;
      const selectedComponent = selectedIds.length === 1 
        ? state.editor.components.find(c => c.id === selectedIds[0])
        : null;

      const contextualMessage = `
        Note: I am an AI assistant that can help you with this canvas editor application.
        I can perform actions like adding components to your canvas.
        ${selectedComponent ? `
        Currently selected component:
        Type: ${selectedComponent.type}
        Name: ${selectedComponent.props?.name || 'Unnamed'}
        Style: ${JSON.stringify(selectedComponent.style, null, 2)}
        Props: ${JSON.stringify(selectedComponent.props, null, 2)}
        ` : ''}
        Available commands:
        ${generateAvailableCommands()}
        
        User message: ${message}
      `;

      // First, add the user's message
      dispatch(addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }));

      // Get relevant editor context from state
      const editorContext = {
        selectedComponents: state.editor.selectedIds,
        components: state.editor.components,
        globalSettings: state.editor.globalSettings,
      };

      const response = await llmService.sendMessage(contextualMessage, editorContext);
      
      // Create and return the assistant's response message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      return assistantMessage;  // This will be handled by the fulfilled case
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
);

export const changeProvider = createAsyncThunk(
  'aiChat/changeProvider',
  async (provider, { dispatch }) => {
    llmService.provider = provider;
    return provider;
  }
);

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    toggleAiChat: (state) => {
      state.isVisible = !state.isVisible;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);  // action.payload will be the assistantMessage
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        // Optionally add an error message to the chat
        state.messages.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request.',
          timestamp: new Date().toISOString(),
          status: 'error'
        });
      });
  },
});

export const { toggleAiChat, addMessage, clearMessages, setProvider } = aiChatSlice.actions;

export default aiChatSlice.reducer; 