import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaChevronDown, FaChevronUp, FaSave, FaEye, FaFolderOpen, FaDatabase, FaTools } from 'react-icons/fa';
import Modal from '../common/Modal';
import HamburgerMenu from '../common/HamburgerMenu';
import PageList from '../Components/Projects/PageList';
import ProjectModal from '../Components/Projects/ProjectModal';
import { toggleFloatingMenu, setEditorMode } from '../../features/editorSlice';

// Add these helper functions at the top of your file, outside the component
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');

const generateComplementaryShade = (baseColor) => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;

  // Calculate perceived brightness
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  let newR, newG, newB;
  const contrastFactor = 60; // Increased from 30 to 50 for higher contrast

  if (brightness > 128) {
    // If background is light, make a darker shade
    newR = Math.max(0, rgb.r - contrastFactor);
    newG = Math.max(0, rgb.g - contrastFactor);
    newB = Math.max(0, rgb.b - contrastFactor);
  } else {
    // If background is dark, make a lighter shade
    newR = Math.min(255, rgb.r + contrastFactor);
    newG = Math.min(255, rgb.g + contrastFactor);
    newB = Math.min(255, rgb.b + contrastFactor);
  }

  return rgbToHex(newR, newG, newB);
};

const Toolbar = ({ onSelectPage, onDeletePage, onSaveProject, onOpenProjectModal }) => {
  const [expandedSections, setExpandedSections] = useState({
    currentProject: false,
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { mode, currentPage } = useSelector((state) => state.editor);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const pageListRef = useRef(null);
  const toolbarSettings = useSelector(state => state.editor.toolbarSettings) || {};

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

  const handleToggleFloatingMenu = () => {
    dispatch(toggleFloatingMenu());
  };

  const isFloatingMenuVisible = useSelector(state => state.editor.isFloatingMenuVisible);

  // Calculate complementary shade for input background
  const inputBackgroundColor = generateComplementaryShade(toolbarSettings.backgroundColor || '#e8e8e8');

  // Create a style tag for dynamic hover effect and placeholder color
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .toolbar-button:hover {
        background-color: ${toolbarSettings.buttonHoverColor || '#d0d0d0'} !important;
      }
      .page-list input::placeholder {
        color: ${toolbarSettings.textColor || '#333333'};
        opacity: 0.7;
      }
      .page-list input:focus {
        outline: none;
        box-shadow: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [toolbarSettings.buttonHoverColor, toolbarSettings.textColor]);

  const buttonStyle = {
    backgroundColor: 'transparent',
    color: toolbarSettings.textColor || '#333333',
  };

  return (
    <div 
      className="text-gray-800 px-4 py-3 flex justify-between items-center border-b border-[#c0c0c0] shadow-sm relative"
      style={{
        backgroundColor: toolbarSettings.backgroundColor || '#e8e8e8',
        color: toolbarSettings.textColor || '#333333',
      }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>
      
      {/* Left side - Hamburger Menu */}
      <div className="relative z-10">
        <HamburgerMenu onOpenProjectModal={onOpenProjectModal} />
      </div>

      {/* Right side - Icons and Project Dropdown */}
      <div className="flex items-center space-x-5 relative z-10">
        {currentUser && (
          <>
            {/* Save button - only visible in edit mode */}
            {mode === 'edit' && (
              <button
                onClick={onSaveProject}
                className="toolbar-button flex items-center justify-center w-9 h-9 rounded text-sm transition-colors"
                style={buttonStyle}
                title="Save Project"
              >
                <FaSave className="text-base" />
              </button>
            )}
            
            {/* View/Edit toggle button */}
            <button
              onClick={handleToggleMode}
              className="toolbar-button flex items-center justify-center w-9 h-9 rounded text-sm transition-colors"
              style={buttonStyle}
              title={mode === 'edit' ? 'View Mode' : 'Edit Mode'}
            >
              {mode === 'edit' ? <FaEye className="text-base" /> : <FaEdit className="text-base" />}
            </button>

            {/* Project dropdown - only visible when there's a current project */}
            {currentProject && (
              <div className="relative" ref={pageListRef}>
                <button
                  onClick={toggleProjectInfo}
                  className="toolbar-button flex flex-col items-start px-3 py-1.5 pr-8 rounded text-sm transition-colors"
                  style={buttonStyle}
                >
                  <span className="font-semibold">{currentProject.name}</span>
                  {currentPage && (
                    <div className="current-page-name text-xs">{currentPage.name}</div>
                  )}
                  <FaChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform ${expandedSections.currentProject ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.currentProject && (
                  <div 
                    className="absolute top-full right-0 mt-1 rounded shadow-lg z-[990]"
                    style={{
                      backgroundColor: toolbarSettings.backgroundColor || '#e8e8e8',
                    }}
                  >
                    <div className="current-project-container">
                      <div className="page-list-container max-h-48 overflow-y-auto">
                        <PageList
                          projectId={currentProject._id}
                          selectedPageId={currentPage?._id}
                          onSelectPage={onSelectPage}
                          onDeletePage={onDeletePage}
                          toolbarSettings={{
                            ...toolbarSettings,
                            inputBackgroundColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {isProjectModalOpen && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
        />
      )}
    </div>
  );
};

export default Toolbar;
