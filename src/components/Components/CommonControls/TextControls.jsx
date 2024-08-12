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
    <div className="text-controls space-y-4">
      <div className="control-container">
        <label className="control-label">Content</label>
        <textarea
          name="content"
          value={component.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="control-input"
          rows="4"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Font Family</label>
          <select
            name="fontFamily"
            value={component.style.fontFamily || 'Arial'}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Font Size</label>
          <input
            type="number"
            name="fontSize"
            value={parseInt(component.style.fontSize) || 16}
            onChange={(e) => handleStyleChange({ fontSize: `${e.target.value}px` })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <ColorPicker
            color={component.style.color || '#000000'}
            onChange={(color) => handleStyleChange({ color })}
          />
        </div>
      </div>

      <ComponentControls
        style={component.style}
        onStyleChange={handleStyleChange}
      />
    </div>
  );
};

export default TextControls;