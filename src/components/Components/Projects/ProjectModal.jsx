import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectList from './ProjectList';
import ProjectDetailView from './ProjectDetailView';
import { FaTimes } from 'react-icons/fa';
import { 
  fetchProjects, 
  fetchSharedProjects,
  deleteProject,
  updateCurrentProject 
} from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';
import { showToast } from '../../../features/toastSlice';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';

const ProjectModal = ({ isOpen, onClose, initialView = 'list', initialProject = null, initialPage = null }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.w3s.projects);
  const [selectedProject, setSelectedProject] = useState(initialProject);
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [view, setView] = useState(initialView);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (!initialProject) {
        dispatch(fetchProjects());
        dispatch(fetchSharedProjects());
      }
    }
  }, [isOpen, dispatch, initialProject]);

  useEffect(() => {
    if (initialProject && initialView === 'detail') {
      setSelectedProject(initialProject);
      setSelectedPage(initialPage);
      setView('detail');
    }
  }, [initialProject, initialView, initialPage]);

  useEffect(() => {
    if (!isOpen) {
      setView(initialView);
      setSelectedProject(initialProject);
      setSelectedPage(initialPage);
    }
  }, [isOpen, initialView, initialProject, initialPage]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProjectSettings = (project) => {
    setSelectedProject(project);
    setSelectedPage(null);
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

  const handleUpdatePage = (updatedPage) => {
    const updatedProject = {
      ...selectedProject,
      pages: selectedProject.pages.map(page => 
        page._id === updatedPage._id ? { 
          ...page, 
          ...updatedPage,
          content: {
            ...page.content,
            ...updatedPage.content,
            components: updatedPage.content?.components || page.content?.components || [],
            globalSettings: updatedPage.content?.globalSettings || page.content?.globalSettings || {
              backgroundColor: '#f0f0f0',
              componentLayout: 'horizontal',
              style: {
                paddingTop: '20px',
                paddingRight: '20px',
                paddingBottom: '20px',
                paddingLeft: '20px',
                marginTop: '0px',
                marginRight: '0px',
                marginBottom: '0px',
                marginLeft: '0px',
                gap: '20px'
              }
            },
            canvasSettings: updatedPage.content?.canvasSettings || page.content?.canvasSettings || {
              style: {
                backgroundColor: '#ffffff',
                padding: '20px',
                margin: '0px',
                gap: '20px'
              },
              canvasHeight: '943px'
            }
          }
        } : page
      )
    };
    setSelectedProject(updatedProject);
    // Here you would typically dispatch an action to update the project in the backend
    dispatch(updateCurrentProject(updatedProject));
  };

  const handleDeletePage = (pageToDelete) => {
    const updatedProject = {
      ...selectedProject,
      pages: selectedProject.pages.filter(page => page._id !== pageToDelete._id)
    };
    setSelectedProject(updatedProject);
    // Here you would typically dispatch an action to update the project in the backend
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
              initialPage={selectedPage}
              onBack={() => setView('list')}
              onAddUser={handleAddEmail}
              onDelete={(projectId) => {
                setProjectToDelete(projectId);
                setDeleteModalOpen(true);
              }}
              onUpdatePage={handleUpdatePage}
              onDeletePage={handleDeletePage}
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
