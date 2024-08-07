import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';

const ComponentControls = ({ style, onStyleChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onStyleChange({ [name]: value });
  };

  const handleColorChange = (color, property) => {
    onStyleChange({ [property]: color });
  };

  return (
    <div className="component-controls mt-4">
      
      {isExpanded && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <ColorPicker
              color={style.backgroundColor || '#ffffff'}
              onChange={(color) => handleColorChange(color, 'backgroundColor')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Border Color</label>
            <ColorPicker
              color={style.borderColor || '#000000'}
              onChange={(color) => handleColorChange(color, 'borderColor')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Border Width (px)</label>
            <input
              type="number"
              name="borderWidth"
              value={parseInt(style.borderWidth) || 0}
              onChange={(e) => onStyleChange({ borderWidth: `${e.target.value}px` })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
            <input
              type="number"
              name="borderRadius"
              value={parseInt(style.borderRadius) || 0}
              onChange={(e) => onStyleChange({ borderRadius: `${e.target.value}px` })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Border Style</label>
            <select
              name="borderStyle"
              value={style.borderStyle || 'none'}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Box Shadow</label>
            <input
              type="text"
              name="boxShadow"
              value={style.boxShadow || ''}
              onChange={handleChange}
              placeholder="e.g., 2px 2px 4px #000000"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentControls;