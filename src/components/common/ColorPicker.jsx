import React from 'react';

const COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Orange', value: '#FFA500' },
];

const ColorPicker = ({ onColorSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Column Color</h2>
      <div className="grid grid-cols-3 gap-4">
        {COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.value)}
            className="p-4 rounded transition-transform transform hover:scale-105"
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;