import React, { useState, useEffect } from 'react';
import { FaTimes, FaExpand, FaArrowsAlt, FaPalette } from 'react-icons/fa';
import SpacingControls from '../Components/Tools/SpacingControls';
import BackgroundControls from '../Components/Tools/BackgroundControls';

const FloatingGlobalSettings = ({ initialPosition, onClose, globalSettings, onUpdateGlobalSettings }) => {
  // Add a default value for globalSettings
  const safeGlobalSettings = globalSettings || {
    backgroundColor: '#ffffff',
    componentLayout: 'vertical',
    style: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      gap: '0px'
    }
  };

  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeControl, setActiveControl] = useState('Layout');

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleIconClick = (control) => {
    setActiveControl(activeControl === control ? null : control);
  };

  const renderActiveControl = () => {
    const sharedProps = {
      style: safeGlobalSettings.style,
      onStyleChange: (updates) => onUpdateGlobalSettings({ style: { ...safeGlobalSettings.style, ...updates } }),
    };

    switch (activeControl) {
      case 'Layout':
        return (
          <div>
            <h3 className="text-sm font-semibold mb-2">Global Settings</h3>
            <div className="control-container">
              <label htmlFor="globalBorderRadius" className="control-label">Default Border Radius</label>
              <div className="properties-input-container">
                <input
                  id="globalBorderRadius"
                  type="number"
                  className="properties-input"
                  value={(safeGlobalSettings.generalComponentStyle?.borderRadius || '4px').replace('px', '')}
                  onChange={(e) => onUpdateGlobalSettings({
                    generalComponentStyle: {
                      ...safeGlobalSettings.generalComponentStyle,
                      borderRadius: `${e.target.value}px`
                    }
                  })}
                />
                <div className="properties-select-wrapper">
                  <select className="properties-select" value="px" readOnly>
                    <option value="px">px</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Spacing':
        return <SpacingControls {...sharedProps} />;
      case 'Background':
        return <BackgroundControls {...sharedProps} />;
      default:
        return null;
    }
  };

  const buttonClass = (isActive) => `
    p-2 rounded-full
    ${isActive 
      ? 'bg-[#cce7ff] text-blue-600 border border-blue-300' 
      : 'hover:bg-[#d9ecff] border border-transparent'
    }
  `;

  return (
    <div
      className="fixed z-[940] bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl w-64 max-h-[80vh] overflow-hidden flex flex-col group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="h-6 cursor-move bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onMouseDown={handleMouseDown}
      />
      <div className="px-4 pt-1 pb-3">
        <div
          className="flex justify-between items-center mb-3"
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-lg font-semibold text-gray-700">Global Settings</h3>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
            <FaTimes />
          </button>
        </div>
        <div className="flex mb-2 space-x-2">
          {[
            { icon: FaExpand, tooltip: 'Layout' },
            { icon: FaArrowsAlt, tooltip: 'Spacing' },
            { icon: FaPalette, tooltip: 'Background' },
          ].map((iconData, index) => (
            <button
              key={index}
              className={buttonClass(activeControl === iconData.tooltip)}
              title={iconData.tooltip}
              onClick={() => handleIconClick(iconData.tooltip)}
            >
              <iconData.icon />
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-[#cce0ff] flex-grow overflow-y-auto">
        <div className="p-4">
          {renderActiveControl()}
        </div>
      </div>
    </div>
  );
};

export default FloatingGlobalSettings;