import React, { useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';
import { MdVerticalAlignTop, MdVerticalAlignCenter, MdVerticalAlignBottom } from 'react-icons/md';
import ColorPicker from '../../common/ColorPicker';

const FONT_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
  { value: '"Arial Black", Gadget, sans-serif', label: 'Arial Black' },
  { value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', label: 'Palatino' },
  { value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', label: 'Lucida Sans' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: '"Gill Sans", "Gill Sans MT", sans-serif', label: 'Gill Sans' },
  { value: 'Impact, Charcoal, sans-serif', label: 'Impact' },
  { value: '"Century Gothic", sans-serif', label: 'Century Gothic' },
];

const UNITS = ['px', '%', 'em', 'rem', 'pt'];

const BasicTextControls = ({ style, onStyleChange, label = "Text Styling", hideAlignment = false }) => {
  const [horizontalAlign, setHorizontalAlign] = useState(style.justifyContent || 'flex-start');
  const [verticalAlign, setVerticalAlign] = useState(style.alignItems || 'flex-start');

  const updateStyle = (updates) => {
    onStyleChange({ ...style, ...updates });
  };

  const handleFontStyleChange = (styleType) => {
    switch (styleType) {
      case 'bold':
        updateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' });
        break;
      case 'italic':
        updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' });
        break;
      case 'underline':
        updateStyle({ textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' });
        break;
      default:
        break;
    }
  };

  const handleAlignmentChange = (type, value) => {
    if (type === 'horizontal') {
      const justifyContent = value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center';
      setHorizontalAlign(value);
      updateStyle({ justifyContent, textAlign: value });
    } else if (type === 'vertical') {
      setVerticalAlign(value);
      updateStyle({ alignItems: value });
    }
  };

  const renderAlignmentButtons = (type, currentValue, options) => (
    <div className="flex space-x-2 mb-4">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => handleAlignmentChange(type, value)}
          className={`p-2 text-sm rounded-md transition-colors duration-200 border ${
            currentValue === value
              ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
              : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
          }`}
        >
          <Icon />
        </button>
      ))}
    </div>
  );

  const horizontalAlignOptions = [
    { value: 'left', icon: FaAlignLeft },
    { value: 'center', icon: FaAlignCenter },
    { value: 'right', icon: FaAlignRight },
  ];

  const verticalAlignOptions = [
    { value: 'flex-start', icon: MdVerticalAlignTop },
    { value: 'center', icon: MdVerticalAlignCenter },
    { value: 'flex-end', icon: MdVerticalAlignBottom },
  ];

  const renderInput = (value, onChange) => {
    const stringValue = String(value || '16px');
    const numericValue = parseFloat(stringValue) || 16;
    const unit = stringValue.replace(/[0-9.-]/g, '') || 'px';

    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex-grow flex">
          <input
            type="text"
            value={numericValue}
            onChange={(e) => onChange(`${e.target.value}${unit}`)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                const newValue = e.key === 'ArrowUp' ? numericValue + step : numericValue - step;
                onChange(`${newValue}${unit}`);
              }
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Font Size"
          />
          <select
            value={unit}
            onChange={(e) => onChange(`${numericValue}${e.target.value}`)}
            className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="basic-text-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{label}</h3>
      <div className="control-section-content">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
          <div className="flex space-x-2">
            {['bold', 'italic', 'underline'].map((styleType) => (
              <button
                key={styleType}
                onClick={() => handleFontStyleChange(styleType)}
                className={`p-2 text-sm rounded-md transition-colors duration-200 border ${
                  (styleType === 'bold' && style.fontWeight === 'bold') ||
                  (styleType === 'italic' && style.fontStyle === 'italic') ||
                  (styleType === 'underline' && style.textDecoration === 'underline')
                    ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                    : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
                }`}
              >
                {styleType === 'bold' && <FaBold />}
                {styleType === 'italic' && <FaItalic />}
                {styleType === 'underline' && <FaUnderline />}
              </button>
            ))}
          </div>
        </div>

        {!hideAlignment && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Horizontal Alignment</label>
              {renderAlignmentButtons('horizontal', horizontalAlign, horizontalAlignOptions)}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vertical Alignment</label>
              {renderAlignmentButtons('vertical', verticalAlign, verticalAlignOptions)}
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          {renderInput(style.fontSize, (value) => updateStyle({ fontSize: value }))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={style.fontFamily}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Color</label>
          <ColorPicker
            color={style.color}
            onChange={(color) => updateStyle({ color })}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTextControls;