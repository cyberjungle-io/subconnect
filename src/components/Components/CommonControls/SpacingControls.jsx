import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SpacingControls = ({ style, onStyleChange, availableControls = ['padding', 'margin', 'gap'] }) => {
    const [isExpanded, setIsExpanded] = useState(true); 
    const [expandedSections, setExpandedSections] = useState({
    padding: false,
    margin: false,
    gap: false
  });

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  const renderInput = (label, name, value, onChange) => {
    const { number, unit } = parseValue(value);
  
    return (
      <div className="flex items-center py-2">
        {label && <span className="text-sm text-gray-600 w-16">{label}</span>}
        <div className="properties-input-container flex-grow">
          <input
            type="number"
            value={number}
            onChange={(e) => onChange(e.target.value, unit)}
            className="properties-input w-full text-right"
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
    const isExpanded = expandedSections[type];
    const value = type === 'gap' ? style.gap : style[`${type}Top`];
    
    return (
      <div className="control-section">
        <div className="control-section-header" onClick={() => toggleSection(type)}>
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          <span className="control-section-title">{title}</span>
        </div>
        {isExpanded && (
          <div className="control-section-content">
            {renderPresets(type)}
            {type !== 'gap' && (
              <div className="space-y-2">
                {['Top', 'Right', 'Bottom', 'Left'].map(direction => (
                  renderInput(
                    direction,
                    `${type}${direction}`,
                    style[`${type}${direction}`],
                    (newValue, newUnit) => handleIndividualInputChange(`${type}${direction}`, newValue, newUnit)
                  )
                ))}
              </div>
            )}
          </div>
        )}
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