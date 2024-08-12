import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
import { w3sReducer } from '../w3s';
import userReducer from '../features/userSlice';
import toastReducer from '../features/toastSlice';

const store = configureStore({
  reducer: {
    editor: editorReducer,
    w3s: w3sReducer,
    user: userReducer,
    toast: toastReducer,
  },
});

export default store;