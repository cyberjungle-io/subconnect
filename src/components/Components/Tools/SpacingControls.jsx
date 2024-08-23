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

  const renderInput = (label, value, setter, property) => (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setter(e.target.value);
          handleChange(property, e.target.value);
        }}
        className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );

  const renderPresetButtons = (presets, selectedPreset, applyPreset) => (
    <div className="flex space-x-2 mb-4">
      {Object.entries(presets).map(([name, value]) => (
        <button
          key={name}
          onClick={() => applyPreset(name)}
          className={`px-2 py-1 text-xs rounded ${
            selectedPreset === name
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="control-section">
      <div className="control-section-content">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Padding Presets</h3>
        {renderPresetButtons(PADDING_PRESETS, selectedPaddingPreset, applyPaddingPreset)}

        <h3 className="text-sm font-medium text-gray-700 mb-2">Padding</h3>
        {renderInput('Top', paddingTop, setPaddingTop, 'paddingTop')}
        {renderInput('Right', paddingRight, setPaddingRight, 'paddingRight')}
        {renderInput('Bottom', paddingBottom, setPaddingBottom, 'paddingBottom')}
        {renderInput('Left', paddingLeft, setPaddingLeft, 'paddingLeft')}

        <h3 className="text-sm font-medium text-gray-700 mb-2 mt-4">Margin Presets</h3>
        {renderPresetButtons(MARGIN_PRESETS, selectedMarginPreset, applyMarginPreset)}

        <h3 className="text-sm font-medium text-gray-700 mb-2">Margin</h3>
        {renderInput('Top', marginTop, setMarginTop, 'marginTop')}
        {renderInput('Right', marginRight, setMarginRight, 'marginRight')}
        {renderInput('Bottom', marginBottom, setMarginBottom, 'marginBottom')}
        {renderInput('Left', marginLeft, setMarginLeft, 'marginLeft')}

        <h3 className="text-sm font-medium text-gray-700 mb-2 mt-4">Gap</h3>
        {renderInput('Gap', gap, setGap, 'gap')}
      </div>
    </div>
  );
};

export default SpacingControls;