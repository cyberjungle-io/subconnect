import React, { useState, useEffect } from 'react';
import ColorPicker from '../../common/ColorPicker';

const WhiteboardControls = ({ style, onStyleChange }) => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('300px');
  const [showGrid, setShowGrid] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    if (style) {
      setBackgroundColor(style.backgroundColor || '#ffffff');
      setWidth(style.width || '100%');
      setHeight(style.height || '300px');
      setShowGrid(style.showGrid || false);
      setStrokeColor(style.strokeColor || '#000000');
      setStrokeWidth(style.strokeWidth || 2);
    }
  }, [style]);

  const handleChange = (property, value) => {
    onStyleChange({ [property]: value });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
          <ColorPicker
            color={backgroundColor}
            onChange={(color) => handleChange('backgroundColor', color)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
          <input
            type="text"
            value={width}
            onChange={(e) => handleChange('width', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
          <input
            type="text"
            value={height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => handleChange('showGrid', e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs font-medium text-gray-700">Show Grid</span>
          </label>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Default Stroke Color</label>
          <ColorPicker
            color={strokeColor}
            onChange={(color) => handleChange('strokeColor', color)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Default Stroke Width</label>
          <input
            type="number"
            value={strokeWidth}
            onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            min="1"
            max="20"
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardControls;