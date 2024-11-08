import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/common/Modal';
import LoginForm from '../components/auth/LoginForm';
import LandingPageGraphic_2 from '../pages/Images/LandingPageGraphic_2.svg';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 font-['Roboto',sans-serif]">
      <header className="p-4 flex justify-between items-center bg-transparent">
        <div className="text-2xl font-bold text-indigo-900">Subconnect</div>
        <div className="space-x-4">
          <button onClick={openLoginModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Log In
          </button>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Register
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center pt-8">
        <div className="container mx-auto px-4 flex">
          <div className="w-3/5 pr-12 space-y-8">
            <h1 className="text-6xl font-bold leading-tight text-indigo-900">
              Build Interactive Dashboards in Minutes
            </h1>
            <p className="text-2xl text-indigo-700 leading-relaxed">
              Create powerful data visualizations, collaborative workspaces, and responsive layouts without coding.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Visual Builder</h3>
                <p className="text-gray-700">Drag-and-drop components for tables, charts, and interactive elements.</p>
              </div>
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Live Data</h3>
                <p className="text-gray-700">Connect to your data sources with built-in GraphQL integration.</p>
              </div>
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Collaboration</h3>
                <p className="text-gray-700">Real-time whiteboards, kanban boards, and team workspaces.</p>
              </div>
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Responsive Design</h3>
                <p className="text-gray-700">Automatically adapts to any screen size or device.</p>
              </div>
            </div>

            <div className="pt-8">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300 mr-4">
                Start Free Trial
              </button>
              <Link to="/docs" className="inline-block bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300">
                View Documentation
              </Link>
            </div>
          </div>
          
          <div className="w-2/5 self-center">
            <img src={LandingPageGraphic_2} alt="Interactive Dashboard Builder" className="w-full h-auto" />
          </div>
        </div>
      </main>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="Log In">
        <LoginForm />
      </Modal>
    </div>
  );
};

export default LandingPage;