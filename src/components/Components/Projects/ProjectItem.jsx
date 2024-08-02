import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProject } from '../../../w3s';

const ProjectItem = ({ project }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(project._id));
    }
  };

  return (
    <div className="project-item border rounded p-4 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
      <p className="text-gray-600 mb-2">Last modified: {new Date(project.lastModified).toLocaleString()}</p>
      <div className="flex justify-between">
        <button
          onClick={() => navigate(`/projects/${project._id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;