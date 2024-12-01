import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectList from './ProjectList';
import ProjectDetailView from './ProjectDetailView';
import { FaTimes } from 'react-icons/fa';
import { 
  fetchProjects, 
  fetchSharedProjects,
  deleteProject 
} from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';
import { showToast } from '../../../features/toastSlice';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';

const ProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.w3s.projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProjects());
      dispatch(fetchSharedProjects());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setView('list');
      setSelectedProject(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProjectSettings = (project) => {
    setSelectedProject(project);
    setView('detail');
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
      setView('list');
    } catch (error) {
      dispatch(showToast({ message: "Failed to delete project", type: "error" }));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[980] flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-3/4 h-3/4 rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="w-8">
            {/* Spacer for visual balance */}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {view === 'list' ? 'Projects' : selectedProject?.name}
          </h2>
          <button 
            onClick={onClose} 
            className="w-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          {view === 'list' ? (
            <ProjectList 
              onClose={onClose}
              onProjectSettings={handleProjectSettings}
            />
          ) : (
            <ProjectDetailView
              project={selectedProject}
              onBack={() => setView('list')}
              onAddUser={handleAddEmail}
              onDelete={(projectId) => {
                setProjectToDelete(projectId);
                setDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

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

export default ProjectModal;
