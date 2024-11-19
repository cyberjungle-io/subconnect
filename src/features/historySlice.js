import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  past: [],
  future: [],
  currentIndex: -1,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action) => {
      state.past = [...state.past, action.payload];
      state.future = [];
      state.currentIndex = state.past.length - 1;
    },
    undo: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.future = [state.past[state.currentIndex + 1], ...state.future];
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        state.currentIndex += 1;
        state.past = [...state.past, state.future[0]];
        state.future = state.future.slice(1);
      }
    },
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
      state.currentIndex = -1;
    },
  },
});

export const { addToHistory, undo, redo, clearHistory } = historySlice.actions;
export default historySlice.reducer; 