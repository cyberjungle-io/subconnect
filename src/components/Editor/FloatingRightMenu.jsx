import React from 'react';
import { FaTree, FaPalette, FaCog, FaDatabase, FaArrowsAlt, FaEye, FaChevronLeft } from 'react-icons/fa';

const FloatingRightMenu = ({
  onShowComponentTree,
  onShowComponentPalette,
  onShowGlobalSettings,
  onOpenDataModal,
  onToggleDragMode,
  onToggleSpacingVisibility,
  onToggleVisibility,
  isComponentTreeVisible,
}) => {
  return (
    <div className="fixed right-5 top-1/2 transform -translate-y-1/2 w-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col items-center py-2">
      <button
        onClick={onShowComponentTree}
        className={`p-2 mb-2 rounded-full ${isComponentTreeVisible ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        title="Toggle Component Tree"
      >
        <FaTree />
      </button>
      <button onClick={onShowComponentPalette} style={buttonStyle}><FaPalette /></button>
      <button onClick={onShowGlobalSettings} style={buttonStyle}><FaCog /></button>
      <button onClick={onOpenDataModal} style={buttonStyle}><FaDatabase /></button>
      <button onClick={onToggleDragMode} style={buttonStyle}><FaArrowsAlt /></button>
      <button onClick={onToggleSpacingVisibility} style={buttonStyle}><FaEye /></button>
      <button onClick={onToggleVisibility} style={buttonStyle}><FaChevronLeft /></button>
    </div>
  );
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '10px',
  fontSize: '18px',
  color: '#333',
  marginBottom: '10px',
};

export default FloatingRightMenu;