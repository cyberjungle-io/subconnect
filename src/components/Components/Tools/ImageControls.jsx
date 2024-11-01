import React, { useState, useCallback } from 'react';
import { FaSearchPlus, FaSearchMinus, FaUpload } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../../../features/editorSlice';

const ImageControls = ({ style = {}, onStyleChange, component }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(style.scale || 1);
  const [position, setPosition] = useState({
    x: style.objectPosition?.split(' ')[0] || '50%',
    y: style.objectPosition?.split(' ')[1] || '50%'
  });
  const [objectFit, setObjectFit] = useState(style.objectFit || 'cover');

  const handleScaleChange = useCallback((newScale) => {
    const scale = Math.max(0.1, Math.min(3, newScale));
    setScale(scale);
    onStyleChange({
      imageTransform: `scale(${scale})`,
      scale: scale
    });
  }, [onStyleChange]);

  const handlePositionChange = useCallback((x, y) => {
    setPosition({ x, y });
    onStyleChange({
      objectPosition: `${x} ${y}`
    });
  }, [onStyleChange]);

  const handleObjectFitChange = useCallback((fit) => {
    setObjectFit(fit);
    onStyleChange({
      objectFit: fit
    });
  }, [onStyleChange]);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (!component?.id) {
      setError('Component ID is missing');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target.result;
      
      dispatch(updateComponent({
        id: component.id,
        updates: { 
          content: imageData,
          props: {
            ...component.props,
            originalFileName: file.name
          }
        }
      }));

      onStyleChange({
        content: imageData,
        props: {
          ...component.props,
          originalFileName: file.name
        }
      });

      setIsLoading(false);
    };

    reader.onerror = () => {
      setError('Failed to read image file');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  }, [component, dispatch]);

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Image Controls</h3>
      
      {/* Upload Button */}
      <div className="mb-4">
        <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors duration-200">
          <FaUpload className="mr-2" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {isLoading && <p className="text-blue-500 text-sm mt-1">Loading...</p>}
      </div>

      {/* Zoom Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Zoom</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScaleChange(scale - 0.1)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <FaSearchMinus />
          </button>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="flex-grow"
          />
          <button
            onClick={() => handleScaleChange(scale + 0.1)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <FaSearchPlus />
          </button>
        </div>
      </div>

      {/* Position Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Position</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">X Position</label>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(position.x)}
              onChange={(e) => handlePositionChange(`${e.target.value}%`, position.y)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Y Position</label>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(position.y)}
              onChange={(e) => handlePositionChange(position.x, `${e.target.value}%`)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Object Fit Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Fit Mode</span>
        <div className="grid grid-cols-2 gap-2">
          {['cover', 'contain', 'fill', 'none'].map((fit) => (
            <button
              key={fit}
              onClick={() => handleObjectFitChange(fit)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
                objectFit === fit
                  ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                  : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
              }`}
            >
              {fit.charAt(0).toUpperCase() + fit.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageControls;
