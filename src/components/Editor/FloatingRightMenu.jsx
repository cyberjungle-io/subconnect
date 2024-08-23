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
  isComponentPaletteVisible,
  isGlobalSettingsVisible,
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
      <button
        onClick={onShowComponentPalette}
        className={`p-2 mb-2 rounded-full ${isComponentPaletteVisible ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        title="Toggle Component Palette"
      >
        <FaPalette />
      </button>
      <button
        onClick={onShowGlobalSettings}
        className={`p-2 mb-2 rounded-full ${isGlobalSettingsVisible ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        title="Toggle Global Settings"
      >
        <FaCog />
      </button>
      <button onClick={onOpenDataModal} className="p-2 mb-2 rounded-full hover:bg-gray-100"><FaDatabase /></button>
      <button onClick={onToggleDragMode} className="p-2 mb-2 rounded-full hover:bg-gray-100"><FaArrowsAlt /></button>
      <button onClick={onToggleSpacingVisibility} className="p-2 mb-2 rounded-full hover:bg-gray-100"><FaEye /></button>
      <button onClick={onToggleVisibility} className="p-2 mb-2 rounded-full hover:bg-gray-100"><FaChevronLeft /></button>
    </div>
  );
};

export default FloatingRightMenu;