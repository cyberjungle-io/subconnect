import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaFolderOpen } from 'react-icons/fa';

const HamburgerMenu = ({ onOpenProjectModal }) => {
  const [isOpen, setIsOpen] = useState(false);

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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Home
              </a>
              <button
                onClick={handleOpenProject}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaFolderOpen className="mr-2" />
                Open Project
              </button>
              <a
                href="/pricing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Pricing
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                href="/help"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
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
    </>
  );
};

export default HamburgerMenu;
