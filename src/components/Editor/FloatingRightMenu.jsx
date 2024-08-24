import React from 'react';
import { FaTree, FaPalette, FaCog, FaDatabase, FaEye, FaChevronLeft, FaHandPointer } from 'react-icons/fa';

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
  isDragModeEnabled,
}) => {
  return (
    <div className="fixed right-8 top-1/3 transform -translate-y-1/2 w-12 bg-gray-100  border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col items-center py-2">
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
      <button
        onClick={onToggleDragMode}
        className={`p-2 mb-2 rounded-full ${isDragModeEnabled ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        title="Toggle Drag Mode"
      >
        <FaHandPointer />
      </button>
      <button onClick={onToggleSpacingVisibility} className="p-2 mb-2 rounded-full hover:bg-gray-100"><FaEye /></button>
      <button onClick={onToggleVisibility} className="p-2 mb-2 rounded-full hover:bg-gray-100"><FaChevronLeft /></button>
    </div>
  );
};

export default FloatingRightMenu;