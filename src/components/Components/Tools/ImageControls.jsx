import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from '../../common/ColorPicker';

const ImageControls = ({ style, onStyleChange }) => {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [objectFit, setObjectFit] = useState('cover');
  const [borderRadius, setBorderRadius] = useState('0');
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (style) {
      setSrc(style.src || '');
      setAlt(style.alt || '');
      setObjectFit(style.objectFit || 'cover');
      setBorderRadius(style.borderRadius || '0');
    }
  }, [style]);

  const handleChange = (property, value) => {
    onStyleChange({ [property]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('src', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleAspectRatioChange = (e) => {
    setKeepAspectRatio(e.target.checked);
    onStyleChange({ keepAspectRatio: e.target.checked });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            value={src}
            onChange={(e) => handleChange('src', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => handleChange('alt', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Object Fit</label>
          <select
            value={objectFit}
            onChange={(e) => handleChange('objectFit', e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
          <input
            type="text"
            value={borderRadius}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <button onClick={handleUploadClick} className="upload-button">Upload Image</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <div className="aspect-ratio-control">
          <label>
            <input
              type="checkbox"
              name="keepAspectRatio"
              checked={keepAspectRatio}
              onChange={handleAspectRatioChange}
            />
            Maintain Aspect Ratio
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageControls;