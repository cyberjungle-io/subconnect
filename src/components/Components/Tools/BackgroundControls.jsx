import React, { useState, useEffect } from 'react';
import ColorPicker from '../../common/ColorPicker';

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
          <ColorPicker
            color={backgroundColor}
            onChange={handleBackgroundChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;