import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import Modal from '../common/Modal';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';
import { logoutUser } from '../../features/userSlice';
import HamburgerMenu from '../common/HamburgerMenu';

const Toolbar = () => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
      {/* Hamburger menu */}
      <HamburgerMenu />

      {/* Center content */}
      <div className="flex items-center space-x-4">
        {currentUser && (
          <span className="text-sm">Welcome, {currentUser.username}</span>
        )}
      </div>

      {/* Right-aligned buttons */}
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="bg-green-500 px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
            >
              Register
            </button>
          </>
        )}
      </div>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register"
      >
        <RegisterForm onClose={() => setRegisterModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        title="Login"
      >
        <LoginForm onClose={() => setLoginModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Toolbar;