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
        <div className="flex-1 flex items-center bg-gray-100 bg-opacity-50 rounded-sm overflow-hidden border border-b-gray-400">
          <input
            type="number"
            value={number}
            onChange={(e) => onChange(e.target.value, unit)}
            className="w-16 py-1 px-2 text-right bg-transparent focus:outline-none focus:border-indigo-500 transition-colors duration-200"
          />
          <div className="relative group">
            <select
              value={unit}
              onChange={(e) => onChange(number, e.target.value)}
              className="py-1 pl-2 pr-6 bg-transparent focus:outline-none text-gray-700 appearance-none cursor-pointer"
            >
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
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

  const renderSection = (title, type) => {
    const isExpanded = expandedSections[type];
    const value = type === 'gap' ? style.gap : style[`${type}Top`];
    
    return (
      <div className="mb-4">
        <div className="flex items-center p-2 rounded-md transition-colors duration-200">
          <button
            onClick={() => toggleSection(type)}
            className="mr-2 w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-colors duration-200 ${isExpanded ? 'text-blue-500' : 'text-gray-800'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              )}
            </svg>
          </button>
          <span className="text-sm font-bold text-gray-700 flex-grow mr-4">{title}</span>
          {renderInput(null, type, value, (newValue, newUnit) => handleMainInputChange(type, newValue, newUnit))}
        </div>
        {isExpanded && (
          <div className="mt-2 pl-6">
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
    <div className="control-container">
      <div className="control-section-header" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        <span className="control-section-title">Spacing</span>
      </div>
      
      {isExpanded && (
        <>
          {availableControls.includes('padding') && renderSection('Padding', 'padding')}
          {availableControls.includes('margin') && renderSection('Margin', 'margin')}
          {availableControls.includes('gap') && renderSection('Gap', 'gap')}
        </>
      )}
    </div>
  );
};

export default SpacingControls;