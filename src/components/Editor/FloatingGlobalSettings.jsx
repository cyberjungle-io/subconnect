import React, { useState, useEffect } from 'react';
import { FaTimes, FaExpand, FaArrowsAlt, FaPalette } from 'react-icons/fa';
import SpacingControls from '../Components/Tools/SpacingControls';
import BackgroundControls from '../Components/Tools/BackgroundControls';

const FloatingGlobalSettings = ({ initialPosition, onClose, globalSettings, onUpdateGlobalSettings }) => {
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
      style: globalSettings.style,
      onStyleChange: (updates) => onUpdateGlobalSettings({ style: { ...globalSettings.style, ...updates } }),
    };

    switch (activeControl) {
      case 'Layout':
        return (
          <div>
            <h3>Global Settings</h3>
            <div className="control-container">
              <label htmlFor="globalBorderRadius">Default Border Radius</label>
              <div className="properties-input-container">
                <input
                  id="globalBorderRadius"
                  type="number"
                  className="properties-input"
                  value={(globalSettings.generalComponentStyle?.borderRadius || '4px').replace('px', '')}
                  onChange={(e) => onUpdateGlobalSettings({
                    generalComponentStyle: {
                      ...globalSettings.generalComponentStyle,
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

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '250px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 950,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '20px',
          backgroundColor: '#f0f0f0',
          cursor: 'move',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5px',
        }}
        onMouseDown={handleMouseDown}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Global Settings</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <FaTimes />
        </button>
      </div>
      <div style={{ display: 'flex', padding: '5px', flexWrap: 'wrap' }}>
        {[
          { icon: FaExpand, tooltip: 'Layout' },
          { icon: FaArrowsAlt, tooltip: 'Spacing' },
          { icon: FaPalette, tooltip: 'Background' },
        ].map((iconData, index) => (
          <button
            key={index}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              fontSize: '18px',
              color: activeControl === iconData.tooltip ? '#007bff' : '#333',
            }}
            title={iconData.tooltip}
            onClick={() => handleIconClick(iconData.tooltip)}
          >
            <iconData.icon />
          </button>
        ))}
      </div>
      <div style={{ padding: '10px', flexGrow: 1, overflowY: 'auto' }}>
        {renderActiveControl()}
      </div>
    </div>
  );
};

export default FloatingGlobalSettings;