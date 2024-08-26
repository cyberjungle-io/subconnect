import React, { useState } from 'react';
import { FaTree, FaGlobe, FaEye, FaHandPointer, FaChevronLeft } from 'react-icons/fa';
import HidePropertiesPanelArrow from '../common/CustomIcons/HidePropertiesPanelArrow';

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
  onToggleVisibility,
  isComponentTreeVisible,
  isComponentPaletteVisible,
  isGlobalSettingsVisible,
  isDragModeEnabled,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed right-0 top-1/3 transform -translate-y-1/2 bg-[#e6f3ff] border border-[#b3d9ff] rounded-l-lg shadow-xl z-[960] p-2"
        title="Show Menu"
      >
        <FaChevronLeft />
      </button>
    );
  }

  const buttonClass = (isActive) => `
    p-2 mb-2 rounded-full
    ${isActive 
      ? 'bg-[#cce7ff] text-blue-600 border border-blue-300' 
      : 'hover:bg-[#d9ecff] border border-transparent'
    }
  `;

  return (
    <div className="fixed right-8 top-1/3 transform -translate-y-1/2 w-12 bg-[#e6f3ff] border border-[#b3d9ff] rounded-lg shadow-xl z-[960] flex flex-col items-center py-2">
      <button
        onClick={onShowComponentPalette}
        className={buttonClass(isComponentPaletteVisible)}
        title="Toggle Component Palette"
      >
        <FourSquaresIcon />
      </button>
      <button
        onClick={onShowComponentTree}
        className={buttonClass(isComponentTreeVisible)}
        title="Toggle Component Tree"
      >
        <FaTree />
      </button>
      <button
        onClick={onShowGlobalSettings}
        className={buttonClass(isGlobalSettingsVisible)}
        title="Toggle Global Settings"
      >
        <FaGlobe />
      </button>
      <button
        onClick={onToggleDragMode}
        className={buttonClass(isDragModeEnabled)}
        title="Toggle Drag Mode"
      >
        <FaHandPointer />
      </button>
      <button onClick={onToggleSpacingVisibility} className={buttonClass(false)} title="Toggle Spacing Visibility"><FaEye /></button>
      <button onClick={toggleVisibility} className={buttonClass(false)} title="Hide Menu">
        <HidePropertiesPanelArrow className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingRightMenu;