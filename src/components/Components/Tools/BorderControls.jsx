import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';

const BorderControls = ({ style, onStyleChange }) => {
  const [borderWidth, setBorderWidth] = useState({ top: '0', right: '0', bottom: '0', left: '0' });
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState({ topLeft: '0', topRight: '0', bottomRight: '0', bottomLeft: '0' });
  const [expandedSections, setExpandedSections] = useState({
    width: true,
    style: true,
    color: true,
    radius: false,
  });

  useEffect(() => {
    if (style.borderWidth) {
      const [top, right, bottom, left] = style.borderWidth.split(' ');
      setBorderWidth({ top, right: right || top, bottom: bottom || top, left: left || right || top });
    }
    if (style.borderStyle) setBorderStyle(style.borderStyle);
    if (style.borderColor) setBorderColor(style.borderColor);
    if (style.borderRadius) {
      const [topLeft, topRight, bottomRight, bottomLeft] = style.borderRadius.split(' ');
      setBorderRadius({ topLeft, topRight: topRight || topLeft, bottomRight: bottomRight || topLeft, bottomLeft: bottomLeft || topRight || topLeft });
    }
  }, [style]);

  const handleBorderChange = (property, value) => {
    let updates = {};
    if (property === 'width') {
      updates.borderWidth = `${value.top}px ${value.right}px ${value.bottom}px ${value.left}px`;
    } else if (property === 'radius') {
      updates.borderRadius = `${value.topLeft}px ${value.topRight}px ${value.bottomRight}px ${value.bottomLeft}px`;
    } else {
      updates[`border${property.charAt(0).toUpperCase() + property.slice(1)}`] = value;
    }
    onStyleChange(updates);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderWidthControls = () => (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1" onClick={() => toggleSection('width')}>
        <label className="text-xs font-medium text-gray-700">Border Width</label>
        {expandedSections.width ? <FaChevronDown /> : <FaChevronRight />}
      </div>
      {expandedSections.width && (
        <div className="grid grid-cols-2 gap-2">
          {['top', 'right', 'bottom', 'left'].map(side => (
            <div key={side}>
              <label className="block text-xs text-gray-600">{side.charAt(0).toUpperCase() + side.slice(1)}</label>
              <input
                type="number"
                min="0"
                value={borderWidth[side]}
                onChange={(e) => {
                  const newWidth = { ...borderWidth, [side]: e.target.value };
                  setBorderWidth(newWidth);
                  handleBorderChange('width', newWidth);
                }}
                className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStyleControl = () => (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1" onClick={() => toggleSection('style')}>
        <label className="text-xs font-medium text-gray-700">Border Style</label>
        {expandedSections.style ? <FaChevronDown /> : <FaChevronRight />}
      </div>
      {expandedSections.style && (
        <select
          value={borderStyle}
          onChange={(e) => {
            setBorderStyle(e.target.value);
            handleBorderChange('style', e.target.value);
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
          <option value="groove">Groove</option>
          <option value="ridge">Ridge</option>
          <option value="inset">Inset</option>
          <option value="outset">Outset</option>
        </select>
      )}
    </div>
  );

  const renderColorControl = () => (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1" onClick={() => toggleSection('color')}>
        <label className="text-xs font-medium text-gray-700">Border Color</label>
        {expandedSections.color ? <FaChevronDown /> : <FaChevronRight />}
      </div>
      {expandedSections.color && (
        <ColorPicker
          color={borderColor}
          onChange={(color) => {
            setBorderColor(color);
            handleBorderChange('color', color);
          }}
        />
      )}
    </div>
  );

  const renderRadiusControls = () => (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1" onClick={() => toggleSection('radius')}>
        <label className="text-xs font-medium text-gray-700">Border Radius</label>
        {expandedSections.radius ? <FaChevronDown /> : <FaChevronRight />}
      </div>
      {expandedSections.radius && (
        <div className="grid grid-cols-2 gap-2">
          {['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].map(corner => (
            <div key={corner}>
              <label className="block text-xs text-gray-600">{corner.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                type="number"
                min="0"
                value={borderRadius[corner]}
                onChange={(e) => {
                  const newRadius = { ...borderRadius, [corner]: e.target.value };
                  setBorderRadius(newRadius);
                  handleBorderChange('radius', newRadius);
                }}
                className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="control-section">
      <div className="control-section-content">
        {renderWidthControls()}
        {renderStyleControl()}
        {renderColorControl()}
        {renderRadiusControls()}
      </div>
    </div>
  );
};

export default BorderControls;