import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
import { w3sReducer } from '../w3s';

const store = configureStore({
  reducer: {
    editor: editorReducer,
    w3s: w3sReducer,
  },
});

export default store;