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

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.editor);
  return currentUser || mode === 'view' ? children : <Navigate to="/" />;
};

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/editor"
          element={
            <PrivateRoute>
              <MainEditor />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
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