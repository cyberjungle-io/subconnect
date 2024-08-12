import React, { useState } from 'react';
import ColorPicker from '../../common/ColorPicker';
import ComponentControls from './ComponentControls';

const TextControls = ({ component, onUpdate }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate({
      props: {
        ...component.props,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const handleStyleChange = (styleUpdates) => {
    onUpdate({
      style: {
        ...component.style,
        ...styleUpdates
      }
    });
  };

  return (
    <div className="control-section">
      <div className="control-section-header">
        <span className="control-section-title">Text Controls</span>
      </div>
      <div className="control-section-content">
        <div className="mb-2">
          <label className="control-label">Content</label>
          <textarea
            name="content"
            value={component.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="control-input"
            rows="4"
          />
        </div>

        <div className="mb-2">
          <label className="control-label">Font Family</label>
          <select
            name="fontFamily"
            value={component.style.fontFamily || 'Arial'}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            className="control-select"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="control-label">Font Size</label>
          <input
            type="number"
            name="fontSize"
            value={parseInt(component.style.fontSize) || 16}
            onChange={(e) => handleStyleChange({ fontSize: `${e.target.value}px` })}
            className="control-input"
          />
        </div>

        <div className="mb-2">
          <label className="control-label">Color</label>
          <ColorPicker
            color={component.style.color || '#000000'}
            onChange={(color) => handleStyleChange({ color })}
          />
        </div>

        <ComponentControls
          style={component.style}
          onStyleChange={handleStyleChange}
        />
      </div>
    </div>
  );
};

export default TextControls;