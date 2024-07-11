// src/App.js

import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import MainEditor from './components/Editor/MainEditor';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainEditor />
      </div>
    </Provider>
  );
}

export default App;