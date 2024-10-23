import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject, setCurrentProject, fetchProjects } from '../../../w3s/w3sSlice';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ProjectForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProject = await dispatch(createProject({ name })).unwrap();
      setName('');
      await dispatch(fetchProjects());  // Keep this
      await dispatch(setCurrentProject(newProject));
      onSubmit();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const setCurrentProjectHandler = (project) => {
    dispatch(setCurrentProject(project));
  };

  const handleCancel = () => {
    setName('');
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Project Name"
          required
          className="w-full px-4 py-2 text-base border border-r-0 rounded-l border-gray-300"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 hover:bg-gray-300 focus:outline-none transition-all border-t border-b border-gray-300"
        >
          <FaCheck size={16} className="text-gray-600 hover:text-gray-900" />
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-r hover:bg-gray-300 focus:outline-none transition-all border border-l-0 border-gray-300"
        >
          <FaTimes size={16} className="text-gray-600 hover:text-gray-900" />
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
