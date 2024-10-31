import React from 'react';
import ColorPicker from '../../common/ColorPicker';
import { useSelector } from 'react-redux';

const CURSOR_OPTIONS = [
  { value: 'pointer', label: 'Pointer' },
  { value: 'default', label: 'Default' },
  { value: 'move', label: 'Move' },
  { value: 'grab', label: 'Grab' },
  { value: 'grabbing', label: 'Grabbing' },
  { value: 'not-allowed', label: 'Not Allowed' },
  { value: 'wait', label: 'Wait' },
  { value: 'progress', label: 'Progress' },
  { value: 'help', label: 'Help' },
  { value: 'crosshair', label: 'Crosshair' },
  { value: 'text', label: 'Text' },
  { value: 'copy', label: 'Copy' },
  { value: 'cell', label: 'Cell' },
];

const ButtonControls = ({ style, onStyleChange }) => {
  // Get current project from Redux state
  const currentProject = useSelector(state => state.w3s.currentProject.data);

  const handleChange = (updates) => {
    onStyleChange({
      ...style,
      ...updates,
      enablePageNavigation: updates.enablePageNavigation !== undefined 
        ? updates.enablePageNavigation 
        : style.enablePageNavigation,
      targetPageId: updates.targetPageId !== undefined 
        ? updates.targetPageId 
        : style.targetPageId
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enable Page Navigation
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={style.enablePageNavigation || false}
            onChange={(e) => handleChange({ enablePageNavigation: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Enable routing on click</span>
        </div>
      </div>

      {style.enablePageNavigation && currentProject?.pages && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Page
          </label>
          <select
            value={style.targetPageId || ''}
            onChange={(e) => handleChange({ targetPageId: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a page</option>
            {currentProject.pages.map((page, index) => (
              <option key={page._id || index} value={page._id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ButtonControls;
