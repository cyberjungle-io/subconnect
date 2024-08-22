import React, { useState, useEffect } from 'react';
import ColorPicker from '../../common/ColorPicker';
import { FaChevronDown } from 'react-icons/fa';

const TextControls = ({ style, onStyleChange }) => {
  const [content, setContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16');
  const [fontColor, setFontColor] = useState('#000000');

  useEffect(() => {
    if (style) {
      setFontFamily(style.fontFamily || 'Arial');
      setFontSize(style.fontSize ? style.fontSize.replace('px', '') : '16');
      setFontColor(style.color || '#000000');
    }
  }, [style]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    onStyleChange({ content: e.target.value });
  };

  const handleFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
    onStyleChange({ fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
    onStyleChange({ fontSize: `${e.target.value}px` });
  };

  const handleColorChange = (color) => {
    setFontColor(color);
    onStyleChange({ color });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
          <div className="relative">
            <select
              value={fontFamily}
              onChange={handleFontFamilyChange}
              className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-8"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
          <input
            type="number"
            min="1"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Font Color</label>
          <ColorPicker
            color={fontColor}
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TextControls;