import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../../w3s/w3sSlice';

const ProjectForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted. Project name:', name);
    
    try {
      console.log('Dispatching createProject with:', { name });
      const result = await dispatch(createProject({ name })).unwrap();
      console.log('Project created:', result);
      setName('');
      onSubmit();
    } catch (error) {
      console.error('Failed to create project:', error);
      // Handle this error appropriately in your UI
    }
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