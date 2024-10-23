import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject, deleteProject, fetchProjects } from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';
import { showToast } from '../../../features/toastSlice';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';
import { FaTrash, FaUserPlus, FaPlus } from 'react-icons/fa';
import ProjectForm from './ProjectForm';

const ProjectList = ({ onClose }) => {
  const dispatch = useDispatch();
  const { list: projects, status } = useSelector((state) => state.w3s.projects);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    // Remove the status === 'idle' check to ensure it always fetches
    dispatch(fetchProjects());
  }, [dispatch]);

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
      <div className="flex justify-end items-center mb-2">
        {!showNewProject && (
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold px-4 py-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
            title="Create New Project"
          >
            <FaPlus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {showNewProject && (
        <div className="mb-4">
          <ProjectForm 
            onSubmit={() => {
              onClose();
              setShowNewProject(false);
            }} 
          />
        </div>
      )}
<h3 className="text-lg font-semibold pb-3">Select a Project</h3>
      {status === 'loading' && <p>Loading projects...</p>}
      {status === 'failed' && <p>Error loading projects. Please try again.</p>}
      {status === 'succeeded' && (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li 
              key={project._id} 
              onClick={() => handleSelectProject(project)}
              className={`
                text-gray-800 flex justify-between items-center p-2 rounded cursor-pointer
                ${currentProject?._id === project._id 
                  ? 'bg-blue-200 hover:bg-blue-300' 
                  : 'bg-gray-100 hover:bg-gray-200'
                }
              `}
            >
              <span>{project.name}</span>
              <div className="flex gap-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddEmail(project._id);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                  title="Add User"
                >
                  <FaUserPlus size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectToDelete(project._id);
                    setDeleteModalOpen(true);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                  title="Delete Project"
                >
                  <FaTrash size={20} />
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
