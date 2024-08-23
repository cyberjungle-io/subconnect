import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from '../../common/ColorPicker';

const ImageControls = ({ component, updateComponent }) => {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [objectFit, setObjectFit] = useState('cover');
  const [borderRadius, setBorderRadius] = useState('0');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (component.style) {
      setSrc(component.style.src || '');
      setAlt(component.style.alt || '');
      setObjectFit(component.style.objectFit || 'cover');
      setBorderRadius(component.style.borderRadius || '0');
    }
  }, [component.style]);

  const handleChange = (property, value) => {
    updateComponent({
      ...component,
      style: { ...component.style, [property]: value },
      props: { ...component.props, [property]: value }
    });
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
    const keepAspectRatio = e.target.checked;
    updateComponent({ 
      ...component, 
      props: { 
        ...component.props, 
        keepAspectRatio 
      } 
    });
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
          <button onClick={handleUploadClick} className="upload-button">Upload Image</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
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
        <div className="aspect-ratio-control">
          <label>
            <input
              type="checkbox"
              name="keepAspectRatio"
              checked={component.props.keepAspectRatio || false}
              onChange={handleAspectRatioChange}
            />
            Maintain Aspect Ratio
          </label>
        </div>
        <div>
          <label htmlFor="width">Width:</label>
          <input
            type="text"
            id="width"
            name="width"
            value={component.style.width || ""}
            onChange={(e) => handleChange('width', e.target.value)}
            placeholder="e.g., 100%, 200px"
          />
        </div>
        <div>
          <label htmlFor="height">Height:</label>
          <input
            type="text"
            id="height"
            name="height"
            value={component.style.height || ""}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="e.g., 100%, 200px"
          />
        </div>
        <div className="border-radius-control">
          <label htmlFor="borderRadius">Border Radius:</label>
          <div className="border-radius-inputs">
            <input
              type="number"
              id="borderRadius"
              name="borderRadius"
              value={parseInt(component.props.borderRadius) || 0}
              onChange={(e) => handleChange('borderRadius', e.target.value)}
              min="0"
            />
            <select
              name="borderRadiusUnit"
              value={component.props.borderRadiusUnit || "px"}
              onChange={(e) => handleChange('borderRadiusUnit', e.target.value)}
            >
              <option value="px">px</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
        <div className="box-shadow-control">
          <label>Box Shadow:</label>
          <div className="box-shadow-inputs">
            <div className="box-shadow-input">
              <label htmlFor="boxShadowX">X Offset</label>
              <input
                type="number"
                id="boxShadowX"
                name="boxShadowX"
                value={component.props.boxShadowX || 0}
                onChange={(e) => handleChange('boxShadowX', e.target.value)}
              />
            </div>
            <div className="box-shadow-input">
              <label htmlFor="boxShadowY">Y Offset</label>
              <input
                type="number"
                id="boxShadowY"
                name="boxShadowY"
                value={component.props.boxShadowY || 0}
                onChange={(e) => handleChange('boxShadowY', e.target.value)}
              />
            </div>
            <div className="box-shadow-input">
              <label htmlFor="boxShadowBlur">Blur</label>
              <input
                type="number"
                id="boxShadowBlur"
                name="boxShadowBlur"
                value={component.props.boxShadowBlur || 0}
                onChange={(e) => handleChange('boxShadowBlur', e.target.value)}
              />
            </div>
            <div className="box-shadow-input">
              <label htmlFor="boxShadowColor">Color</label>
              <input
                type="color"
                id="boxShadowColor"
                name="boxShadowColor"
                value={component.props.boxShadowColor || "#000000"}
                onChange={(e) => handleChange('boxShadowColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageControls;