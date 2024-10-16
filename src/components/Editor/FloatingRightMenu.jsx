import React from 'react';
import { FaTree, FaGlobe, FaEye, FaHandPointer, FaPaintBrush, FaPalette } from 'react-icons/fa';
import FourSquaresIcon from '../common/CustomIcons/FourSquareIcon';

const FloatingRightMenu = ({
  onShowComponentTree,
  onShowComponentPalette,
  onShowGlobalSettings,
  onToggleDragMode,
  isComponentTreeVisible,
  isComponentPaletteVisible,
  isGlobalSettingsVisible,
  isDragModeEnabled,
  isEditMode,
  onShowCanvasSettings,
  isCanvasSettingsVisible,
  onShowToolbarSettings,
  isToolbarSettingsVisible,
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
    <div className="fixed right-2 top-1/2 transform -translate-y-1/2 w-10 bg-[#e6f3ff] border border-[#b3d9ff] rounded-lg shadow-xl z-[960] flex flex-col items-center py-2 scale-90">
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
        onClick={isEditMode ? onShowCanvasSettings : undefined}
        className={buttonClass(isCanvasSettingsVisible)}
        title="Toggle Canvas Settings"
        disabled={!isEditMode}
      >
        <FaPaintBrush />
      </button>
      <button
        onClick={isEditMode ? onShowToolbarSettings : undefined}
        className={buttonClass(isToolbarSettingsVisible)}
        title="Toggle Toolbar Settings"
        disabled={!isEditMode}
      >
        <FaPalette />
      </button>
    </div>
  );
};

export default FloatingRightMenu;
