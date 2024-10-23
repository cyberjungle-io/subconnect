import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaFolderOpen, FaDatabase, FaHome, FaDollarSign, FaCog, FaQuestionCircle, FaBug, FaServer, FaBook } from 'react-icons/fa';
import DataModal from '../Editor/DataModal'; // Import the DataModal component

const HamburgerMenu = ({ onOpenProjectModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

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

  return (
    <>
      <button
        onClick={toggleMenu}
        className="text-xl focus:outline-none"
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex">
          <div className="bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={toggleMenu} className="text-md text-gray-600" aria-label="Close menu">
                <FaTimes />
              </button>
            </div>
            <nav>
              <a
                href="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaHome className="mr-2" />
                Home
              </a>
              <button
                onClick={handleOpenProject}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaFolderOpen className="mr-2" />
                Projects
              </button>
              <button
                onClick={handleOpenDataModal}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaDatabase className="mr-2" />
                Data
              </button>
              <a
                href="/node-services"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaServer className="mr-2" />
                Nodes
              </a>
              <a
                href="/tutorials"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaBook className="mr-2" />
                Tutorials
              </a>
              <a
                href="/pricing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaDollarSign className="mr-2" />
                Pricing
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaCog className="mr-2" />
                Settings
              </a>
              <a
                href="/bug-report"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaBug className="mr-2" />
                Report a Bug
              </a>
              <a
                href="/help"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 flex items-center"
              >
                <FaQuestionCircle className="mr-2" />
                Help
              </a>
              
            </nav>
          </div>
          <div
            className="bg-gray-800 bg-opacity-50 flex-grow"
            onClick={toggleMenu}
          ></div>
        </div>
      )}

      <DataModal
        isOpen={isDataModalOpen}
        onClose={handleCloseDataModal}
      />
    </>
  );
};

export default HamburgerMenu;
