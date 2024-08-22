import React, { useState, useEffect } from 'react';

const BackgroundControls = ({ style, onStyleChange }) => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    if (style.backgroundColor) {
      setBackgroundColor(style.backgroundColor);
    }
  }, [style.backgroundColor]);

  const handleBackgroundChange = (color) => {
    setBackgroundColor(color);
    onStyleChange({ backgroundColor: color });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => handleBackgroundChange(e.target.value)}
            className="w-full h-8 p-0 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;