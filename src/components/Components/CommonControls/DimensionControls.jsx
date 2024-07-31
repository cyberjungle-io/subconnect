import React, { useState, useEffect } from 'react';
import { FaLink, FaUnlink, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const DimensionControls = ({ style, onStyleChange }) => {
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);
  const [widthUnit, setWidthUnit] = useState('px');
  const [heightUnit, setHeightUnit] = useState('px');
  const [activePreset, setActivePreset] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    width: true,
    height: true,
  });

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
              onStyleChange({ target: { name: 'width', value: preset.width } });
              onStyleChange({ target: { name: 'height', value: preset.height } });
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
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center bg-gray-100 bg-opacity-50 rounded-sm overflow-hidden border border-b-gray-400">
          <input
            type="number"
            value={number}
            onChange={(e) => setDimension(name, e.target.value, unit)}
            className="w-24 py-1.5 px-2 text-right bg-transparent focus:outline-none focus:border-indigo-500 transition-colors duration-200"
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
          />
          <div className="relative group">
            <select
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                setDimension(name, number, e.target.value);
              }}
              className="py-1 pl-2 pr-6 bg-transparent focus:outline-none text-gray-700 appearance-none cursor-pointer"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
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
    const isExpanded = expandedSections[name];
    return (
      <div className="mb-4">
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
          onClick={() => toggleSection(name)}
        >
          {isExpanded ? <FaChevronDown className="mr-2 text-gray-500" /> : <FaChevronRight className="mr-2 text-gray-500" />}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        {isExpanded && (
          <div className="mt-2">
            {renderSizeButtons(name)}
            {renderInput(name, value, unit, setUnit)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Dimensions</h3>
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

      {renderSection('Width', 'width', style.width, widthUnit, setWidthUnit)}
      {renderSection('Height', 'height', style.height, heightUnit, setHeightUnit)}
    </div>
  );
};

export default DimensionControls;