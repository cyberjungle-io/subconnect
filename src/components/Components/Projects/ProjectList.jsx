import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject, deleteProject, fetchProjects } from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';
import { showToast } from '../../../features/toastSlice';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';

const ProjectList = ({ onClose }) => {
  const dispatch = useDispatch();
  const { list: projects, status } = useSelector((state) => state.w3s.projects);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

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
      dispatch(addUserAccessByEmail(emailData));
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      dispatch(showToast({ message: "Project deleted successfully", type: "success" }));
      setDeleteModalOpen(false);
    } catch (error) {
      dispatch(showToast({ message: "Failed to delete project", type: "error" }));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select a Project</h3>
      {status === 'loading' && <p>Loading projects...</p>}
      {status === 'failed' && <p>Error loading projects. Please try again.</p>}
      {status === 'succeeded' && (
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                >
                  {currentProject?._id === project._id ? 'Selected' : 'Select'}
                </button>
                <button
                  onClick={() => {
                    setProjectToDelete(project._id);
                    setDeleteModalOpen(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => handleDeleteProject(projectToDelete)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
};

export default ProjectList;
