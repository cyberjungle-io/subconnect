import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaEdit, FaChevronDown, FaChevronUp, FaSave, FaEye, FaFolderOpen, FaDatabase, FaTools } from 'react-icons/fa';
import Modal from '../common/Modal';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';
import { logoutUser } from '../../features/userSlice';
import { setEditorMode } from '../../features/editorSlice';
import HamburgerMenu from '../common/HamburgerMenu';
import PageList from '../Components/Projects/PageList';
import ProjectModal from '../Components/Projects/ProjectModal';
import DataModal from './DataModal';
import { toggleFloatingMenu } from '../../features/editorSlice';

const Toolbar = ({ onSelectPage, onDeletePage, onSaveProject, onOpenProjectModal }) => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    currentProject: false,
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { mode, currentPage } = useSelector((state) => state.editor);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const pageListRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageListRef.current && !pageListRef.current.contains(event.target)) {
        setExpandedSections(prev => ({ ...prev, currentProject: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
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

  const handleToggleFloatingMenu = () => {
    dispatch(toggleFloatingMenu());
  };

  return (
    <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4] text-gray-800 px-4 py-3 flex justify-between items-center border-b border-[#c0c0c0] shadow-sm relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>
      <div className="relative z-10">
        <HamburgerMenu />
      </div>

      <div className="flex items-center space-x-5 relative z-10">
        
        {mode === 'edit' && currentUser && currentProject && (
          <>
            <div className="relative mr-3" ref={pageListRef}>
              <button
                onClick={toggleProjectInfo}
                className="flex flex-col items-start px-3 py-1.5 pr-8 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
              >
                <span className="font-semibold">{currentProject.name}</span>
                {currentPage && (
                  <span className="text-xs text-gray-600">{currentPage.name}</span>
                )}
                <FaChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform ${expandedSections.currentProject ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.currentProject && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#e8e8e8] rounded shadow-lg z-[990] border border-[#c0c0c0]">
                  <div className="current-project-container">
                    <div className="current-project-header p-3 border-b border-[#c0c0c0]">
                      <div className="current-project-info">
                        <div className="current-project-name text-sm font-semibold text-gray-800">{currentProject.name}</div>
                        {currentPage && (
                          <div className="current-page-name text-xs text-gray-600">Page: {currentPage.name}</div>
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
              className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
              title="Save Project"
            >
              <FaSave className="text-base" />
            </button>
          </>
        )}
        {currentUser && (
          <button
            onClick={handleOpenProjectModal}
            className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
            title="Open Project"
          >
            <FaFolderOpen className="text-base" />
          </button>
        )}
        {currentUser && (
          <button
            onClick={handleOpenDataModal}
            className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
            title="Open Data Modal"
          >
            <FaDatabase className="text-base" />
          </button>
        )}
        {currentUser && (
          <>
            <button
              onClick={handleToggleMode}
              className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
              title={mode === 'edit' ? 'View Mode' : 'Edit Mode'}
            >
              {mode === 'edit' ? <FaEye className="text-base" /> : <FaEdit className="text-base" />}
            </button>
            {mode === 'edit' && (
              <button
                onClick={handleToggleFloatingMenu}
                className="flex items-center justify-center w-9 h-9 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
                title="Toggle Floating Menu"
              >
                <FaTools className="text-base" />
              </button>
            )}
          </>
        )}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1.5 rounded text-sm hover:bg-[#d0d0d0] transition-colors"
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