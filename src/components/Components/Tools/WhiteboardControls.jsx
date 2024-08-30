import React, { useState, useEffect } from 'react';
import ColorPicker from '../../common/ColorPicker';

const WhiteboardControls = ({ style, onStyleChange }) => {
  const [showGrid, setShowGrid] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    if (style) {
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
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Whiteboard Controls</h3>
      <div className="control-section-content">
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => handleChange('showGrid', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Show Grid</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Stroke Color</label>
          <ColorPicker
            color={strokeColor}
            onChange={(color) => handleChange('strokeColor', color)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Stroke Width</label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{strokeWidth}px</span>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardControls;