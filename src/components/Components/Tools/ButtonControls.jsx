import React, { useState } from 'react';
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

  // Add state for hover controls visibility
  const [showHoverEffects, setShowHoverEffects] = useState(false);

  // Store previous hover states when toggling
  const [previousHoverState, setPreviousHoverState] = useState(null);

  const handleChange = (updates) => {
    console.log('ButtonControls handleChange called with:', updates);
    console.log('Current style:', style);
    
    let finalUpdates = { ...updates };

    // Handle page navigation toggle
    if ('enablePageNavigation' in updates) {
      console.log('Handling navigation toggle:', updates.enablePageNavigation);
      
      // Create a complete navigation update
      finalUpdates = {
        ...finalUpdates,
        enablePageNavigation: updates.enablePageNavigation,
        targetPageId: !updates.enablePageNavigation ? '' : (style.targetPageId || '')
      };
      
      console.log('Final updates before style change:', finalUpdates);
      
      // Apply the update directly to style
      onStyleChange({
        ...style,
        enablePageNavigation: finalUpdates.enablePageNavigation,
        targetPageId: finalUpdates.targetPageId
      });
      return;
    }

    onStyleChange({
      ...style,
      ...finalUpdates
    });
  };

  // Handle hover effects toggle
  const toggleHoverEffects = () => {
    const newShowHoverEffects = !showHoverEffects;
    setShowHoverEffects(newShowHoverEffects);

    if (!newShowHoverEffects) {
      // Store current hover states before disabling
      setPreviousHoverState({
        hoverBackgroundColor: style.hoverBackgroundColor,
        hoverColor: style.hoverColor,
        hoverScale: style.hoverScale,
        cursor: style.cursor,
        transitionDuration: style.transitionDuration,
        transition: style.transition
      });

      // Clear all hover effects
      onStyleChange({
        ...style,
        hoverBackgroundColor: undefined,
        hoverColor: undefined,
        hoverScale: undefined,
        cursor: 'default',
        transitionDuration: undefined,
        transition: undefined
      });
    } else if (previousHoverState) {
      // Restore previous hover states
      onStyleChange({
        ...style,
        ...previousHoverState
      });
    }
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

  // Add these button classes
  const activeButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-[#cce7ff] text-blue-700 border-blue-300";
  const inactiveButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]";

  return (
    <div className="space-y-4">
      {/* Control buttons at the top */}
      <div className="flex w-full space-x-2">
        <button
          onClick={() => {
            console.log('Navigation button clicked');
            console.log('Current enablePageNavigation:', style.enablePageNavigation);
            handleChange({ enablePageNavigation: !style.enablePageNavigation });
          }}
          className={style.enablePageNavigation ? activeButtonClass : inactiveButtonClass}
        >
          Page Navigation
        </button>
        <button
          onClick={toggleHoverEffects}
          className={showHoverEffects ? activeButtonClass : inactiveButtonClass}
        >
          Hover Effects
        </button>
      </div>

      {/* Page Navigation Section */}
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

      {/* Hover Effects Section */}
      {showHoverEffects && (
        <div className="pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hover Color
            </label>
            <ColorPicker
              color={style.hoverBackgroundColor || '#e6e6e6'}
              onChange={(color) => handleChange({ hoverBackgroundColor: color })}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hover Text Color
            </label>
            <ColorPicker
              color={style.hoverColor || '#000000'}
              onChange={(color) => handleChange({ hoverColor: color })}
            />
          </div>

          <div className="mt-4">
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

          <div className="mt-4">
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

          <div className="mt-4">
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
      )}
    </div>
  );
};

export default ButtonControls;
