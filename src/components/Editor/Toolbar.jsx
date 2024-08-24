import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt, FaEdit, FaChevronDown, FaChevronUp, FaSave, FaEye, FaFolderOpen, FaDatabase } from 'react-icons/fa';
import Modal from '../common/Modal';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';
import { logoutUser } from '../../features/userSlice';
import { setEditorMode } from '../../features/editorSlice';
import HamburgerMenu from '../common/HamburgerMenu';
import PageList from '../Components/Projects/PageList';
import ProjectModal from '../Components/Projects/ProjectModal';
import DataModal from './DataModal';

const Toolbar = ({ onSelectPage, onDeletePage, onSaveProject, onOpenProjectModal }) => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    currentProject: false,
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { mode, currentPage } = useSelector((state) => state.editor);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleEnterEditMode = () => {
    dispatch(setEditorMode('edit'));
  };

  const toggleProjectInfo = () => {
    setExpandedSections(prev => ({ ...prev, currentProject: !prev.currentProject }));
  };

  const handleToggleMode = () => {
    dispatch(setEditorMode(mode === 'edit' ? 'view' : 'edit'));
  };

  const handleOpenProjectModal = () => {
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  const handleOpenDataModal = () => {
    setIsDataModalOpen(true);
  };

  const handleCloseDataModal = () => {
    setIsDataModalOpen(false);
  };

  return (
    <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div>
        <HamburgerMenu />
      </div>

      <div className="flex items-center space-x-5">
        {currentUser && (
          <span className="text-sm mr-3">Welcome, {currentUser.username}</span>
        )}
        {mode === 'edit' && currentUser && currentProject && (
          <>
            <div className="relative mr-3">
              <button
                onClick={toggleProjectInfo}
                className="flex items-center space-x-2 bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                <span>Project Info</span>
                {expandedSections.currentProject ? (
                  <FaChevronUp className="transform transition-transform ml-2" />
                ) : (
                  <FaChevronDown className="transform transition-transform ml-2" />
                )}
              </button>
              {expandedSections.currentProject && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded shadow-lg z-10">
                  <div className="current-project-container">
                    <div className="current-project-header p-3 border-b border-gray-700">
                      <div className="current-project-info">
                        <div className="current-project-name text-sm font-semibold text-white">{currentProject.name}</div>
                        {currentPage && (
                          <div className="current-page-name text-xs text-gray-400">Page: {currentPage.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="page-list-container max-h-48 overflow-y-auto">
                      <PageList
                        projectId={currentProject._id}
                        selectedPageId={currentPage?._id}
                        onSelectPage={onSelectPage}
                        onDeletePage={onDeletePage}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onSaveProject}
              className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
              title="Save Project"
            >
              <FaSave className="text-base" />
            </button>
          </>
        )}
        {currentUser && (
          <button
            onClick={handleOpenProjectModal}
            className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
            title="Open Project"
          >
            <FaFolderOpen className="text-base" />
          </button>
        )}
        {currentUser && (
          <button
            onClick={handleOpenDataModal}
            className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
            title="Open Data Modal"
          >
            <FaDatabase className="text-base" />
          </button>
        )}
        {currentUser ? (
          <button
            onClick={handleToggleMode}
            className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
            title={mode === 'edit' ? 'View Mode' : 'Edit Mode'}
          >
            {mode === 'edit' ? <FaEye className="text-base" /> : <FaEdit className="text-base" />}
          </button>
        ) : (
          <>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Register
            </button>
          </>
        )}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        )}
      </div>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register"
      >
        <RegisterForm onClose={() => setRegisterModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        title="Login"
      >
        <LoginForm onClose={() => setLoginModalOpen(false)} />
      </Modal>

      {isProjectModalOpen && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
        />
      )}

      <DataModal
        isOpen={isDataModalOpen}
        onClose={handleCloseDataModal}
      />
    </div>
  );
};

export default Toolbar;