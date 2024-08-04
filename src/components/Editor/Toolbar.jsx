import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaCopy, FaPaste, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Modal from '../common/Modal';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';
import { logoutUser } from '../../features/userSlice';
const Toolbar = ({ onAlign, onDistribute, onCopy, onPaste }) => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
      <div className="flex space-x-2">
        <button onClick={() => onAlign('left')} className="p-2 hover:bg-gray-700 rounded">
          <FaAlignLeft />
        </button>
        <button onClick={() => onAlign('center')} className="p-2 hover:bg-gray-700 rounded">
          <FaAlignCenter />
        </button>
        <button onClick={() => onAlign('right')} className="p-2 hover:bg-gray-700 rounded">
          <FaAlignRight />
        </button>
        <button onClick={() => onDistribute('horizontal')} className="p-2 hover:bg-gray-700 rounded">
          <FaAlignJustify />
        </button>
        <div className="border-l border-gray-600 mx-2"></div>
        <button onClick={onCopy} className="p-2 hover:bg-gray-700 rounded">
          <FaCopy />
        </button>
        <button onClick={onPaste} className="p-2 hover:bg-gray-700 rounded">
          <FaPaste />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <span className="text-sm">Welcome, {currentUser.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
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