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
import PricingPage from './pages/PricingPage';
import BugReportPage from './pages/BugReportPage';
import NodeServicesPage from './pages/NodeServicesPage';
import TutorialsPage from './pages/Tutorials';
import DocumentationPage from './pages/Documentation';
import ImageDocs from './pages/Docs/ImageDocs';
import FlexContainerDocs from './pages/Docs/FlexContainerDocs';
import ChartDocs from './pages/Docs/ChartDocs';
import TextDocs from './pages/Docs/TextDocs';
import KanbanDocs from './pages/Docs/KanbanDocs';
import TodoDocs from './pages/Docs/TodoDocs';
import VideoDocs from './pages/Docs/VideoDocs';
import WhiteboardDocs from './pages/Docs/WhiteboardDocs';
import TableDocs from './pages/Docs/TableDocs';
import QueryValueDocs from './pages/Docs/QueryValueDocs';
import ResponsiveDesignDocs from './pages/Docs/ResponsiveDesignDocs';
import DocsLanding from './pages/Docs/DocsLandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import AuthLayout from './components/layouts/AuthLayout';

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
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/bug-report" element={<BugReportPage />} />
        <Route path="/node-services" element={<NodeServicesPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/docs" element={<DocumentationPage />}>
          <Route index element={<DocsLanding />} />
          <Route path="components/flex-container" element={<FlexContainerDocs />} />
          <Route path="components/image" element={<ImageDocs />} />
          <Route path="components/charts" element={<ChartDocs />} />
          <Route path="components/text" element={<TextDocs />} />
          <Route path="components/kanban" element={<KanbanDocs />} />
          <Route path="components/todo" element={<TodoDocs />} />
          <Route path="components/video" element={<VideoDocs />} />
          <Route path="components/whiteboard" element={<WhiteboardDocs />} />
          <Route path="components/table" element={<TableDocs />} />
          <Route path="components/query-value" element={<QueryValueDocs />} />
          <Route path="guides/responsive-design" element={<ResponsiveDesignDocs />} />
          <Route path="legal/terms" element={<TermsOfService />} />
          <Route path="legal/privacy" element={<PrivacyPolicy />} />
          <Route path="reset-password/:token" element={<AuthLayout />} />
        </Route>
        <Route
          path="/reset-password/:token"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                <ResetPasswordForm />
              </div>
            </div>
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
