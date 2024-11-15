// src/components/common/Modal.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, children, extraButton }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-[800px] rounded-lg shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto relative">
        <div className="absolute right-4 top-4 z-10">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <div className="absolute left-4 top-4 z-10">
          {extraButton}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;