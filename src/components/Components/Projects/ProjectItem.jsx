import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProject } from '../../../w3s/w3sSlice';

const ProjectItem = ({ project }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(project._id));
    }
  };

  return (
    <li className="flex justify-between items-center bg-white p-3 rounded shadow">
      <span>{project.name}</span>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
};

export default ProjectItem;