// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store/store';
import { checkAuthStatus } from './features/userSlice';
import LandingPage from './pages/LandingPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import MainEditor from './components/Editor/MainEditor';
import { fetchProject } from './w3s/w3sSlice';
import { setEditorMode } from './features/editorSlice';
import { fetchQueries } from './w3s/w3sSlice';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/store';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.editor);
  return currentUser || mode === 'view' ? children : <Navigate to="/" />;
};

function AppContent() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/editor" /> : <LandingPage />} />
        <Route path="/login" element={currentUser ? <Navigate to="/editor" /> : <LoginForm />} />
        <Route path="/register" element={currentUser ? <Navigate to="/editor" /> : <RegisterForm />} />
        <Route
          path="/editor"
          element={
            <PrivateRoute>
              <MainEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <MainEditor />
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;