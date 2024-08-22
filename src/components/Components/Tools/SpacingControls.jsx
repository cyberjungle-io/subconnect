import React, { useState, useEffect } from 'react';

const SpacingControls = ({ style, onStyleChange }) => {
  const [padding, setPadding] = useState('0px');
  const [margin, setMargin] = useState('0px');
  const [gap, setGap] = useState('0px');

  useEffect(() => {
    if (style) {
      setPadding(style.padding || '0px');
      setMargin(style.margin || '0px');
      setGap(style.gap || '0px');
    }
  }, [style]);

  const handleChange = (property, value) => {
    onStyleChange({ [property]: value });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Padding</label>
          <input
            type="text"
            value={padding}
            onChange={(e) => handleChange('padding', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Margin</label>
          <input
            type="text"
            value={margin}
            onChange={(e) => handleChange('margin', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Gap</label>
          <input
            type="text"
            value={gap}
            onChange={(e) => handleChange('gap', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SpacingControls;