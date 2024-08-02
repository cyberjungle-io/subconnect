import React from 'react';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import { FaTimes } from 'react-icons/fa';

const ProjectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-3/4 h-3/4 rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 bg-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold">Projects</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <ProjectList />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
            <ProjectForm onSubmit={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;