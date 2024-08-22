import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SizeControls = ({ style = {}, onStyleChange }) => {
  const [widthUnit, setWidthUnit] = useState('px');
  const [heightUnit, setHeightUnit] = useState('px');
  const [activePreset, setActivePreset] = useState(null);

  useEffect(() => {
    if (style) {
      setWidthUnit(getUnitFromValue(style.width));
      setHeightUnit(getUnitFromValue(style.height));
    }
  }, [style]);

  console.log('SizeControls rendered', { style, onStyleChange });

  const getUnitFromValue = (value) => {
    if (typeof value !== 'string') return 'px';
    const unit = value.replace(/[0-9.-]/g, '');
    return unit || 'px';
  };

  const setDimension = (dimension, value, unit) => {
    if (value === 'auto') {
      onStyleChange({ [dimension]: 'auto' });
    } else {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        onStyleChange({ [dimension]: `${numericValue}${unit}` });
      }
    }
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

  const isActiveSize = (dimension, value, unit) => {
    return style[dimension] === `${value}${unit}`;
  };

  const renderSizeButtons = (dimension) => {
    return (
      <div className="flex justify-between mt-2 mb-4">
        {[25, 50, 75, 100].map((percentage) => (
          <button
            key={percentage}
            onClick={() => setPercentage(dimension, percentage)}
            className={`flex-1 px-2 py-1 text-xs font-bold rounded transition-colors duration-200 ${
              isActiveSize(dimension, percentage, '%')
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
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
      <div className="flex justify-between mt-2 mb-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => {
              onStyleChange({ width: preset.width, height: preset.height });
              setWidthUnit(getUnitFromValue(preset.width));
              setHeightUnit(getUnitFromValue(preset.height));
              setActivePreset(preset.label);
            }}
            className={`flex-1 px-2 py-1 text-xs font-bold rounded transition-colors duration-200 ${
              activePreset === preset.label
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    );
  };

  const renderInput = (name, value, unit, setUnit) => {
    const { number } = parseValue(value);
    const units = ['px', '%', 'em', 'rem'];
  
    return (
      <div className="flex items-center justify-center w-full" onClick={(e) => e.stopPropagation()}>
        <div className="properties-input-container flex-grow">
          <input
            type="number"
            value={number}
            onChange={(e) => setDimension(name, e.target.value, unit)}
            className="properties-input w-full text-right"
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
          />
          <div className="properties-select-wrapper">
            <select
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                setDimension(name, number, e.target.value);
              }}
              className="properties-select"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <div className="properties-select-arrow">
              <FaChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const parseValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return { number: '', unit: 'px' };
    }
    if (typeof value === 'number') {
      return { number: value.toString(), unit: 'px' };
    }
    if (typeof value === 'string') {
      const match = value.match(/^(\d*\.?\d+)(\D+)?$/);
      return match ? { number: match[1], unit: match[2] || 'px' } : { number: '', unit: 'px' };
    }
    return { number: '', unit: 'px' };
  };

  const renderSection = (title, name, value, unit, setUnit) => {
    return (
      <div className="mb-4">
        <span className="text-sm font-bold text-gray-700 mb-2 block">{title}</span>
        {renderSizeButtons(name)}
        <div className="flex items-center">
          {renderInput(name, value, unit, setUnit)}
        </div>
      </div>
    );
  };

  return (
    <div className="control-section">
      <div >
        <span>Sizing</span>
      </div>
      <div className="control-section-content">
        {renderPresetButtons()}
        {renderSection('Width', 'width', style.width, widthUnit, setWidthUnit)}
        {renderSection('Height', 'height', style.height, heightUnit, setHeightUnit)}
      </div>
    </div>
  );
};

export default SizeControls;