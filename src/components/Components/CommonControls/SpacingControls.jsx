import React, { useState } from 'react';
import { FaLink, FaUnlink } from 'react-icons/fa';
import SpacingPreview from './SpacingPreview';

const SpacingControls = ({ style, onStyleChange, availableControls = ['padding', 'margin', 'gap'] }) => {
  const [linkedPadding, setLinkedPadding] = useState(true);
  const [linkedMargin, setLinkedMargin] = useState(true);

  const units = ['px', '%', 'em', 'rem'];

  const presets = [
    { name: 'None', values: { padding: '0px', margin: '0px', gap: '0px' } },
    { name: 'Small', values: { padding: '8px', margin: '8px', gap: '8px' } },
    { name: 'Medium', values: { padding: '16px', margin: '16px', gap: '16px' } },
    { name: 'Large', values: { padding: '24px', margin: '24px', gap: '24px' } },
  ];

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

  const applyPreset = (preset) => {
    const updates = {};
    availableControls.forEach(control => {
      if (control === 'padding' || control === 'margin') {
        ['Top', 'Right', 'Bottom', 'Left'].forEach(direction => {
          updates[`${control}${direction}`] = preset.values[control];
        });
      } else if (control === 'gap') {
        updates[control] = preset.values[control];
      }
    });
    onStyleChange({ target: { name: 'spacingPreset', value: updates } });
  };

  const renderInput = (label, name, value) => {
    const { number, unit } = parseValue(value);
    return (
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex">
          <input
            type="number"
            value={number}
            onChange={(e) => handleInputChange(name, e.target.value, unit)}
            className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={unit}
            onChange={(e) => handleInputChange(name, number, e.target.value)}
            className="w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
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
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Presets</h4>
        <div className="flex space-x-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {availableControls.includes('padding') && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Padding</h4>
            <button
              onClick={() => setLinkedPadding(!linkedPadding)}
              className="p-1 rounded text-gray-500 hover:bg-gray-100"
            >
              {linkedPadding ? <FaLink /> : <FaUnlink />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {renderInput('Top', 'paddingTop', style.paddingTop)}
            {renderInput('Right', 'paddingRight', style.paddingRight)}
            {renderInput('Bottom', 'paddingBottom', style.paddingBottom)}
            {renderInput('Left', 'paddingLeft', style.paddingLeft)}
          </div>
        </div>
      )}

      {availableControls.includes('margin') && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Margin</h4>
            <button
              onClick={() => setLinkedMargin(!linkedMargin)}
              className="p-1 rounded text-gray-500 hover:bg-gray-100"
            >
              {linkedMargin ? <FaLink /> : <FaUnlink />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {renderInput('Top', 'marginTop', style.marginTop)}
            {renderInput('Right', 'marginRight', style.marginRight)}
            {renderInput('Bottom', 'marginBottom', style.marginBottom)}
            {renderInput('Left', 'marginLeft', style.marginLeft)}
          </div>
        </div>
      )}

      {availableControls.includes('gap') && renderInput('Gap', 'gap', style.gap)}
    </div>
  );
};

export default SpacingControls;