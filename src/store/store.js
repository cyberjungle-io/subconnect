import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import editorReducer from '../features/editorSlice';
import { w3sReducer } from '../w3s';
import userReducer from '../features/userSlice';
import toastReducer from '../features/toastSlice';
import graphQLReducer from '../features/graphQLSlice';

const rootReducer = combineReducers({
  editor: editorReducer,
  w3s: w3sReducer,
  user: userReducer,
  toast: toastReducer,
  graphQL: graphQLReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['editor', 'w3s', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;