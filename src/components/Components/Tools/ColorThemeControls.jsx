import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColorTheme } from '../../../features/editorSlice';
import ColorPicker from '../../common/ColorPicker';
import { FaTrash } from 'react-icons/fa';

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

  const addNewColor = () => {
    const newColor = { value: '#000000', name: `Color ${localTheme.length + 1}` };
    const updatedTheme = [...localTheme, newColor];
    setLocalTheme(updatedTheme);
    dispatch(updateColorTheme(updatedTheme));
  };

  const deleteColor = (index) => {
    const updatedTheme = localTheme.filter((_, i) => i !== index);
    setLocalTheme(updatedTheme);
    dispatch(updateColorTheme(updatedTheme));
  };

  return (
    <div className="color-theme-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Color Theme</h3>
      <div className="space-y-6">
        {localTheme.map((color, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="w-full mb-1 flex justify-between items-center">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={color.name || ''}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  onBlur={() => setEditingIndex(null)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingIndex(null)}
                  className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded"
                  autoFocus
                />
              ) : (
                <span 
                  className="text-sm text-gray-600 cursor-pointer inline-block w-full p-1"
                  onDoubleClick={() => setEditingIndex(index)}
                >
                  {getColorName(color, index)}
                </span>
              )}
              <button
                onClick={() => deleteColor(index)}
                className="ml-2 text-red-500 hover:text-red-700"
                title="Delete color"
              >
                <FaTrash />
              </button>
            </div>
            <div className="scale-90 origin-top-left">
              <ColorPicker
                color={color.value}
                onChange={(newColor) => handleColorChange(index, newColor)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addNewColor}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add New Color
        </button>
      </div>
      <style jsx>{`
        .color-picker input[type="text"] {
          width: 100% !important;
          min-width: 120px !important;
        }
      `}</style>
    </div>
  );
};

export default ColorThemeControls;
