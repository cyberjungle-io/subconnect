import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject } from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';

const ProjectList = ({ onClose }) => {
  const dispatch = useDispatch();
  const { list: projects } = useSelector((state) => state.w3s.projects);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);

  const handleSelectProject = (project) => {
    dispatch(setCurrentProject(project));
    onClose();
  };

  const handleAddEmail = (projectId) => {
    const email = prompt("Enter an email address to add to this project:");
    if (email) {
      const emailData = {
        type: 'project',
        link_id: projectId,
        email: email
      };
      console.log(emailData);
      dispatch(addUserAccessByEmail(emailData));
      // You might want to show a loading indicator or success message here
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select a Project</h3>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project._id} className="text-gray-800 flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{project.name}</span>
            <div>
              <button
                onClick={() => handleAddEmail(project._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
              >
                Add User
              </button>
              <button
                onClick={() => handleSelectProject(project)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                {currentProject?._id === project._id ? 'Selected' : 'Select'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
