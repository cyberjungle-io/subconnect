import React from 'react';
import { FaUserPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ProjectDetailView = ({ project, onBack, onAddUser, onDelete }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Projects
      </button>

      <h3 className="text-xl font-semibold text-gray-900 mb-6">{project.name}</h3>

      <div className="space-y-4">
        <button
          onClick={() => onAddUser(project._id)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="flex items-center">
            <FaUserPlus className="mr-3 text-gray-400" />
            <span className="text-gray-700">Add User</span>
          </span>
        </button>

        <button
          onClick={() => onDelete(project._id)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="flex items-center">
            <FaTrash className="mr-3 text-red-400" />
            <span className="text-red-600">Delete Project</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailView; 