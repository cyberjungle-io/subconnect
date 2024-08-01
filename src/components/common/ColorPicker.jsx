import React from 'react';

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
      />
    </div>
  );
};

export default ColorPicker;