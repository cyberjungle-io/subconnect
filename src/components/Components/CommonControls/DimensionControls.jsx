import React, { useState, useEffect } from 'react';
import { FaLink, FaUnlink } from 'react-icons/fa';

const DimensionControls = ({ style, onStyleChange }) => {
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);
  const [widthUnit, setWidthUnit] = useState('px');
  const [heightUnit, setHeightUnit] = useState('px');
  const [activePreset, setActivePreset] = useState(null);

  useEffect(() => {
    if (style.width && style.height) {
      const widthValue = parseFloat(style.width);
      const heightValue = parseFloat(style.height);
      if (!isNaN(widthValue) && !isNaN(heightValue) && heightValue !== 0) {
        setAspectRatio(widthValue / heightValue);
      }
    }
    setWidthUnit(getUnitFromValue(style.width));
    setHeightUnit(getUnitFromValue(style.height));
  }, [style.width, style.height]);

  const getUnitFromValue = (value) => {
    if (typeof value !== 'string') return 'px';
    const unit = value.replace(/[0-9.-]/g, '');
    return unit || 'px';
  };

  const getValueWithoutUnit = (value) => {
    if (typeof value !== 'string') return value;
    if (value === 'auto') return 'auto';
    return parseFloat(value) || 0;
  };

  const setDimension = (dimension, value, unit) => {
    if (value === 'auto') {
      onStyleChange({ target: { name: dimension, value: 'auto' } });
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    const newValue = `${numericValue}${unit}`;
    onStyleChange({ target: { name: dimension, value: newValue } });

    if (isAspectRatioLocked && aspectRatio) {
      if (dimension === 'width') {
        const newHeight = numericValue / aspectRatio;
        onStyleChange({ target: { name: 'height', value: `${newHeight}${heightUnit}` } });
      } else {
        const newWidth = numericValue * aspectRatio;
        onStyleChange({ target: { name: 'width', value: `${newWidth}${widthUnit}` } });
      }
    }

    setActivePreset(null);
  };

  const setPercentage = (dimension, percentage) => {
    setDimension(dimension, percentage, '%');
    if (dimension === 'width') {
      setWidthUnit('%');
    } else {
      setHeightUnit('%');
    }
    setActivePreset(null);
  };

  const toggleAspectRatioLock = () => {
    setIsAspectRatioLocked(!isAspectRatioLocked);
  };

  const isActiveSize = (dimension, value, unit) => {
    return style[dimension] === `${value}${unit}`;
  };

  const renderSizeButtons = (dimension) => {
    return (
      <div className="flex space-x-2 mb-2">
        {[25, 50, 75, 100].map((percentage) => (
          <button
            key={percentage}
            onClick={() => setPercentage(dimension, percentage)}
            className={`px-2 py-1 text-sm rounded ${
              isActiveSize(dimension, percentage, '%')
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {percentage}%
          </button>
        ))}
      </div>
    );
  };

  const renderPresetButtons = () => {
    const presets = [
      { label: 'Square', width: '200px', height: '200px' },
      { label: 'Banner', width: '100%', height: '150px' },
    ];

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => {
              onStyleChange({ target: { name: 'width', value: preset.width } });
              onStyleChange({ target: { name: 'height', value: preset.height } });
              setWidthUnit(getUnitFromValue(preset.width));
              setHeightUnit(getUnitFromValue(preset.height));
              setActivePreset(preset.label);
            }}
            className={`px-2 py-1 text-sm rounded ${
              activePreset === preset.label
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    );
  };

  const renderUnitButtons = (dimension, currentUnit, setUnit) => {
    const units = ['px', '%', 'em', 'rem'];
    return (
      <div className="flex">
        {units.map((unit) => (
          <button
            key={unit}
            onClick={() => {
              setUnit(unit);
              const value = getValueWithoutUnit(style[dimension]);
              if (value !== 'auto') {
                setDimension(dimension, value, unit);
              }
            }}
            className={`px-2 py-1 text-sm rounded-r ${
              currentUnit === unit
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {unit}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Dimensions</span>
        <button
          onClick={toggleAspectRatioLock}
          className={`p-1 rounded ${
            isAspectRatioLocked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          title={isAspectRatioLocked ? "Unlock aspect ratio" : "Lock aspect ratio"}
        >
          {isAspectRatioLocked ? <FaLink /> : <FaUnlink />}
        </button>
      </div>

      {renderPresetButtons()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Width
        </label>
        {renderSizeButtons('width')}
        <div className="flex">
          <input
            type="text"
            value={getValueWithoutUnit(style.width)}
            onChange={(e) => setDimension('width', e.target.value, widthUnit)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {renderUnitButtons('width', widthUnit, setWidthUnit)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height
        </label>
        {renderSizeButtons('height')}
        <div className="flex">
          <input
            type="text"
            value={getValueWithoutUnit(style.height)}
            onChange={(e) => setDimension('height', e.target.value, heightUnit)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {renderUnitButtons('height', heightUnit, setHeightUnit)}
        </div>
      </div>
    </div>
  );
};

export default DimensionControls;