import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectList from './ProjectList';
import ProjectDetailView from './ProjectDetailView';
import { FaTimes, FaEdit, FaFileAlt, FaUser, FaUserPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { 
  fetchProjects, 
  fetchSharedProjects,
  deleteProject,
  updateCurrentProject 
} from '../../../w3s/w3sSlice';
import { addUserAccessByEmail } from '../../../features/userSlice';
import { showToast } from '../../../features/toastSlice';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';

const CreatePageView = ({ onBack, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      name, 
      description,
      users,
      content: {
        components: [],
        globalSettings: {
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
        canvasSettings: {
          style: {
            backgroundColor: '#ffffff',
            padding: '20px',
            margin: '0px',
            gap: '20px'
          },
          canvasHeight: '943px'
        }
      }
    });
  };

  const handleAddUser = () => {
    const email = prompt("Enter an email address to add to this page:");
    if (email && email.trim() && !users.includes(email.trim())) {
      setUsers([...users, email.trim()]);
    }
  };

  const handleRemoveUser = (emailToRemove) => {
    setUsers(users.filter(email => email !== emailToRemove));
  };

  return (
    <div className="p-6 flex flex-col min-h-full">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Project
      </button>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <FaEdit className="mr-2" /> Basic Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FaEdit className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter page name"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
                    <FaFileAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter page description"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Users */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaUser className="mr-2" /> Users
            </h4>
            <button
              type="button"
              onClick={handleAddUser}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaUserPlus className="text-xl" />
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg">
            {users.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {users.map((email, index) => (
                  <li key={index} className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-gray-700">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(email)}
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-2.5 text-gray-500">No users added to this page yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Create Page
        </button>
      </div>
    </div>
  );
};

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
    setView(initialView);
    setSelectedProject(initialProject);
    setSelectedPage(initialPage);
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

  const handleCreatePage = (newPage) => {
    const updatedProject = {
      ...selectedProject,
      pages: [...(selectedProject.pages || []), { ...newPage, _id: Date.now().toString() }]
    };
    setSelectedProject(updatedProject);
    dispatch(updateCurrentProject(updatedProject));
    setView('detail');
    onClose();
  };

  const renderContent = () => {
    switch (view) {
      case 'list':
        return (
          <ProjectList 
            onClose={onClose}
            onProjectSettings={handleProjectSettings}
          />
        );
      case 'create-page':
        return (
          <CreatePageView
            onBack={() => setView('detail')}
            onSave={handleCreatePage}
          />
        );
      default:
        return (
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
            onCreatePage={() => setView('create-page')}
          />
        );
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
            {view === 'list' ? 'Projects' : view === 'create-page' ? 'Create Page' : selectedProject?.name}
          </h2>
          <button 
            onClick={onClose} 
            className="w-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          {renderContent()}
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
