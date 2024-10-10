import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColorTheme } from '../../../features/editorSlice';

const DEFAULT_THEME = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
];

const ColorThemeControls = () => {
  const dispatch = useDispatch();
  const colorTheme = useSelector(state => state.editor.colorTheme) || DEFAULT_THEME;
  const [localTheme, setLocalTheme] = useState(colorTheme);

  useEffect(() => {
    setLocalTheme(colorTheme);
  }, [colorTheme]);

  const handleColorChange = (index, newColor) => {
    const updatedTheme = [...localTheme];
    updatedTheme[index] = newColor;
    setLocalTheme(updatedTheme);
    dispatch(updateColorTheme(updatedTheme));
  };

  return (
    <div className="color-theme-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Color Theme</h3>
      <div className="grid grid-cols-3 gap-4">
        {localTheme.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-300"
            />
            <span className="mt-1 text-sm text-gray-600">Color {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorThemeControls;