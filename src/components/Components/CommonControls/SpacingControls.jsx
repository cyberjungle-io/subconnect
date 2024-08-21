import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SpacingControls = ({ style, onStyleChange, availableControls = ['padding', 'margin', 'gap'] }) => {
    const [isExpanded, setIsExpanded] = useState(true); 

  const units = ['px', '%', 'em', 'rem'];

  const presets = {
    padding: [
      { name: 'Small', value: '8px' },
      { name: 'Medium', value: '16px' },
      { name: 'Large', value: '24px' },
    ],
    margin: [
      { name: 'Small', value: '8px' },
      { name: 'Medium', value: '16px' },
      { name: 'Large', value: '24px' },
    ],
    gap: [
      { name: 'Small', value: '8px' },
      { name: 'Medium', value: '16px' },
      { name: 'Large', value: '24px' },
    ],
  };

  const parseValue = (value) => {
    if (!value) return { number: '', unit: 'px' };
    const match = value.match(/^(\d*\.?\d+)(\D+)?$/);
    return match ? { number: match[1], unit: match[2] || 'px' } : { number: '', unit: 'px' };
  };

  const handleMainInputChange = (type, value, unit) => {
    const newValue = value && unit ? `${value}${unit}` : '';
    if (type === 'padding' || type === 'margin') {
      const updates = {};
      ['Top', 'Right', 'Bottom', 'Left'].forEach(direction => {
        updates[`${type}${direction}`] = newValue;
      });
      onStyleChange({ target: { name: `${type}Bulk`, value: updates } });
    } else if (type === 'gap') {
      onStyleChange({ target: { name: 'gap', value: newValue } });
    }
  };

  const handleIndividualInputChange = (name, value, unit) => {
    const newValue = value && unit ? `${value}${unit}` : '';
    onStyleChange({ target: { name, value: newValue } });
  };

  const renderPresets = (type) => (
    <div className="flex justify-between mt-2 mb-4">
      {presets[type].map((preset) => (
        <button
          key={preset.name}
          onClick={() => handleMainInputChange(type, parseValue(preset.value).number, parseValue(preset.value).unit)}
          className="flex-1 px-2 py-1 text-xs font-bold rounded transition-colors duration-200 bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );

  const renderInput = (name, value, onChange) => {
    const { number, unit } = parseValue(value);
  
    return (
      <div className="flex items-center justify-center w-full">
        <div className="properties-input-container flex-grow">
          <input
            type="number"
            value={number}
            onChange={(e) => onChange(e.target.value, unit)}
            className="properties-input w-full text-right"
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
          />
          <div className="properties-select-wrapper">
            <select
              value={unit}
              onChange={(e) => onChange(number, e.target.value)}
              className="properties-select"
            >
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
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

  const renderSection = (title, type) => {
    return (
      <div className="mb-4">
        <span className="text-sm font-bold text-gray-700 mb-2 block">{title}</span>
        <div className="control-section-content">
          {renderPresets(type)}
          {type !== 'gap' ? (
            <div className="space-y-2">
              {['Top', 'Right', 'Bottom', 'Left'].map(direction => (
                <div key={direction} className="mb-4">
                  <span className="text-xs text-gray-600 mb-1 block">{direction}</span>
                  {renderInput(
                    `${type}${direction}`,
                    style[`${type}${direction}`],
                    (newValue, newUnit) => handleIndividualInputChange(`${type}${direction}`, newValue, newUnit)
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              {renderInput(
                'gap',
                style.gap,
                (newValue, newUnit) => handleMainInputChange('gap', newValue, newUnit)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="control-section">
      <div className="control-section-header" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        <span className="control-section-title">Spacing</span>
      </div>
      {isExpanded && (
        <div className="control-section-content">
          {availableControls.includes('padding') && renderSection('Padding', 'padding')}
          {availableControls.includes('margin') && renderSection('Margin', 'margin')}
          {availableControls.includes('gap') && renderSection('Gap', 'gap')}
        </div>
      )}
    </div>
  );
};

export default SpacingControls;