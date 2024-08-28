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
    <div className="bg-gradient-to-r from-[#d1e5f7] to-[#e6f3ff] text-gray-800 px-4 py-3 flex justify-between items-center border-b border-[#a3c9ff] shadow-sm relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
      <div className="relative z-10">
        <HamburgerMenu />
      </div>

      <div className="flex items-center space-x-5 relative z-10">
        
        {mode === 'edit' && currentUser && currentProject && (
          <>
            <div className="relative mr-3">
              <button
                onClick={toggleProjectInfo}
                className="flex items-center space-x-2 px-3 py-1.5 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
              >
                <span>Project Info</span>
                {expandedSections.currentProject ? (
                  <FaChevronUp className="transform transition-transform ml-2" />
                ) : (
                  <FaChevronDown className="transform transition-transform ml-2" />
                )}
              </button>
              {expandedSections.currentProject && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#e6f3ff] rounded shadow-lg z-[990] border border-[#a3c9ff]">
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
              className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
              title="Save Project"
            >
              <FaSave className="text-base" />
            </button>
          </>
        )}
        {currentUser && (
          <button
            onClick={handleOpenProjectModal}
            className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
            title="Open Project"
          >
            <FaFolderOpen className="text-base" />
          </button>
        )}
        {currentUser && (
          <button
            onClick={handleOpenDataModal}
            className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
            title="Open Data Modal"
          >
            <FaDatabase className="text-base" />
          </button>
        )}
        {currentUser ? (
          <button
            onClick={handleToggleMode}
            className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
            title={mode === 'edit' ? 'View Mode' : 'Edit Mode'}
          >
            {mode === 'edit' ? <FaEye className="text-base" /> : <FaEdit className="text-base" />}
          </button>
        ) : (
          <>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-3 py-1.5 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="px-3 py-1.5 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
            >
              Register
            </button>
          </>
        )}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1.5 rounded text-sm hover:bg-[#b3d9ff] transition-colors"
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