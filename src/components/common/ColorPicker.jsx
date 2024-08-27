import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';

const COLOR_FORMATS = ['hex', 'rgb', 'hsl'];
const COLOR_PRESETS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const ColorPicker = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentFormat, setCurrentFormat] = useState('hex');
  const [colorHistory, setColorHistory] = useState([]);
  const colorSwatchRef = useRef(null);

  useEffect(() => {
    if (color && !colorHistory.includes(color)) {
      setColorHistory(prevHistory => [color, ...prevHistory.slice(0, 9)]);
    }
  }, [color, colorHistory]);

  const handleFormatChange = (format) => {
    setCurrentFormat(format);
  };

  const handleColorChange = (newColor) => {
    onChange(newColor[currentFormat]);
  };

  const formatColor = (color) => {
    switch (currentFormat) {
      case 'rgb':
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
      case 'hsl':
        return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
      default:
        return color.hex;
    }
  };

  return (
    <div className="color-picker relative">
      <div className="flex items-center mb-2">
        <div
          ref={colorSwatchRef}
          className="w-12 h-12 rounded-md cursor-pointer border border-gray-300 shadow-sm mr-2"
          style={{ backgroundColor: color }}
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
        />
        <div className="flex-grow flex items-center">
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={currentFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="p-2 text-sm bg-white border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {COLOR_FORMATS.map(format => (
              <option key={format} value={format}>{format.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
      
      {displayColorPicker && (
        <div className="fixed inset-0 z-[1000]" onClick={() => setDisplayColorPicker(false)}>
          <div 
            className="absolute z-[1001]"
            style={{
              top: colorSwatchRef.current
                ? window.innerHeight - colorSwatchRef.current.getBoundingClientRect().top > 300
                  ? colorSwatchRef.current.getBoundingClientRect().bottom + 5
                  : colorSwatchRef.current.getBoundingClientRect().top - 300
                : 0,
              left: colorSwatchRef.current ? colorSwatchRef.current.getBoundingClientRect().left : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SketchPicker
              color={color}
              onChange={(color) => handleColorChange(color)}
              presetColors={[...COLOR_PRESETS, ...colorHistory]}
            />
          </div>
        </div>
      )}
      
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Presets</h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((presetColor) => (
            <div
              key={presetColor}
              className="w-6 h-6 rounded-md cursor-pointer border border-gray-300 shadow-sm"
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </div>
      </div>
      
      {colorHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Colors</h4>
          <div className="flex flex-wrap gap-2">
            {colorHistory.map((historyColor, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-md cursor-pointer border border-gray-300 shadow-sm"
                style={{ backgroundColor: historyColor }}
                onClick={() => onChange(historyColor)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;