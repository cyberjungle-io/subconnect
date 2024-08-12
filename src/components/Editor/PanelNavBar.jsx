import React from 'react';
import { FaThLarge, FaCog, FaTree, FaDatabase, FaProjectDiagram } from 'react-icons/fa';

const PanelNavBar = ({ 
  onShowComponentPalette, 
  onShowGlobalSettings, 
  onShowComponentTree,
  onOpenDataModal,
  onOpenProjectModal,
  activePanel,
  isComponentTreeVisible
}) => {
  const getButtonClass = (panelName) => {
    return `flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-300 rounded-full focus:outline-none transition-colors duration-200 ${
      activePanel === panelName || (panelName === 'componentTree' && isComponentTreeVisible) ? 'bg-gray-300' : ''
    }`;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mb-4">
      <button
        onClick={onShowComponentPalette}
        className={getButtonClass('componentPalette')}
        title="Show Component Palette"
      >
        <FaThLarge />
      </button>
      <button
        onClick={onOpenDataModal}
        className={getButtonClass('dataModal')}
        title="Open Data Modal"
      >
        <FaDatabase />
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
        onClick={onOpenProjectModal}
        className={getButtonClass('projectModal')}
        title="Open Projects"
      >
        <FaProjectDiagram />
      </button>
    </div>
  );
};

export default PanelNavBar;