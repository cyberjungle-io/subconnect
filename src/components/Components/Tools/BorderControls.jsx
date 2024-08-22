import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const BorderControls = ({ style, onStyleChange }) => {
  const [borderWidth, setBorderWidth] = useState('0');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');

  useEffect(() => {
    if (style.border) {
      const [width, styleType, color] = style.border.split(' ');
      setBorderWidth(width.replace('px', ''));
      setBorderStyle(styleType);
      setBorderColor(color);
    }
  }, [style.border]);

  const handleBorderChange = () => {
    const newBorder = `${borderWidth}px ${borderStyle} ${borderColor}`;
    onStyleChange({ border: newBorder });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Border Width</label>
          <input
            type="number"
            min="0"
            value={borderWidth}
            onChange={(e) => {
              setBorderWidth(e.target.value);
              handleBorderChange();
            }}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Border Style</label>
          <select
            value={borderStyle}
            onChange={(e) => {
              setBorderStyle(e.target.value);
              handleBorderChange();
            }}
            className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => {
              setBorderColor(e.target.value);
              handleBorderChange();
            }}
            className="w-full h-8 p-0 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BorderControls;