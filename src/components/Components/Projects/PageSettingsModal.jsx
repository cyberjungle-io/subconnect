import React, { useState } from 'react';
import Modal from '../../common/Modal';
import { FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';

const PageSettingsModal = ({ isOpen, onClose, page, onDelete, onSave }) => {
  const [name, setName] = useState(page?.name || '');
  const [description, setDescription] = useState(page?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
            Page Settings
          </span>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Configure Page</h3>
          <p className="text-gray-600">Customize your page settings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaEdit className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Page Name"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={onDelete}
                className="absolute right-3 text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg"
                title="Delete Page"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
                <FaFileAlt className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Page Description"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Save Changes
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PageSettingsModal; 