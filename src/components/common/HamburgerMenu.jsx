import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaFolderOpen, FaDatabase, FaHome, FaDollarSign, FaCog, FaQuestionCircle, FaBug, FaServer, FaBook, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import DataModal from '../Editor/DataModal'; // Import the DataModal component
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/userSlice';
import Modal from './Modal';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

const HamburgerMenu = ({ onOpenProjectModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOpenProject = () => {
    onOpenProjectModal();
    toggleMenu();
  };

  const handleOpenDataModal = () => {
    setIsDataModalOpen(true);
    toggleMenu();
  };

  const handleCloseDataModal = () => {
    setIsDataModalOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toggleMenu();
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-lg"
        aria-label="Toggle menu"
      >
        <FaBars className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex">
          <div className="bg-white w-80 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
                  
                </div>
                <button 
                  onClick={toggleMenu} 
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg"
                  aria-label="Close menu"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="p-6 space-y-4 overflow-y-auto flex-1 pb-24">
              <div className="space-y-2">
                <a
                  href="/"
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                >
                  <FaHome className="h-4 w-4 mr-3" />
                  <span className="font-medium">Home</span>
                </a>

                <button
                  onClick={handleOpenProject}
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                >
                  <FaFolderOpen className="h-4 w-4 mr-3" />
                  <span className="font-medium">Projects</span>
                </button>

                <button
                  onClick={handleOpenDataModal}
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                >
                  <FaDatabase className="h-4 w-4 mr-3" />
                  <span className="font-medium">Data</span>
                </button>

                <a
                  href="/node-services"
                  className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                >
                  <FaServer className="h-4 w-4 mr-3" />
                  <span className="font-medium">Nodes</span>
                </a>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <span className="px-3 text-xs font-semibold text-gray-500 uppercase">Resources</span>
                </div>
                <div className="space-y-2">
                  <a
                    href="/tutorials"
                    className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  >
                    <FaBook className="h-4 w-4 mr-3" />
                    <span className="font-medium">Tutorials</span>
                  </a>

                  <Link
                    to="/docs"
                    onClick={toggleMenu}
                    className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  >
                    <FaFileAlt className="h-4 w-4 mr-3" />
                    <span className="font-medium">Documentation</span>
                  </Link>

                  <a
                    href="/pricing"
                    className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  >
                    <FaDollarSign className="h-4 w-4 mr-3" />
                    <span className="font-medium">Pricing</span>
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <span className="px-3 text-xs font-semibold text-gray-500 uppercase">Support</span>
                </div>
                <div className="space-y-2">
                  <a
                    href="/settings"
                    className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  >
                    <FaCog className="h-4 w-4 mr-3" />
                    <span className="font-medium">Settings</span>
                  </a>

                  <a
                    href="/bug-report"
                    className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  >
                    <FaBug className="h-4 w-4 mr-3" />
                    <span className="font-medium">Report a Bug</span>
                  </a>

                  <a
                    href="/help"
                    className="flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  >
                    <FaQuestionCircle className="h-4 w-4 mr-3" />
                    <span className="font-medium">Help</span>
                  </a>
                </div>
              </div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
              <div className="p-4">
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg
                      bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700
                      transition-colors duration-200 font-medium"
                  >
                    <FaSignOutAlt className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setLoginModalOpen(true)}
                      className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg
                        bg-blue-600 hover:bg-blue-700 text-white
                        transition-colors duration-200 font-medium"
                    >
                      <FaSignOutAlt className="h-4 w-4 mr-2" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => setRegisterModalOpen(true)}
                      className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg
                        border border-gray-300 hover:bg-gray-50 text-gray-700
                        transition-colors duration-200 font-medium"
                    >
                      <FaSignOutAlt className="h-4 w-4 mr-2" />
                      <span>Create Account</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="bg-black bg-opacity-50 flex-grow"
            onClick={toggleMenu}
          ></div>
        </div>
      )}

      <DataModal
        isOpen={isDataModalOpen}
        onClose={handleCloseDataModal}
      />

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        title="Login"
      >
        <LoginForm onClose={() => setLoginModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register"
      >
        <RegisterForm onClose={() => setRegisterModalOpen(false)} />
      </Modal>
    </>
  );
};

export default HamburgerMenu;
