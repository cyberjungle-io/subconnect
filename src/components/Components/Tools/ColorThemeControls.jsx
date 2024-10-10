import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColorTheme } from '../../../features/editorSlice';

const DEFAULT_THEME = [
  { value: '#FF0000', name: 'Color 1' },
  { value: '#00FF00', name: 'Color 2' },
  { value: '#0000FF', name: 'Color 3' },
  { value: '#FFFF00', name: 'Color 4' },
  { value: '#FF00FF', name: 'Color 5' },
  { value: '#00FFFF', name: 'Color 6' }
];

const ColorThemeControls = () => {
  const dispatch = useDispatch();
  const colorTheme = useSelector(state => state.editor.colorTheme);
  const [localTheme, setLocalTheme] = useState(colorTheme || DEFAULT_THEME);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (colorTheme && colorTheme.length > 0) {
      setLocalTheme(colorTheme);
    } else {
      setLocalTheme(DEFAULT_THEME);
      dispatch(updateColorTheme(DEFAULT_THEME));
    }
  }, [colorTheme, dispatch]);

  const handleColorChange = (index, newColor) => {
    const updatedTheme = localTheme.map((color, i) => 
      i === index ? { ...color, value: newColor } : color
    );
    setLocalTheme(updatedTheme);
    dispatch(updateColorTheme(updatedTheme));
  };

  const handleNameChange = (index, newName) => {
    const updatedTheme = localTheme.map((color, i) => 
      i === index ? { ...color, name: newName } : color
    );
    setLocalTheme(updatedTheme);
    dispatch(updateColorTheme(updatedTheme));
  };

  const getColorName = (color, index) => {
    if (color.name !== undefined && color.name !== null && color.name !== '') {
      return color.name;
    }
    return `Color ${index + 1}`;
  };

  return (
    <div className="color-theme-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Color Theme</h3>
      <div className="grid grid-cols-3 gap-4">
        {localTheme.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <input
              type="color"
              value={color.value}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-300"
            />
            {editingIndex === index ? (
              <input
                type="text"
                value={color.name || ''}
                onChange={(e) => handleNameChange(index, e.target.value)}
                onBlur={() => setEditingIndex(null)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingIndex(null)}
                className="mt-1 text-sm text-gray-600 w-full text-center"
                autoFocus
              />
            ) : (
              <span 
                className="mt-1 text-sm text-gray-600 cursor-pointer"
                onDoubleClick={() => setEditingIndex(index)}
              >
                {getColorName(color, index)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorThemeControls;