import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject, setCurrentProject, fetchProjects } from '../../../w3s/w3sSlice';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm;
