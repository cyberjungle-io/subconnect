import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import LLMService, { LLMProviders } from '../services/llm/llmService';

const initialState = {
  isVisible: false,
  messages: [],
  isLoading: false,
  error: null,
  provider: LLMProviders.ANTHROPIC_HAIKU,
};

const llmService = new LLMService();

export const sendMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async (message, { getState }) => {
    try {
      // Get relevant editor context from state
      const state = getState();
      const editorContext = {
        selectedComponents: state.editor.selectedIds,
        components: state.editor.components,
        globalSettings: state.editor.globalSettings,
      };

      const response = await llmService.sendMessage(message, editorContext);
      return response;
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
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(changeProvider.fulfilled, (state, action) => {
        state.provider = action.payload;
      });
  },
});

export const { toggleAiChat, addMessage, clearMessages, setProvider } = aiChatSlice.actions;

export default aiChatSlice.reducer; 