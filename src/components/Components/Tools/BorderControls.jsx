import React, { useState, useEffect, useCallback } from 'react';
import ColorPicker from '../../common/ColorPicker';

const UNITS = ['px', '%', 'em', 'rem', 'vw', 'vh'];

const BorderControls = ({ style, onStyleChange }) => {
  const [borderWidth, setBorderWidth] = useState({ top: '0px', right: '0px', bottom: '0px', left: '0px' });
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState({ topLeft: '0px', topRight: '0px', bottomRight: '0px', bottomLeft: '0px' });
  const [allBorderWidth, setAllBorderWidth] = useState('0px');

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
      updates.borderWidth = `${value.top} ${value.right} ${value.bottom} ${value.left}`;
    } else if (property === 'radius') {
      updates.borderRadius = `${value.topLeft} ${value.topRight} ${value.bottomRight} ${value.bottomLeft}`;
    } else {
      updates[`border${property.charAt(0).toUpperCase() + property.slice(1)}`] = value;
    }
    onStyleChange(updates);
  };

  const handleAllBorderWidthChange = (value) => {
    setAllBorderWidth(value);
    const newBorderWidth = { top: value, right: value, bottom: value, left: value };
    setBorderWidth(newBorderWidth);
    handleBorderChange('width', newBorderWidth);
  };

  const handleSingleBorderWidthChange = (side, value) => {
    const allValue = parseFloat(allBorderWidth) || 0;
    const sideValue = parseFloat(value) || 0;
    const newValue = `${allValue + sideValue}px`;
    
    setBorderWidth(prev => {
      const newBorderWidth = { ...prev, [side]: newValue };
      handleBorderChange('width', newBorderWidth);
      return newBorderWidth;
    });
  };

  const handleKeyDown = useCallback((e, setValue, currentValue) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const [, numericPart, unit] = currentValue.match(/^(\d*\.?\d+)(\D*)$/) || [, '0', 'px'];
      let newValue = parseFloat(numericPart);

      if (e.key === 'ArrowUp') {
        newValue += step;
      } else {
        newValue = Math.max(0, newValue - step);
      }

      setValue(`${newValue}${unit}`);
    }
  }, []);

  const renderInputGroup = (label, values, setters, properties) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      {label === 'Border Width' && (
        <div className="flex mb-2">
          <input
            type="text"
            value={allBorderWidth.split(/(\d+)/)[1] || ''}
            onChange={(e) => {
              const newValue = e.target.value + (allBorderWidth.split(/(\d+)/)[2] || 'px');
              handleAllBorderWidthChange(newValue);
            }}
            onKeyDown={(e) => handleKeyDown(e, handleAllBorderWidthChange, allBorderWidth)}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="All sides"
          />
          <select
            value={allBorderWidth.split(/(\d+)/)[2] || 'px'}
            onChange={(e) => {
              const newValue = (allBorderWidth.split(/(\d+)/)[1] || '0') + e.target.value;
              handleAllBorderWidthChange(newValue);
            }}
            className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          {['Top', 'Bottom'].map((side) => (
            <div key={side} className="flex flex-col w-[48%]">
              <span className="text-xs text-gray-500 mb-1">{side}</span>
              <div className="flex">
                <input
                  type="text"
                  value={(values[side.toLowerCase()] || '').split(/(\d+)/)[1] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value + ((values[side.toLowerCase()] || '').split(/(\d+)/)[2] || 'px');
                    if (label === 'Border Width') {
                      handleSingleBorderWidthChange(side.toLowerCase(), newValue);
                    } else {
                      setters[side.toLowerCase()](newValue);
                      handleBorderChange(properties, { ...values, [side.toLowerCase()]: newValue });
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 
                    (newValue) => label === 'Border Width' 
                      ? handleSingleBorderWidthChange(side.toLowerCase(), newValue)
                      : setters[side.toLowerCase()](newValue),
                    values[side.toLowerCase()]
                  )}
                  className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={(values[side.toLowerCase()] || '').split(/(\d+)/)[2] || 'px'}
                  onChange={(e) => {
                    const newValue = ((values[side.toLowerCase()] || '').split(/(\d+)/)[1] || '0') + e.target.value;
                    if (label === 'Border Width') {
                      handleSingleBorderWidthChange(side.toLowerCase(), newValue);
                    } else {
                      setters[side.toLowerCase()](newValue);
                      handleBorderChange(properties, { ...values, [side.toLowerCase()]: newValue });
                    }
                  }}
                  className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {['Left', 'Right'].map((side) => (
            <div key={side} className="flex flex-col w-[48%]">
              <span className="text-xs text-gray-500 mb-1">{side}</span>
              <div className="flex">
                <input
                  type="text"
                  value={(values[side.toLowerCase()] || '').split(/(\d+)/)[1] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value + ((values[side.toLowerCase()] || '').split(/(\d+)/)[2] || 'px');
                    if (label === 'Border Width') {
                      handleSingleBorderWidthChange(side.toLowerCase(), newValue);
                    } else {
                      setters[side.toLowerCase()](newValue);
                      handleBorderChange(properties, { ...values, [side.toLowerCase()]: newValue });
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 
                    (newValue) => label === 'Border Width' 
                      ? handleSingleBorderWidthChange(side.toLowerCase(), newValue)
                      : setters[side.toLowerCase()](newValue),
                    values[side.toLowerCase()]
                  )}
                  className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={(values[side.toLowerCase()] || '').split(/(\d+)/)[2] || 'px'}
                  onChange={(e) => {
                    const newValue = ((values[side.toLowerCase()] || '').split(/(\d+)/)[1] || '0') + e.target.value;
                    if (label === 'Border Width') {
                      handleSingleBorderWidthChange(side.toLowerCase(), newValue);
                    } else {
                      setters[side.toLowerCase()](newValue);
                      handleBorderChange(properties, { ...values, [side.toLowerCase()]: newValue });
                    }
                  }}
                  className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStyleControl = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Border Style</label>
      <select
        value={borderStyle}
        onChange={(e) => {
          setBorderStyle(e.target.value);
          handleBorderChange('style', e.target.value);
        }}
        className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
    </div>
  );

  const renderColorControl = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
      <ColorPicker
        color={borderColor}
        onChange={(color) => {
          setBorderColor(color);
          handleBorderChange('color', color);
        }}
      />
    </div>
  );

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Border Controls</h3>

      {renderInputGroup(
        'Border Width',
        borderWidth,
        {
          top: (v) => setBorderWidth({ ...borderWidth, top: v }),
          right: (v) => setBorderWidth({ ...borderWidth, right: v }),
          bottom: (v) => setBorderWidth({ ...borderWidth, bottom: v }),
          left: (v) => setBorderWidth({ ...borderWidth, left: v }),
        },
        'width'
      )}

      {renderStyleControl()}
      {renderColorControl()}

      {renderInputGroup(
        'Border Radius',
        borderRadius,
        {
          topLeft: (v) => setBorderRadius({ ...borderRadius, topLeft: v }),
          topRight: (v) => setBorderRadius({ ...borderRadius, topRight: v }),
          bottomRight: (v) => setBorderRadius({ ...borderRadius, bottomRight: v }),
          bottomLeft: (v) => setBorderRadius({ ...borderRadius, bottomLeft: v }),
        },
        'radius'
      )}
    </div>
  );
};

export default BorderControls;