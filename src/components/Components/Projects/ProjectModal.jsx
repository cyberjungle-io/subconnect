import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import { FaTimes } from 'react-icons/fa';
import { fetchProjects, fetchSharedProjects } from '../../../w3s/w3sSlice';

const ProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.w3s.projects);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProjects());
      dispatch(fetchSharedProjects());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[980] flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-3/4 h-3/4 rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <div className="w-8">
            {/* Spacer for visual balance */}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <button onClick={onClose} className="w-8 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          <ProjectList onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
