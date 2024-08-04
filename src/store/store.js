import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
import { w3sReducer } from '../w3s';
import userReducer from '../features/userSlice';

const store = configureStore({
  reducer: {
    editor: editorReducer,
    w3s: w3sReducer,
    user: userReducer,
  },
});

export default store;