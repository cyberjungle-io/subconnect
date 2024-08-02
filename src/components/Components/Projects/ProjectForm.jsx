import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject, updateProject } from '../../../w3s';

const ProjectForm = ({ project, onSubmit }) => {
  const [name, setName] = useState(project?.name || '');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (project) {
      dispatch(updateProject({ id: project._id, projectData: { name } }));
    } else {
      dispatch(createProject({ name }));
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="project-form space-y-4">
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
        {project ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;