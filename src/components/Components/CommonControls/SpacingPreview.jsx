import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SpacingPreview = ({ padding, margin, dimensions, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingValue, setEditingValue] = useState(null);
  const [scale, setScale] = useState(1);

  // Parse padding, margin, and dimension values
  const parsePx = (value) => parseInt(value, 10) || 0;
  const parsedPadding = {
    top: parsePx(padding.paddingTop),
    right: parsePx(padding.paddingRight),
    bottom: parsePx(padding.paddingBottom),
    left: parsePx(padding.paddingLeft),
  };

  const parsedMargin = {
    top: parsePx(margin.marginTop),
    right: parsePx(margin.marginRight),
    bottom: parsePx(margin.marginBottom),
    left: parsePx(margin.marginLeft),
  };

  const parsedDimensions = {
    width: parsePx(dimensions.width),
    height: parsePx(dimensions.height),
  };

  // Calculate total width and height
  const totalWidth = parsedMargin.left + parsedPadding.left + parsedDimensions.width + parsedPadding.right + parsedMargin.right;
  const totalHeight = parsedMargin.top + parsedPadding.top + parsedDimensions.height + parsedPadding.bottom + parsedMargin.bottom;

  // Calculate scale factor
  useEffect(() => {
    const containerWidth = 280; // Adjust based on your container size
    const containerHeight = 200; // Adjust based on your container size
    const widthScale = containerWidth / totalWidth;
    const heightScale = containerHeight / totalHeight;
    setScale(Math.min(widthScale, heightScale, 1)); // Ensure scale is not greater than 1
  }, [totalWidth, totalHeight]);

  const containerStyle = {
    width: '100%',
    height: '220px',
    border: '1px solid #ccc',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  };

  const marginColor = 'rgba(246, 178, 107, 0.5)';  // Light orange
  const paddingColor = 'rgba(147, 196, 125, 0.5)'; // Light green
  const contentColor = 'rgba(111, 168, 220, 0.5)'; // Light blue

  const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    width: `${totalWidth}px`,
    height: `${totalHeight}px`,
    display: 'flex',
    flexDirection: 'column',
  };

  const createLayerStyle = (color) => ({
    backgroundColor: color,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  });

  const marginStyle = createLayerStyle(marginColor);
  const paddingStyle = createLayerStyle(paddingColor);
  const contentStyle = createLayerStyle(contentColor);

  const labelStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2px 4px',
    borderRadius: '2px',
    fontSize: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const handleDoubleClick = (property, value) => {
    setEditingValue({ property, value });
  };

  const handleValueChange = (e) => {
    if (e.key === 'Enter') {
      onUpdate(editingValue.property, `${e.target.value}px`);
      setEditingValue(null);
    }
  };

  const renderLabel = (text, property, style) => (
    <div
      style={{...labelStyle, ...style}}
      onDoubleClick={() => handleDoubleClick(property, text)}
    >
      {editingValue && editingValue.property === property ? (
        <input
          type="text"
          defaultValue={editingValue.value}
          onKeyPress={handleValueChange}
          onBlur={() => setEditingValue(null)}
          autoFocus
          style={{ width: '40px' }}
        />
      ) : (
        text
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded transition-colors duration-200 text-gray-700 hover:bg-gray-200"
          title={isExpanded ? "Collapse spacing preview" : "Expand spacing preview"}
        >
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        <h3 className="text-lg font-medium text-gray-900 ml-3">Preview</h3>
      </div>
      
      {isExpanded && (
        <div style={containerStyle}>
          <div style={boxStyle}>
            <div style={{...marginStyle, height: parsedMargin.top}}>
              {renderLabel(`${parsedMargin.top}px`, 'marginTop', {top: '2px', left: '50%', transform: 'translateX(-50%)'})}
            </div>
            <div style={{display: 'flex', flex: 1}}>
              <div style={{...marginStyle, width: parsedMargin.left}}>
                {renderLabel(`${parsedMargin.left}px`, 'marginLeft', {left: '2px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center'})}
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <div style={{...paddingStyle, height: parsedPadding.top}}>
                  {renderLabel(`${parsedPadding.top}px`, 'paddingTop', {top: '2px', left: '50%', transform: 'translateX(-50%)'})}
                </div>
                <div style={{display: 'flex', flex: 1}}>
                  <div style={{...paddingStyle, width: parsedPadding.left}}>
                    {renderLabel(`${parsedPadding.left}px`, 'paddingLeft', {left: '2px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center'})}
                  </div>
                  <div style={{...contentStyle, flex: 1, position: 'relative'}}>
                    {renderLabel(`${parsedDimensions.width}x${parsedDimensions.height}`, 'dimensions', {top: '50%', left: '50%', transform: 'translate(-50%, -50%)'})}
                  </div>
                  <div style={{...paddingStyle, width: parsedPadding.right}}>
                    {renderLabel(`${parsedPadding.right}px`, 'paddingRight', {right: '2px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'right center'})}
                  </div>
                </div>
                <div style={{...paddingStyle, height: parsedPadding.bottom}}>
                  {renderLabel(`${parsedPadding.bottom}px`, 'paddingBottom', {bottom: '2px', left: '50%', transform: 'translateX(-50%)'})}
                </div>
              </div>
              <div style={{...marginStyle, width: parsedMargin.right}}>
                {renderLabel(`${parsedMargin.right}px`, 'marginRight', {right: '2px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'right center'})}
              </div>
            </div>
            <div style={{...marginStyle, height: parsedMargin.bottom}}>
              {renderLabel(`${parsedMargin.bottom}px`, 'marginBottom', {bottom: '2px', left: '50%', transform: 'translateX(-50%)'})}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacingPreview;