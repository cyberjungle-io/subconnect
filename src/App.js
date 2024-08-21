// src/App.js

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import store from './store/store';
import MainEditor from './components/Editor/MainEditor';
import './styleSheets/propertiesPanelStyles.css';
import { checkAuthStatus } from './features/userSlice';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div className="App">
      <MainEditor />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;