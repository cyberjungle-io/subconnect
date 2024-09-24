import React, { useState, useEffect } from 'react';
import ColorPicker from '../../common/ColorPicker';
import DOMPurify from 'dompurify';

const BackgroundControls = ({ style, onStyleChange }) => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (style.backgroundColor) {
      setBackgroundColor(style.backgroundColor);
    }
    if (style.backgroundImage) {
      setBackgroundImage(style.backgroundImage);
    }
  }, [style.backgroundColor, style.backgroundImage]);

  const handleBackgroundChange = (color) => {
    setBackgroundColor(color);
    onStyleChange({ backgroundColor: color, backgroundImage: '' });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        if (file.type === 'image/svg+xml') {
          // Sanitize SVG content
          const sanitizedSvg = DOMPurify.sanitize(result);
          setBackgroundImage(`url("data:image/svg+xml,${encodeURIComponent(sanitizedSvg)}")`);
        } else {
          setBackgroundImage(`url("${result}")`);
        }
        onStyleChange({ backgroundImage: `url("${result}")`, backgroundColor: 'transparent' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImage('');
    onStyleChange({ backgroundImage: '', backgroundColor });
  };

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Background Controls</h3>
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
          <ColorPicker
            color={backgroundColor}
            onChange={handleBackgroundChange}
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/*,.svg"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        {backgroundImage && (
          <div className="mb-2">
            <button
              onClick={handleRemoveImage}
              className="px-2 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundControls;