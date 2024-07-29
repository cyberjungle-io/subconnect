import React from 'react';

const SpacingControls = ({ style, onStyleChange }) => {
  // Helper function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onStyleChange({ target: { name, value } });
  };

  // Helper function to render an input field
  const renderInput = (label, name, value, placeholder = '0px') => (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Spacing</h3>
      
      {/* Padding controls */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Padding</h4>
        <div className="grid grid-cols-2 gap-2">
          {renderInput('Top', 'paddingTop', style.paddingTop)}
          {renderInput('Right', 'paddingRight', style.paddingRight)}
          {renderInput('Bottom', 'paddingBottom', style.paddingBottom)}
          {renderInput('Left', 'paddingLeft', style.paddingLeft)}
        </div>
      </div>

      {/* Margin controls */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Margin</h4>
        <div className="grid grid-cols-2 gap-2">
          {renderInput('Top', 'marginTop', style.marginTop)}
          {renderInput('Right', 'marginRight', style.marginRight)}
          {renderInput('Bottom', 'marginBottom', style.marginBottom)}
          {renderInput('Left', 'marginLeft', style.marginLeft)}
        </div>
      </div>

      {/* Gap control */}
      {renderInput('Gap', 'gap', style.gap)}
    </div>
  );
};

export default SpacingControls;