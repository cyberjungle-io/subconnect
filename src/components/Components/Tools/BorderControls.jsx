import React, { useState, useEffect, useCallback, useRef } from 'react';
import ColorPicker from '../../common/ColorPicker';
import { FaLink, FaUnlink } from 'react-icons/fa'; // Import chain link icons

const UNITS = ['px', '%', 'em', 'rem', 'vw', 'vh'];

const BorderControls = ({ style, onStyleChange }) => {
  const [showBorder, setShowBorder] = useState(true);
  const [showInnerShadow, setShowInnerShadow] = useState(false);
  const [showOuterShadow, setShowOuterShadow] = useState(false);
  const [borderWidth, setBorderWidth] = useState({ top: '1px', right: '1px', bottom: '1px', left: '1px' });
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState({ topLeft: '1px', topRight: '1px', bottomRight: '1px', bottomLeft: '1px' });
  const [allBorderWidth, setAllBorderWidth] = useState('1px');
  const [allBorderRadius, setAllBorderRadius] = useState('1px');
  const [showAllBorderWidth, setShowAllBorderWidth] = useState(true);
  const [showAllBorderRadius, setShowAllBorderRadius] = useState(true);
  const [previousBorderState, setPreviousBorderState] = useState(null);

  const updateTimeoutRef = useRef(null);

  // Add shadow state variables
  const [innerShadowOffset, setInnerShadowOffset] = useState({ x: '0px', y: '0px' });
  const [innerShadowBlur, setInnerShadowBlur] = useState('0px');
  const [innerShadowColor, setInnerShadowColor] = useState('#000000');
  const [innerShadowOpacity, setInnerShadowOpacity] = useState(0.2);

  const [outerShadowOffset, setOuterShadowOffset] = useState({ x: '0px', y: '0px' });
  const [outerShadowBlur, setOuterShadowBlur] = useState('0px');
  const [outerShadowColor, setOuterShadowColor] = useState('#000000');
  const [outerShadowOpacity, setOuterShadowOpacity] = useState(0.2);

  // Button classes
  const activeButtonClass = "px-4 py-2 bg-blue-500 text-white rounded-md mr-2";
  const inactiveButtonClass = "px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2";

  useEffect(() => {
    if (style.borderWidth) {
      const [top, right, bottom, left] = style.borderWidth.split(' ');
      setBorderWidth({ top, right: right || top, bottom: bottom || top, left: left || right || top });
      setAllBorderWidth(top);
    } else {
      setBorderWidth({ top: '1px', right: '1px', bottom: '1px', left: '1px' });
      setAllBorderWidth('1px');
    }
    if (style.borderStyle) setBorderStyle(style.borderStyle);
    if (style.borderColor) setBorderColor(style.borderColor);
    if (style.borderRadius) {
      const [topLeft, topRight, bottomRight, bottomLeft] = style.borderRadius.split(' ');
      setBorderRadius({ topLeft, topRight: topRight || topLeft, bottomRight: bottomRight || topLeft, bottomLeft: bottomLeft || topRight || topLeft });
      setAllBorderRadius(topLeft);
    } else {
      setBorderRadius({ topLeft: '1px', topRight: '1px', bottomRight: '1px', bottomLeft: '1px' });
      setAllBorderRadius('1px');
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
    onStyleChange(updates);
  }, [onStyleChange]);

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

  const handleIndividualInputKeyDown = useCallback((e, side, currentValue, property) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      let numericPart = parseFloat(currentValue) || 0;
      const unit = currentValue.replace(/[^a-z%]+/i, '') || 'px';

      if (e.key === 'ArrowUp') {
        numericPart += step;
      } else {
        numericPart = Math.max(0, numericPart - step);
      }

      const newValue = `${numericPart}${unit}`;
      
      if (property === 'width') {
        handleSingleBorderWidthChange(side, newValue);
      } else {
        handleSingleBorderRadiusChange(side, newValue);
      }
    }
  }, [handleSingleBorderWidthChange, handleSingleBorderRadiusChange]);

  const toggleBorder = useCallback(() => {
    setShowBorder(prev => !prev);
    if (showBorder) {
      // If turning off the border, save the current state and set border to none
      setPreviousBorderState({
        borderWidth: `${borderWidth.top} ${borderWidth.right} ${borderWidth.bottom} ${borderWidth.left}`,
        borderStyle,
        borderColor,
        borderRadius: `${borderRadius.topLeft} ${borderRadius.topRight} ${borderRadius.bottomRight} ${borderRadius.bottomLeft}`
      });
      onStyleChange({
        borderWidth: '0px',
        borderStyle: 'none',
        borderColor: 'transparent',
        borderRadius: '0px'
      });
    } else {
      // If turning on the border, restore the previous state or use default values
      const newState = previousBorderState || {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#000000',
        borderRadius: '0px'
      };
      onStyleChange(newState);
      
      // Update local state
      const [top, right, bottom, left] = newState.borderWidth.split(' ');
      setBorderWidth({ top, right: right || top, bottom: bottom || top, left: left || right || top });
      setBorderStyle(newState.borderStyle);
      setBorderColor(newState.borderColor);
      const [topLeft, topRight, bottomRight, bottomLeft] = newState.borderRadius.split(' ');
      setBorderRadius({ topLeft, topRight: topRight || topLeft, bottomRight: bottomRight || topLeft, bottomLeft: bottomLeft || topRight || topLeft });
    }
  }, [showBorder, borderWidth, borderStyle, borderColor, borderRadius, onStyleChange]);

  // Add shadow handlers
  const handleInnerShadowChange = useCallback(() => {
    const innerShadow = showInnerShadow ? 
      `inset ${innerShadowOffset.x} ${innerShadowOffset.y} ${innerShadowBlur} ${adjustColorOpacity(innerShadowColor, innerShadowOpacity)}` : 
      '';
    
    const outerShadow = showOuterShadow ? 
      `${outerShadowOffset.x} ${outerShadowOffset.y} ${outerShadowBlur} ${adjustColorOpacity(outerShadowColor, outerShadowOpacity)}` : 
      '';

    const boxShadow = [innerShadow, outerShadow].filter(Boolean).join(', ');
    
    onStyleChange({
      ...style,
      boxShadow
    });
  }, [showInnerShadow, showOuterShadow, innerShadowOffset, outerShadowOffset, innerShadowBlur, outerShadowBlur, innerShadowColor, outerShadowColor, innerShadowOpacity, outerShadowOpacity]);

  // Helper function to adjust color opacity
  const adjustColorOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const renderInput = (side, value, setter, property) => (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1 text-center">{side}</span>
      <div className="flex">
        <input
          type="text"
          value={value ? value.replace(/[^\d.-]/g, '') : '1'}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/^0+/, '');
            const newValue = (numericValue || '1') + (value?.match(/[a-z%]+/i) || 'px');
            setter(newValue);
            if (property === 'width') {
              handleSingleBorderWidthChange(side.toLowerCase(), newValue);
            } else {
              handleSingleBorderRadiusChange(side.toLowerCase().replace(' ', ''), newValue);
            }
          }}
          onKeyDown={(e) => handleIndividualInputKeyDown(e, side.toLowerCase().replace(' ', ''), value, property)}
          className="w-12 p-1 text-xs border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={value?.match(/[a-z%]+/i) || 'px'}
          onChange={(e) => {
            const numericPart = value?.replace(/[^\d.-]/g, '') || '1';
            const newValue = numericPart + e.target.value;
            setter(newValue);
            if (property === 'width') {
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

  const toggleAllBorderWidth = () => {
    setShowAllBorderWidth(prev => {
      if (prev) {
        // Switching to individual view, ensure all sides have a value
        setBorderWidth(current => ({
          top: current.top || allBorderWidth,
          right: current.right || allBorderWidth,
          bottom: current.bottom || allBorderWidth,
          left: current.left || allBorderWidth
        }));
      }
      return !prev;
    });
  };

  const toggleAllBorderRadius = () => {
    setShowAllBorderRadius(prev => {
      if (prev) {
        // Switching to individual view, ensure all corners have a value
        setBorderRadius(current => ({
          topLeft: current.topLeft || allBorderRadius,
          topRight: current.topRight || allBorderRadius,
          bottomRight: current.bottomRight || allBorderRadius,
          bottomLeft: current.bottomLeft || allBorderRadius
        }));
      }
      return !prev;
    });
  };

  const renderInputGroup = (label, values, setters, property) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
        <button
          onClick={() => label === 'Border Width' ? toggleAllBorderWidth() : toggleAllBorderRadius()}
          className="p-1 rounded-md transition-colors duration-200"
        >
          {(label === 'Border Width' ? showAllBorderWidth : showAllBorderRadius) ? 
            <FaLink className="w-3 h-3 text-gray-400" /> : 
            <FaUnlink className="w-3 h-3 text-gray-400" />
          }
        </button>
      </div>
      {(label === 'Border Width' ? showAllBorderWidth : showAllBorderRadius) ? (
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
      ) : (
        <div className="grid grid-cols-3 gap-1 w-42 mx-auto">
          {label === 'Border Width' ? (
            <>
              <div className="col-start-2">{renderInput('Top', values.top, setters.top, property)}</div>
              <div className="col-start-1 row-start-2">{renderInput('Left', values.left, setters.left, property)}</div>
              <div className="col-start-3 row-start-2">{renderInput('Right', values.right, setters.right, property)}</div>
              <div className="col-start-2 row-start-3">{renderInput('Bottom', values.bottom, setters.bottom, property)}</div>
            </>
          ) : (
            <>
              <div className="col-span-3 row-start-1 flex justify-between px-4">
                <div className='me-2'>{renderInput('Top Left', values.topLeft, setters.topLeft, property)}</div>
                <div className='ms-2'>{renderInput('Top Right', values.topRight, setters.topRight, property)}</div>
              </div>
              <div className="col-span-3 row-start-3 flex justify-between px-4">
                <div className='me-2'>{renderInput('Bottom Left', values.bottomLeft, setters.bottomLeft, property)}</div>
                <div className='ms-2'>{renderInput('Bottom Right', values.bottomRight, setters.bottomRight, property)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  const toggleContent = (
    <div className="mb-4">
      <button
        onClick={toggleBorder}
        className={showBorder ? activeButtonClass : inactiveButtonClass}
      >
        {showBorder ? 'Border' : 'Border'}
      </button>
    </div>
  );

  const styleContent = (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
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

  const widthContent = (
    <div className="mb-4">
      {renderInputGroup(
        'Border Width',
        borderWidth,
        {
          top: (v) => handleSingleBorderWidthChange('top', v),
          right: (v) => handleSingleBorderWidthChange('right', v),
          bottom: (v) => handleSingleBorderWidthChange('bottom', v),
          left: (v) => handleSingleBorderWidthChange('left', v),
        },
        'width'
      )}
    </div>
  );

  const radiusContent = (
    <div className="mb-4">
      {renderInputGroup(
        'Border Radius',
        borderRadius,
        {
          topLeft: (v) => handleSingleBorderRadiusChange('topLeft', v),
          topRight: (v) => handleSingleBorderRadiusChange('topRight', v),
          bottomRight: (v) => handleSingleBorderRadiusChange('bottomRight', v),
          bottomLeft: (v) => handleSingleBorderRadiusChange('bottomLeft', v),
        },
        'radius'
      )}
    </div>
  );

  const colorContent = (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
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
    <div className="border-controls space-y-4">
      <div className="flex mb-4">
        <button
          onClick={() => setShowBorder(prev => !prev)}
          className={showBorder ? activeButtonClass : inactiveButtonClass}
        >
          Border
        </button>
        <button
          onClick={() => setShowInnerShadow(prev => !prev)}
          className={showInnerShadow ? activeButtonClass : inactiveButtonClass}
        >
          Inner Shadow
        </button>
        <button
          onClick={() => setShowOuterShadow(prev => !prev)}
          className={showOuterShadow ? activeButtonClass : inactiveButtonClass}
        >
          Outer Shadow
        </button>
      </div>

      {/* Existing border controls */}
      {showBorder && (
        <>
          {styleContent}
          {widthContent}
          {radiusContent}
          {colorContent}
        </>
      )}

      {/* Inner Shadow Controls */}
      {showInnerShadow && (
        <div className="shadow-controls space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Offset X</label>
              <input
                type="text"
                value={innerShadowOffset.x}
                onChange={(e) => {
                  setInnerShadowOffset(prev => ({ ...prev, x: e.target.value }));
                  handleInnerShadowChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Offset Y</label>
              <input
                type="text"
                value={innerShadowOffset.y}
                onChange={(e) => {
                  setInnerShadowOffset(prev => ({ ...prev, y: e.target.value }));
                  handleInnerShadowChange();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blur</label>
            <input
              type="text"
              value={innerShadowBlur}
              onChange={(e) => {
                setInnerShadowBlur(e.target.value);
                handleInnerShadowChange();
              }}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <ColorPicker
              color={innerShadowColor}
              onChange={(color) => {
                setInnerShadowColor(color);
                handleInnerShadowChange();
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={innerShadowOpacity}
              onChange={(e) => {
                setInnerShadowOpacity(parseFloat(e.target.value));
                handleInnerShadowChange();
              }}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Outer Shadow Controls */}
      {showOuterShadow && (
        <div className="shadow-controls space-y-4">
          {/* Similar controls as inner shadow, but using outer shadow state variables */}
        </div>
      )}
    </div>
  );
};

export default BorderControls;
