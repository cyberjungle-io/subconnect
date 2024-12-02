import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject, deleteProject, fetchProjects, fetchSharedProjects } from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';
import { showToast } from '../../../features/toastSlice';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';
import { FaTrash, FaUserPlus, FaPlus, FaEllipsisV, FaUser } from 'react-icons/fa';
import ProjectForm from './ProjectForm';

const ProjectList = ({ onClose, onProjectSettings }) => {
  const dispatch = useDispatch();
  const { list: projects, status } = useSelector((state) => state.w3s.projects);
  const { list: sharedProjects } = useSelector((state) => state.w3s.sharedProjects);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchSharedProjects());
  }, [dispatch]);

  const getMemberNames = (project) => {
    const names = [];
    if (project.creatorUsername) {
      names.push(`${project.creatorUsername} (Creator)`);
    }
    if (project.access_records) {
      project.access_records.forEach(record => {
        names.push(record.user_details?.username || record.user_details?.email || 'Unknown User');
      });
    }
    return names.join('\n');
  };

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
    <div className="p-6">
      {/* New Project Button */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-600 font-medium">Select a project</span>
        {!showNewProject && (
          <button
            onClick={() => setShowNewProject(true)}
            className="group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2"
          >
            <FaPlus size={16} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Project Form */}
      {showNewProject && (
        <div className="mb-6">
          <ProjectForm 
            onSubmit={() => {
              onClose();
              setShowNewProject(false);
            }}
            onCancel={() => setShowNewProject(false)}
          />
        </div>
      )}

      {/* Project List */}
      {status === 'loading' && (
        <div className="text-center py-8 text-gray-600">Loading projects...</div>
      )}
      {status === 'failed' && (
        <div className="text-center py-8 text-red-600">Error loading projects. Please try again.</div>
      )}
      {status === 'succeeded' && (
        <ul className="space-y-3">
          {[...projects, ...sharedProjects].map((project) => {
            const isSelected = currentProject?._id === project._id;
            return (
              <li 
                key={project._id} 
                className={`
                  flex justify-between items-center p-4 rounded-lg
                  border transition-all duration-200
                  ${isSelected
                    ? 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }
                `}
              >
                <span 
                  className="font-medium text-gray-900 flex-grow cursor-pointer"
                  onClick={() => handleSelectProject(project)}
                >
                  {project.name}
                </span>
                <div className="flex items-center gap-8">
                  <div className="relative group transition-colors duration-200 hover:text-gray-800">
                    <FaUser className="text-gray-500 transition-colors duration-200 group-hover:text-gray-700" size={16} />
                    <span className="absolute -top-1 -right-3 text-xs font-medium text-gray-600 transition-colors duration-200 group-hover:text-gray-800">
                      {(project.access_records?.length || 0) + 1}
                    </span>
                    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-pre z-10 -left-2 top-8">
                      {getMemberNames(project)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProjectSettings(project);
                    }}
                    className={`p-2 text-gray-400 rounded-full transition-all duration-200 
                      ${isSelected 
                        ? 'hover:text-indigo-700 hover:bg-indigo-200' 
                        : 'hover:text-gray-700 hover:bg-gray-200'
                      }`}
                    title="Project Settings"
                  >
                    <FaEllipsisV size={18} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Delete Modal */}
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
