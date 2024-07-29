import React from 'react';
import { FaThLarge, FaCog, FaTree } from 'react-icons/fa';
import HidePropertiesPanelArrow from '../common/CustomIcons/HidePropertiesPanelArrow';

const PanelNavBar = ({ 
  onShowComponentPalette, 
  onShowGlobalSettings, 
  onShowComponentTree,
  onToggleVisibility,
  activePanel,
  isComponentTreeVisible
}) => {
  const getButtonClass = (panelName) => {
    return `text-gray-700 hover:bg-gray-300 p-2 rounded-full focus:outline-none transition-colors duration-200 ${
      activePanel === panelName || (panelName === 'componentTree' && isComponentTreeVisible) ? 'bg-gray-300' : ''
    }`;
  };

  return (
    <div className="flex justify-end space-x-2 mb-4">
      <button
        onClick={onShowComponentPalette}
        className={getButtonClass('componentPalette')}
        title="Show Component Palette"
      >
        <FaThLarge />
      </button>
      <button
        onClick={onShowGlobalSettings}
        className={getButtonClass('globalSettings')}
        title="Show Global Settings"
      >
        <FaCog />
      </button>
      <button
        onClick={onShowComponentTree}
        className={getButtonClass('componentTree')}
        title="Toggle Component Tree"
      >
        <FaTree />
      </button>
      <button
        onClick={onToggleVisibility}
        className="text-gray-700 hover:bg-gray-300 p-2 rounded-full focus:outline-none transition-colors duration-200"
        title="Hide Panel"
      >
        <HidePropertiesPanelArrow className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PanelNavBar;