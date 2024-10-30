import React from 'react';
import ColorPicker from '../../common/ColorPicker';

const CURSOR_OPTIONS = [
  { value: 'pointer', label: 'Pointer' },
  { value: 'default', label: 'Default' },
  { value: 'not-allowed', label: 'Not Allowed' },
  { value: 'wait', label: 'Wait' },
  { value: 'help', label: 'Help' },
];

const ButtonControls = ({ style, onStyleChange }) => {
  const handleChange = (updates) => {
    onStyleChange({
      ...style,
      ...updates
    });
  };

  const renderInput = (value, onChange, min, max, step) => {
    const numericValue = parseFloat(value) || 0;

    return (
      <div className="flex items-center justify-center w-full">
        <input
          type="number"
          value={numericValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hover Color
        </label>
        <ColorPicker
          color={style.hoverBackgroundColor || '#e6e6e6'}
          onChange={(color) => handleChange({ hoverBackgroundColor: color })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hover Text Color
        </label>
        <ColorPicker
          color={style.hoverColor || '#000000'}
          onChange={(color) => handleChange({ hoverColor: color })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hover Scale
        </label>
        {renderInput(
          style.hoverScale || 1,
          (value) => handleChange({ hoverScale: value }),
          0.8,
          1.2,
          0.01
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cursor Style
        </label>
        <select
          value={style.cursor || 'pointer'}
          onChange={(e) => handleChange({ cursor: e.target.value })}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {CURSOR_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transition Duration (ms)
        </label>
        {renderInput(
          parseInt(style.transitionDuration) || 200,
          (value) => handleChange({ 
            transitionDuration: value,
            transition: `all ${value}ms ease-in-out`
          }),
          0,
          1000,
          50
        )}
      </div>
    </div>
  );
};

export default ButtonControls;
