// src/components/common/Modal.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleOverlayClick}>
      <div className="bg-gray-100 w-96 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          {React.cloneElement(children, { onClose })}
        </div>
      </div>
    </div>
  );
};

export default Modal;