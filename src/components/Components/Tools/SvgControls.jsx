import React, { useState, useCallback } from 'react';
import { FaUpload, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';

const SvgControls = ({ style = {}, onStyleChange, component }) => {
  const [fill, setFill] = useState(style.fill || '#000000');
  const [stroke, setStroke] = useState(style.stroke || 'none');
  const [strokeWidth, setStrokeWidth] = useState(style.strokeWidth || 1);
  const [rotation, setRotation] = useState(style.rotation || 0);
  const [width, setWidth] = useState(style.width || '100px');
  const [height, setHeight] = useState(style.height || '100px');
  const [scale, setScale] = useState(style.scale || 1);

  const handleSvgUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (content.includes('<svg')) {
        onStyleChange({
          content,
          props: {
            ...component.props,
            originalFileName: file.name,
            isSvg: true
          }
        });
      } else {
        console.error('Invalid SVG file');
      }
    };
    reader.readAsText(file);
  }, [component, onStyleChange]);

  const handleSizeChange = useCallback((dimension, value) => {
    const formattedValue = value.endsWith('px') ? value : `${value}px`;
    
    onStyleChange({
      style: {
        ...style,
        [dimension]: formattedValue
      }
    });
    
    if (dimension === 'width') setWidth(formattedValue);
    if (dimension === 'height') setHeight(formattedValue);
  }, [onStyleChange, style]);

  const handleScaleChange = useCallback((newScale) => {
    const scale = Math.max(0.1, Math.min(3, newScale));
    setScale(scale);
    onStyleChange({
      style: {
        ...style,
        scale
      }
    });
  }, [onStyleChange, style]);

  const handleColorChange = useCallback((type, color) => {
    onStyleChange({
      style: {
        ...style,
        [type]: color
      }
    });
    if (type === 'fill') setFill(color);
    if (type === 'stroke') setStroke(color);
  }, [onStyleChange, style]);

  const handleRotationChange = useCallback((value) => {
    onStyleChange({
      style: {
        ...style,
        rotation: value
      }
    });
  }, [onStyleChange, style]);

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">SVG Controls</h3>

      {/* Size Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Size</span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600">Width</label>
            <input
              type="text"
              value={width}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="e.g., 100px"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Height</label>
            <input
              type="text"
              value={height}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="e.g., 100px"
            />
          </div>
        </div>
      </div>

      {/* Scale Control */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Scale</span>
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

      {/* Upload Button */}
      <div className="mb-4">
        <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer">
          <FaUpload className="mr-2" />
          <span>Upload SVG</span>
          <input
            type="file"
            accept=".svg"
            onChange={handleSvgUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Fill Color */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Fill Color</span>
        <ColorPicker
          color={fill}
          onChange={(color) => handleColorChange('fill', color)}
        />
      </div>

      {/* Stroke Color */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Stroke Color</span>
        <ColorPicker
          color={stroke}
          onChange={(color) => handleColorChange('stroke', color)}
        />
      </div>

      {/* Stroke Width */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Stroke Width</span>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={strokeWidth}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setStrokeWidth(value);
            onStyleChange({ style: { strokeWidth: value } });
          }}
          className="w-full"
        />
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Rotation</span>
        <input
          type="number"
          value={style.rotation || 0}
          onChange={(e) => handleRotationChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SvgControls;
