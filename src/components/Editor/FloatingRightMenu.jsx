import React from 'react';
import { FaTree, FaGlobe, FaEye, FaHandPointer, FaPaintBrush } from 'react-icons/fa';

// Add this new custom icon component
const FourSquaresIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zm0 11h-7v7h7v-7z" />
  </svg>
);

const FloatingRightMenu = ({
  onShowComponentTree,
  onShowComponentPalette,
  onShowGlobalSettings,
  onToggleDragMode,
  onToggleSpacingVisibility,
  isComponentTreeVisible,
  isComponentPaletteVisible,
  isGlobalSettingsVisible,
  isDragModeEnabled,
  isEditMode, // Add this prop
  onShowCanvasSettings,
  isCanvasSettingsVisible,
}) => {
  const buttonClass = (isActive) => `
    p-2 mb-2 rounded-full
    ${isActive 
      ? 'bg-[#cce7ff] text-blue-600 border border-blue-300' 
      : 'hover:bg-[#d9ecff] border border-transparent'
    }
    ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className="fixed right-8 top-1/3 transform -translate-y-1/2 w-12 bg-[#e6f3ff] border border-[#b3d9ff] rounded-lg shadow-xl z-[960] flex flex-col items-center py-2">
      <button
        onClick={isEditMode ? onShowComponentPalette : undefined}
        className={buttonClass(isComponentPaletteVisible)}
        title="Toggle Component Palette"
        disabled={!isEditMode}
      >
        <FourSquaresIcon />
      </button>
      <button
        onClick={isEditMode ? onShowComponentTree : undefined}
        className={buttonClass(isComponentTreeVisible)}
        title="Toggle Component Tree"
        disabled={!isEditMode}
      >
        <FaTree />
      </button>
      <button
        onClick={isEditMode ? onShowGlobalSettings : undefined}
        className={buttonClass(isGlobalSettingsVisible)}
        title="Toggle Global Settings"
        disabled={!isEditMode}
      >
        <FaGlobe />
      </button>
      <button
        onClick={isEditMode ? onToggleDragMode : undefined}
        className={buttonClass(isDragModeEnabled)}
        title="Toggle Drag Mode"
        disabled={!isEditMode}
      >
        <FaHandPointer />
      </button>
      <button 
        onClick={isEditMode ? onToggleSpacingVisibility : undefined} 
        className={buttonClass(false)} 
        title="Toggle Spacing Visibility"
        disabled={!isEditMode}
      >
        <FaEye />
      </button>
      <button
        onClick={isEditMode ? onShowCanvasSettings : undefined}
        className={buttonClass(isCanvasSettingsVisible)}
        title="Toggle Canvas Settings"
        disabled={!isEditMode}
      >
        <FaPaintBrush />
      </button>
    </div>
  );
};

export default FloatingRightMenu;