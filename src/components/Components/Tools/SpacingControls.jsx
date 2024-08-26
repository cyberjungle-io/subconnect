import React, { useState, useEffect } from 'react';

const PADDING_PRESETS = {
  'Small': '8px',
  'Medium': '16px',
  'Large': '24px',
};

const MARGIN_PRESETS = {
  'Small': '8px',
  'Medium': '16px',
  'Large': '24px',
};

const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh'];

const SpacingControls = ({ style, onStyleChange }) => {
  const [paddingTop, setPaddingTop] = useState('0px');
  const [paddingRight, setPaddingRight] = useState('0px');
  const [paddingBottom, setPaddingBottom] = useState('0px');
  const [paddingLeft, setPaddingLeft] = useState('0px');
  const [marginTop, setMarginTop] = useState('0px');
  const [marginRight, setMarginRight] = useState('0px');
  const [marginBottom, setMarginBottom] = useState('0px');
  const [marginLeft, setMarginLeft] = useState('0px');
  const [gap, setGap] = useState('0px');
  const [selectedPaddingPreset, setSelectedPaddingPreset] = useState(null);
  const [selectedMarginPreset, setSelectedMarginPreset] = useState(null);

  useEffect(() => {
    if (style) {
      const [pTop, pRight, pBottom, pLeft] = (style.padding || '0px 0px 0px 0px').split(' ');
      setPaddingTop(pTop);
      setPaddingRight(pRight || pTop);
      setPaddingBottom(pBottom || pTop);
      setPaddingLeft(pLeft || pRight || pTop);

      const [mTop, mRight, mBottom, mLeft] = (style.margin || '0px 0px 0px 0px').split(' ');
      setMarginTop(mTop);
      setMarginRight(mRight || mTop);
      setMarginBottom(mBottom || mTop);
      setMarginLeft(mLeft || mRight || mTop);

      setGap(style.gap || '0px');
    }
  }, [style]);

  const handleChange = (property, value) => {
    if (property.startsWith('padding')) {
      const padding = `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
      onStyleChange({ padding });
      setSelectedPaddingPreset(null);
    } else if (property.startsWith('margin')) {
      const margin = `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`;
      onStyleChange({ margin });
      setSelectedMarginPreset(null);
    } else {
      onStyleChange({ [property]: value });
    }
  };

  const applyPaddingPreset = (presetName) => {
    const preset = PADDING_PRESETS[presetName];
    if (selectedPaddingPreset === presetName) {
      // Deselect the preset
      setPaddingTop('0px');
      setPaddingRight('0px');
      setPaddingBottom('0px');
      setPaddingLeft('0px');
      onStyleChange({ padding: '0px' });
      setSelectedPaddingPreset(null);
    } else {
      // Apply the preset
      setPaddingTop(preset);
      setPaddingRight(preset);
      setPaddingBottom(preset);
      setPaddingLeft(preset);
      onStyleChange({ padding: preset });
      setSelectedPaddingPreset(presetName);
    }
  };

  const applyMarginPreset = (presetName) => {
    const preset = MARGIN_PRESETS[presetName];
    if (selectedMarginPreset === presetName) {
      // Deselect the preset
      setMarginTop('0px');
      setMarginRight('0px');
      setMarginBottom('0px');
      setMarginLeft('0px');
      onStyleChange({ margin: '0px' });
      setSelectedMarginPreset(null);
    } else {
      // Apply the preset
      setMarginTop(preset);
      setMarginRight(preset);
      setMarginBottom(preset);
      setMarginLeft(preset);
      onStyleChange({ margin: preset });
      setSelectedMarginPreset(presetName);
    }
  };

  const renderInputGroup = (label, values, setters, properties) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          {['Top', 'Bottom'].map((side, index) => (
            <div key={side} className="flex flex-col w-[48%]">
              <span className="text-xs text-gray-500 mb-1">{side}</span>
              <div className="flex">
                <input
                  type="text"
                  value={(values[index * 2] || '').split(/(\d+)/)[1] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value + ((values[index * 2] || '').split(/(\d+)/)[2] || 'px');
                    setters[index * 2](newValue);
                    handleChange(properties[index * 2], newValue);
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={(values[index * 2] || '').split(/(\d+)/)[2] || 'px'}
                  onChange={(e) => {
                    const newValue = ((values[index * 2] || '').split(/(\d+)/)[1] || '0') + e.target.value;
                    setters[index * 2](newValue);
                    handleChange(properties[index * 2], newValue);
                  }}
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
          ))}
        </div>
        <div className="flex justify-between">
          {['Left', 'Right'].map((side, index) => (
            <div key={side} className="flex flex-col w-[48%]">
              <span className="text-xs text-gray-500 mb-1">{side}</span>
              <div className="flex">
                <input
                  type="text"
                  value={(values[index * 2 + 3] || '').split(/(\d+)/)[1] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value + ((values[index * 2 + 3] || '').split(/(\d+)/)[2] || 'px');
                    setters[index * 2 + 3](newValue);
                    handleChange(properties[index * 2 + 3], newValue);
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={(values[index * 2 + 3] || '').split(/(\d+)/)[2] || 'px'}
                  onChange={(e) => {
                    const newValue = ((values[index * 2 + 3] || '').split(/(\d+)/)[1] || '0') + e.target.value;
                    setters[index * 2 + 3](newValue);
                    handleChange(properties[index * 2 + 3], newValue);
                  }}
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
          ))}
        </div>
      </div>
    </div>
  );

  const renderPresetButtons = (presets, selectedPreset, applyPreset) => (
    <div className="flex justify-center items-center mb-4">
      <div className="inline-flex space-x-2">
        {Object.entries(presets).map(([name, value]) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
              selectedPreset === name
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

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Spacing Controls</h3>

      <h4 className="text-sm font-medium text-gray-700 mb-2">Padding Presets</h4>
      {renderPresetButtons(PADDING_PRESETS, selectedPaddingPreset, applyPaddingPreset)}

      {renderInputGroup(
        'Padding',
        [paddingTop, paddingRight, paddingBottom, paddingLeft],
        [setPaddingTop, setPaddingRight, setPaddingBottom, setPaddingLeft],
        ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
      )}

      <h4 className="text-sm font-medium text-gray-700 mb-2 mt-6">Margin Presets</h4>
      {renderPresetButtons(MARGIN_PRESETS, selectedMarginPreset, applyMarginPreset)}

      {renderInputGroup(
        'Margin',
        [marginTop, marginRight, marginBottom, marginLeft],
        [setMarginTop, setMarginRight, setMarginBottom, setMarginLeft],
        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft']
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Gap</label>
        <div className="flex">
          <input
            type="text"
            value={gap.split(/(\d+)/)[1] || ''}
            onChange={(e) => {
              const newValue = e.target.value + (gap.split(/(\d+)/)[2] || 'px');
              setGap(newValue);
              handleChange('gap', newValue);
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={gap.split(/(\d+)/)[2] || 'px'}
            onChange={(e) => {
              const newValue = (gap.split(/(\d+)/)[1] || '0') + e.target.value;
              setGap(newValue);
              handleChange('gap', newValue);
            }}
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
    </div>
  );
};

export default SpacingControls;