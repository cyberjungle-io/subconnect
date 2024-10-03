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
      <header className="p-4 flex justify-end items-center bg-transparent">
        <div className="space-x-4">
          <button onClick={openLoginModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Log In
          </button>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Register
          </Link>
        </div>
      </header>

      <div className="text-center mt-8">
        <h1 className="text-7xl font-bold text-indigo-900">Subconnect</h1>
      </div>

      <main className="flex-grow flex items-start pt-8"> {/* Changed from items-center to items-start and added pt-8 */}
        <div className="container mx-auto px-4 flex items-center">
          <div className="w-3/5 pr-12 space-y-8"> {/* Changed space-y-12 to space-y-8 */}
            <h2 className="text-6xl font-bold leading-tight text-indigo-900">
              Coordinating the Decentralized Workforce
            </h2>
            <p className="text-3xl text-indigo-700 leading-relaxed">
              Build Custom Pages With Live Data in Minutes!
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300">
              Connect Now
            </button>
          </div>
          <div className="w-2/5">
            <img src={LandingPageGraphic_2} alt="Landing Page Graphic" className="w-full h-auto" />
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