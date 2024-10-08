import React, { useState, useEffect, useCallback, useRef } from 'react';
import ColorPicker from '../../common/ColorPicker';

const UNITS = ['px', '%', 'em', 'rem', 'vw', 'vh'];

const BorderControls = ({ style, onStyleChange }) => {
  const [showBorder, setShowBorder] = useState(true);
  const [borderWidth, setBorderWidth] = useState({ top: '0px', right: '0px', bottom: '0px', left: '0px' });
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState({ topLeft: '0px', topRight: '0px', bottomRight: '0px', bottomLeft: '0px' });
  const [allBorderWidth, setAllBorderWidth] = useState('0px');
  const [allBorderRadius, setAllBorderRadius] = useState('0px');

  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    if (style.borderWidth) {
      const [top, right, bottom, left] = style.borderWidth.split(' ');
      setBorderWidth({ top, right: right || top, bottom: bottom || top, left: left || right || top });
      setAllBorderWidth(top);
    }
    if (style.borderStyle) setBorderStyle(style.borderStyle);
    if (style.borderColor) setBorderColor(style.borderColor);
    if (style.borderRadius) {
      const [topLeft, topRight, bottomRight, bottomLeft] = style.borderRadius.split(' ');
      setBorderRadius({ topLeft, topRight: topRight || topLeft, bottomRight: bottomRight || topLeft, bottomLeft: bottomLeft || topRight || topLeft });
      setAllBorderRadius(topLeft);
    }
    setShowBorder(style.borderWidth !== '0px');
  }, [style]);

  const debouncedStyleChange = useCallback((updates) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      onStyleChange(updates);
    }, 100); // Adjust this delay as needed
  }, [onStyleChange]);

  const handleBorderChange = useCallback((property, value) => {
    let updates = {};
    if (property === 'width') {
      updates.borderWidth = `${value.top} ${value.right} ${value.bottom} ${value.left}`;
    } else if (property === 'radius') {
      updates.borderRadius = `${value.topLeft} ${value.topRight} ${value.bottomRight} ${value.bottomLeft}`;
    } else {
      updates[`border${property.charAt(0).toUpperCase() + property.slice(1)}`] = value;
    }
    debouncedStyleChange(updates);
  }, [debouncedStyleChange]);

  const handleAllBorderWidthChange = useCallback((value) => {
    setAllBorderWidth(value);
    const newBorderWidth = { top: value, right: value, bottom: value, left: value };
    setBorderWidth(newBorderWidth);
    handleBorderChange('width', newBorderWidth);
  }, [handleBorderChange]);

  const handleSingleBorderWidthChange = useCallback((side, value) => {
    setBorderWidth(prev => {
      const newBorderWidth = { ...prev, [side]: value };
      handleBorderChange('width', newBorderWidth);
      return newBorderWidth;
    });
  }, [handleBorderChange]);

  const handleAllBorderRadiusChange = useCallback((value) => {
    setAllBorderRadius(value);
    const newBorderRadius = { topLeft: value, topRight: value, bottomRight: value, bottomLeft: value };
    setBorderRadius(newBorderRadius);
    handleBorderChange('radius', newBorderRadius);
  }, [handleBorderChange]);

  const handleSingleBorderRadiusChange = useCallback((corner, value) => {
    setBorderRadius(prev => {
      const newBorderRadius = { ...prev, [corner]: value || '0px' };
      handleBorderChange('radius', newBorderRadius);
      return newBorderRadius;
    });
  }, [handleBorderChange]);

  const handleKeyDown = useCallback((e, setValue, currentValue) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      let numericPart = 0;
      let unit = 'px';

      if (currentValue) {
        const match = currentValue.match(/^(\d*\.?\d+)(\D*)$/);
        if (match) {
          numericPart = parseFloat(match[1]);
          unit = match[2] || 'px';
        }
      }

      let newValue = numericPart;

      if (e.key === 'ArrowUp') {
        newValue += step;
      } else {
        newValue = Math.max(0, newValue - step);
      }

      setValue(`${newValue}${unit}`);
    }
  }, []);

  const toggleBorder = useCallback(() => {
    setShowBorder(prev => !prev);
    if (showBorder) {
      // If turning off the border, save the current state and set border to none
      onStyleChange({
        borderWidth: '0px',
        borderStyle: 'none',
        borderColor: 'transparent',
        borderRadius: '0px'
      });
    } else {
      // If turning on the border, restore the previous state
      onStyleChange({
        borderWidth: `${borderWidth.top} ${borderWidth.right} ${borderWidth.bottom} ${borderWidth.left}`,
        borderStyle,
        borderColor,
        borderRadius: `${borderRadius.topLeft} ${borderRadius.topRight} ${borderRadius.bottomRight} ${borderRadius.bottomLeft}`
      });
    }
  }, [showBorder, borderWidth, borderStyle, borderColor, borderRadius, onStyleChange]);

  const buttonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border flex-grow text-center";
  const activeButtonClass = `${buttonClass} bg-[#cce7ff] text-blue-700 border-blue-300`;
  const inactiveButtonClass = `${buttonClass} bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]`;

  const renderInput = (side, value, setter, property) => (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1">{side}</span>
      <div className="flex">
        <input
          type="text"
          value={value.replace(/[^\d.-]/g, '')}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/^0+/, '');
            const newValue = (numericValue || '0') + (value.match(/[a-z%]+/i) || 'px');
            setter(newValue);
            if (property.includes('Width')) {
              handleSingleBorderWidthChange(side.toLowerCase(), newValue);
            } else {
              handleSingleBorderRadiusChange(side.toLowerCase().replace(' ', ''), newValue);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, 
            (newValue) => property.includes('Width')
              ? handleSingleBorderWidthChange(side.toLowerCase(), newValue)
              : handleSingleBorderRadiusChange(side.toLowerCase().replace(' ', ''), newValue),
            value
          )}
          className="w-12 p-1 text-xs border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={value.match(/[a-z%]+/i) || 'px'}
          onChange={(e) => {
            const numericPart = value.replace(/[^\d.-]/g, '') || '0';
            const newValue = numericPart + e.target.value;
            setter(newValue);
            if (property.includes('Width')) {
              handleSingleBorderWidthChange(side.toLowerCase(), newValue);
            } else {
              handleSingleBorderRadiusChange(side.toLowerCase().replace(' ', ''), newValue);
            }
          }}
          className="p-1 text-xs border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderInputGroup = (label, values, setters, properties) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      {(label === 'Border Width' || label === 'Border Radius') && (
        <div className="flex mb-2">
          <input
            type="text"
            value={(label === 'Border Width' ? allBorderWidth : allBorderRadius).split(/(\d+)/)[1] || ''}
            onChange={(e) => {
              const newValue = e.target.value + ((label === 'Border Width' ? allBorderWidth : allBorderRadius).split(/(\d+)/)[2] || 'px');
              if (label === 'Border Width') {
                handleAllBorderWidthChange(newValue);
              } else {
                handleAllBorderRadiusChange(newValue);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, 
              label === 'Border Width' ? handleAllBorderWidthChange : handleAllBorderRadiusChange, 
              label === 'Border Width' ? allBorderWidth : allBorderRadius
            )}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={label === 'Border Width' ? "All sides" : "All corners"}
          />
          <select
            value={(label === 'Border Width' ? allBorderWidth : allBorderRadius).split(/(\d+)/)[2] || 'px'}
            onChange={(e) => {
              const newValue = ((label === 'Border Width' ? allBorderWidth : allBorderRadius).split(/(\d+)/)[1] || '0') + e.target.value;
              if (label === 'Border Width') {
                handleAllBorderWidthChange(newValue);
              } else {
                handleAllBorderRadiusChange(newValue);
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
      )}
      <div className="grid grid-cols-4 gap-x-0 gap-y-1 w-42 mx-auto">
        <div className="col-start-2 col-span-2">
          {renderInput(label === 'Border Width' ? 'Top' : 'Top Left', values[label === 'Border Width' ? 'top' : 'topLeft'], setters[label === 'Border Width' ? 'top' : 'topLeft'], properties)}
        </div>
        <div className="col-start-1 col-span-2 row-start-2 justify-self-end pr-2">
          {renderInput(label === 'Border Width' ? 'Left' : 'Bottom Left', values[label === 'Border Width' ? 'left' : 'bottomLeft'], setters[label === 'Border Width' ? 'left' : 'bottomLeft'], properties)}
        </div>
        <div className="col-start-3 col-span-2 row-start-2 justify-self-start pl-2">
          {renderInput(label === 'Border Width' ? 'Right' : 'Top Right', values[label === 'Border Width' ? 'right' : 'topRight'], setters[label === 'Border Width' ? 'right' : 'topRight'], properties)}
        </div>
        <div className="col-start-2 col-span-2 row-start-3">
          {renderInput(label === 'Border Width' ? 'Bottom' : 'Bottom Right', values[label === 'Border Width' ? 'bottom' : 'bottomRight'], setters[label === 'Border Width' ? 'bottom' : 'bottomRight'], properties)}
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

      <div className="mb-4">
        <button
          onClick={toggleBorder}
          className={showBorder ? activeButtonClass : inactiveButtonClass}
        >
          {showBorder ? 'Border' : 'Border'}
        </button>
      </div>

      {showBorder && (
        <>
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
        </>
      )}
    </div>
  );
};

export default BorderControls;