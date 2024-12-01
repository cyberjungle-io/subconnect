import React from 'react';
import { FaUserPlus, FaTrash, FaArrowLeft, FaUser, FaFile } from 'react-icons/fa';

const ProjectDetailView = ({ project, onBack, onAddUser, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 flex flex-col min-h-full">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Projects
      </button>

      <h3 className="text-xl font-semibold text-gray-900 mb-6">{project.name}</h3>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Users Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaUser className="mr-2" /> Users
            </h4>
            <button
              onClick={() => onAddUser(project._id)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaUserPlus className="text-xl" />
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg">
            <ul className="divide-y divide-gray-200">
              {/* Project Owner */}
              <li className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-700">
                  {project.createdBy}
                </span>
                <span className="text-sm font-medium text-blue-600">Owner</span>
              </li>
              
              {/* Other Users */}
              {project.access_records?.map((record, index) => (
                <li key={index} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-gray-700">{record.user_details.email}</span>
                  <span className="text-sm text-gray-500">Member</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pages Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaFile className="mr-2" /> Pages
          </h4>
          <div className="bg-white border border-gray-200 rounded-lg">
            {project.pages && project.pages.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {project.pages.map((page, index) => (
                  <li key={index} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-700">{page.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(page.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-gray-500">No pages in this project yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Project Button */}
      <div className="flex justify-end mt-auto pt-6">
        <button
          onClick={() => onDelete(project._id)}
          className="flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded transition-colors duration-200"
        >
          <FaTrash className="mr-2" />
          Delete Project
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailView; 