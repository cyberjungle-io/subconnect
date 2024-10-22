import React, { useState, useEffect, useCallback } from 'react';

const UNITS = ['px', '%', 'em', 'rem', 'vw', 'vh'];

const PRESETS = {
  'Square': { width: '200px', height: '200px' },
  'Banner': { width: '100%', height: '150px' },
};

const SizeControls = ({ style = {}, onStyleChange, componentType }) => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [activePreset, setActivePreset] = useState(null);
  const [activeFitOption, setActiveFitOption] = useState(null);
  const [minWidth, setMinWidth] = useState(style.minWidth || '');
  const [maxWidth, setMaxWidth] = useState(style.maxWidth || '');
  const [minHeight, setMinHeight] = useState(style.minHeight || '');
  const [maxHeight, setMaxHeight] = useState(style.maxHeight || '');

  useEffect(() => {
    if (style) {
      setWidth(style.width || '');
      setHeight(style.height || '');
      setMinWidth(style.minWidth || '');
      setMaxWidth(style.maxWidth || '');
      setMinHeight(style.minHeight || '');
      setMaxHeight(style.maxHeight || '');
    }
  }, [style]);

  const handleChange = useCallback((property, value) => {
    onStyleChange({ [property]: value });
  }, [onStyleChange]);

  const setDimension = useCallback((dimension, value) => {
    if (value === 'auto') {
      handleChange(dimension, 'auto');
      if (componentType === 'TEXT' && dimension === 'height') {
        handleChange('minHeight', style.height || 'auto');
      }
    } else {
      const numericValue = parseFloat(value);
      const unit = value.replace(/[0-9.-]/g, '') || 'px';
      if (!isNaN(numericValue)) {
        handleChange(dimension, `${numericValue}${unit}`);
        if (componentType === 'TEXT' && dimension === 'height') {
          handleChange('minHeight', `${numericValue}${unit}`);
        }
      }
    }
  }, [handleChange, componentType, style.height]);

  const setPercentage = useCallback((dimension, percentage) => {
    setDimension(dimension, `${percentage}%`);
    setActivePreset(null);
  }, [setDimension]);

  const handleKeyDown = useCallback((e, dimension, value) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const numericValue = parseFloat(value) || 0;
      const unit = value.replace(/[0-9.-]/g, '') || 'px';
      const step = e.shiftKey ? 10 : 1;
      const newValue = e.key === 'ArrowUp' ? numericValue + step : numericValue - step;
      setDimension(dimension, `${newValue}${unit}`);
    }
  }, [setDimension]);

  const handleFitContent = useCallback(() => {
    if (activeFitOption === 'content') {
      onStyleChange({
        width: width,
        height: height,
      });
      setActiveFitOption(null);
    } else {
      onStyleChange({
        width: 'fit-content',
        height: 'fit-content',
      });
      setActiveFitOption('content');
    }
    setActivePreset(null);
  }, [onStyleChange, activeFitOption, width, height]);

  const handleFitVertical = useCallback(() => {
    if (activeFitOption === 'vertical') {
      onStyleChange({
        height: height,
      });
      setActiveFitOption(null);
    } else {
      onStyleChange({
        height: 'fit-content',
      });
      setActiveFitOption('vertical');
    }
    setActivePreset(null);
  }, [onStyleChange, activeFitOption, height]);

  const handleFitHorizontal = useCallback(() => {
    if (activeFitOption === 'horizontal') {
      onStyleChange({
        width: width,
      });
      setActiveFitOption(null);
    } else {
      onStyleChange({
        width: 'fit-content',
      });
      setActiveFitOption('horizontal');
    }
    setActivePreset(null);
  }, [onStyleChange, activeFitOption, width]);

  const handleMinMaxChange = useCallback((property, value) => {
    onStyleChange({ [property]: value });
  }, [onStyleChange]);

  const renderFitButtons = () => (
    <div className="flex justify-center items-center mb-4">
      <div className="flex w-full space-x-2">
        <button
          onClick={handleFitContent}
          className={`flex-1 px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
            activeFitOption === 'content'
              ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
              : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
          }`}
        >
         Content
        </button>
        <button
          onClick={handleFitVertical}
          className={`flex-1 px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
            activeFitOption === 'vertical'
              ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
              : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
          }`}
        >
          Vertical
        </button>
        <button
          onClick={handleFitHorizontal}
          className={`flex-1 px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
            activeFitOption === 'horizontal'
              ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
              : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
          }`}
        >
           Horizontal
        </button>
      </div>
    </div>
  );

  const renderSizeButtons = (dimension) => (
    <div className="flex justify-center items-center mb-4">
      <div className="inline-flex space-x-2">
        {[25, 50, 75, 100].map((percentage) => (
          <button
            key={percentage}
            onClick={() => setPercentage(dimension, percentage)}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
              style[dimension] === `${percentage}%`
                ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
            }`}
          >
            {percentage}%
          </button>
        ))}
      </div>
    </div>
  );

  const renderPresetButtons = () => (
    <div className="flex justify-center items-center mb-4">
      <div className="flex w-full space-x-2">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            onClick={() => {
              handleChange('width', preset.width);
              handleChange('height', preset.height);
              setWidth(preset.width);
              setHeight(preset.height);
              setActivePreset(name);
              setActiveFitOption(null);
            }}
            className={`flex-1 px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
              activePreset === name
                ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderInput = (name, value, onChange) => {
    const stringValue = String(value || '');
    const numericValue = parseFloat(stringValue) || '';
    const unit = stringValue.replace(/[0-9.-]/g, '') || 'px';

    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex-grow flex">
          <input
            type="text"
            value={numericValue}
            onChange={(e) => onChange(`${e.target.value}${unit}`)}
            onKeyDown={(e) => handleKeyDown(e, name, `${numericValue}${unit}`)}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
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

  const renderMinMaxInputs = (dimension) => (
    <div className="flex space-x-2 mb-2">
      <div className="flex-1">
        <span className="text-xs font-medium text-gray-700 mb-1 block">Min {dimension}</span>
        {renderInput(`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`, 
          dimension === 'width' ? minWidth : minHeight, 
          (v) => handleMinMaxChange(`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`, v)
        )}
      </div>
      <div className="flex-1">
        <span className="text-xs font-medium text-gray-700 mb-1 block">Max {dimension}</span>
        {renderInput(`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`, 
          dimension === 'width' ? maxWidth : maxHeight, 
          (v) => handleMinMaxChange(`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`, v)
        )}
      </div>
    </div>
  );

  const renderSection = (title, name, value, onChange) => (
    <div className="mb-4">
      <span className="text-sm font-medium text-gray-700 mb-2 block">{title}</span>
      {renderSizeButtons(name)}
      <div className="flex items-center mb-2">
        {renderInput(name, value, onChange)}
      </div>
      {renderMinMaxInputs(name)}
    </div>
  );

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Size Controls</h3>
      <div className="control-section-content">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Presets</h4>
        {renderPresetButtons()}
        <h4 className="text-sm font-medium text-gray-700 mb-2">Fit</h4>
        {renderFitButtons()}
        {renderSection('Width', 'width', width, (v) => setDimension('width', v))}
        {renderSection('Height', 'height', height, (v) => setDimension('height', v))}
      </div>
    </div>
  );
};

export default SizeControls;
