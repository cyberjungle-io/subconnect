import React, { useState } from 'react';
import { FaLink, FaUnlink, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import SpacingPreview from './SpacingPreview';

const SpacingControls = ({ style, onStyleChange, availableControls = ['padding', 'margin', 'gap'] }) => {
  const [linkedPadding, setLinkedPadding] = useState(true);
  const [linkedMargin, setLinkedMargin] = useState(true);
  const [activeUnit, setActiveUnit] = useState('px');
  const [expandedSections, setExpandedSections] = useState({
    padding: true,
    margin: true,
    gap: true
  });
  const [activePresets, setActivePresets] = useState({
    padding: null,
    margin: null,
    gap: null
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

  const handleInputChange = (name, numberValue, unit) => {
    const newValue = numberValue && unit ? `${numberValue}${unit}` : '';
    if (linkedPadding && name.startsWith('padding')) {
      const updates = {};
      ['Top', 'Right', 'Bottom', 'Left'].forEach(direction => {
        updates[`padding${direction}`] = newValue;
      });
      onStyleChange({ target: { name: 'paddingBulk', value: updates } });
    } else if (linkedMargin && name.startsWith('margin')) {
      const updates = {};
      ['Top', 'Right', 'Bottom', 'Left'].forEach(direction => {
        updates[`margin${direction}`] = newValue;
      });
      onStyleChange({ target: { name: 'marginBulk', value: updates } });
    } else {
      onStyleChange({ target: { name, value: newValue } });
    }
  };

  const applyPreset = (type, preset) => {
    const newValue = activePresets[type] === preset.name ? '0px' : preset.value;
    setActivePresets(prev => ({ ...prev, [type]: newValue === '0px' ? null : preset.name }));

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
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const renderPresets = (type) => (
    <div className="flex justify-between mt-2 mb-4">
      {presets[type].map((preset) => (
        <button
          key={preset.name}
          onClick={() => applyPreset(type, preset)}
          className={`flex-1 px-2 py-1 text-xs font-bold rounded transition-colors duration-200 ${
            activePresets[type] === preset.name
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );

  const renderInput = (label, name, value, depth = 0) => {
    const { number, unit } = parseValue(value);
  
    return (
      <div className={`flex items-center py-2 ${depth > 0 ? 'ml-4' : ''}`}>
        <span className="text-sm text-gray-600 w-16">{label}</span>
        <div className="flex-1 flex items-center bg-gray-100 bg-opacity-50 rounded-sm overflow-hidden border border-b-gray-400">
          <input
            type="number"
            value={number}
            onChange={(e) => handleInputChange(name, e.target.value, unit)}
            className="w-full py-1.5 px-2 text-right bg-transparent focus:outline-none  focus:border-indigo-500 transition-colors duration-200"
            
          />
          <div className="relative group">
            <select
              value={unit}
              onChange={(e) => handleInputChange(name, number, e.target.value)}
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
            <div className="absolute top-full left-0 w-full rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {units.map((u) => (
                <div key={u} className="px-2 py-1 hover:bg-gray-200">{u}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, controls, linkState, setLinkState) => {
    const isExpanded = expandedSections[title.toLowerCase()];
    return (
      <div className="mb-4">
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
          onClick={() => toggleSection(title.toLowerCase())}
        >
          {isExpanded ? <FaChevronDown className="mr-2 text-gray-500" /> : <FaChevronRight className="mr-2 text-gray-500" />}
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {linkState !== undefined && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLinkState(!linkState);
              }}
              className="ml-auto p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors duration-200"
            >
              {linkState ? <FaLink /> : <FaUnlink />}
            </button>
          )}
        </div>
        {isExpanded && (
  <div className="mt-2">
    {renderPresets(title.toLowerCase())}
    <div className="space-y-2">
      {controls}
    </div>
  </div>
)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Spacing</h3>
      <SpacingPreview
        padding={{
          paddingTop: style.paddingTop,
          paddingRight: style.paddingRight,
          paddingBottom: style.paddingBottom,
          paddingLeft: style.paddingLeft,
        }}
        margin={{
          marginTop: style.marginTop,
          marginRight: style.marginRight,
          marginBottom: style.marginBottom,
          marginLeft: style.marginLeft,
        }}
        gap={style.gap}
      />

      {availableControls.includes('padding') && renderSection(
        'Padding',
        <>
        
          {renderInput('Top', 'paddingTop', style.paddingTop, 1)}
          {renderInput('Right', 'paddingRight', style.paddingRight, 1)}
          {renderInput('Bottom', 'paddingBottom', style.paddingBottom, 1)}
          {renderInput('Left', 'paddingLeft', style.paddingLeft, 1)}
        </>,
        linkedPadding,
        setLinkedPadding
      )}

      {availableControls.includes('margin') && renderSection(
        'Margin',
        <>
          {renderInput('Top', 'marginTop', style.marginTop, 1)}
          {renderInput('Right', 'marginRight', style.marginRight, 1)}
          {renderInput('Bottom', 'marginBottom', style.marginBottom, 1)}
          {renderInput('Left', 'marginLeft', style.marginLeft, 1)}
        </>,
        linkedMargin,
        setLinkedMargin
      )}

      {availableControls.includes('gap') && renderSection(
        'Gap',
        renderInput('Gap', 'gap', style.gap, 1)
      )}
    </div>
  );
};


export default SpacingControls;