import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SpacingPreview = ({ padding, margin, gap }) => {
    const [isExpanded, setIsExpanded] = useState(true);
  const containerStyle = {
    width: '100%',
    height: '200px',
    border: '1px solid #ccc',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  };

  const marginStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '2px dashed #4CAF50',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    color: '#4CAF50',
  };

  const paddingStyle = {
    backgroundColor: '#E3F2FD',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: '12px',
    color: '#1976D2',
  };

  const contentStyle = {
    backgroundColor: '#FFF',
    padding: '10px',
    border: '1px solid #1976D2',
  };

  const labelStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2px 4px',
    borderRadius: '2px',
    fontSize: '10px',
  };

  // Parse padding and margin values
  const parsedPadding = {
    top: padding.paddingTop || '0px',
    right: padding.paddingRight || '0px',
    bottom: padding.paddingBottom || '0px',
    left: padding.paddingLeft || '0px',
  };

  const parsedMargin = {
    top: margin.marginTop || '0px',
    right: margin.marginRight || '0px',
    bottom: margin.marginBottom || '0px',
    left: margin.marginLeft || '0px',
  };

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
          {/* Existing preview content */}
          <div style={{
            ...marginStyle,
            top: parsedMargin.top,
            right: parsedMargin.right,
            bottom: parsedMargin.bottom,
            left: parsedMargin.left,
          }}>
            <div style={{
              ...paddingStyle,
              padding: `${parsedPadding.top} ${parsedPadding.right} ${parsedPadding.bottom} ${parsedPadding.left}`,
            }}>
              <div style={contentStyle}>Content</div>
              {gap && (
                <div style={{ marginTop: gap, fontSize: '12px', color: '#1976D2' }}>Gap: {gap}</div>
              )}
            </div>
          </div>
          
          {/* Margin Labels */}
          <div style={{ ...labelStyle, top: '2px', left: '50%', transform: 'translateX(-50%)' }}>
            Margin Top: {parsedMargin.top}
          </div>
          <div style={{ ...labelStyle, bottom: '2px', left: '50%', transform: 'translateX(-50%)' }}>
            Margin Bottom: {parsedMargin.bottom}
          </div>
          <div style={{ ...labelStyle, left: '2px', top: '50%', transform: 'translateY(-50%)' }}>
            Margin Left: {parsedMargin.left}
          </div>
          <div style={{ ...labelStyle, right: '2px', top: '50%', transform: 'translateY(-50%)' }}>
            Margin Right: {parsedMargin.right}
          </div>

          {/* Padding Labels */}
          <div style={{ ...labelStyle, top: parsedMargin.top, left: '50%', transform: 'translateX(-50%)' }}>
            Padding Top: {parsedPadding.top}
          </div>
          <div style={{ ...labelStyle, bottom: parsedMargin.bottom, left: '50%', transform: 'translateX(-50%)' }}>
            Padding Bottom: {parsedPadding.bottom}
          </div>
          <div style={{ ...labelStyle, left: parsedMargin.left, top: '50%', transform: 'translateY(-50%)' }}>
            Padding Left: {parsedPadding.left}
          </div>
          <div style={{ ...labelStyle, right: parsedMargin.right, top: '50%', transform: 'translateY(-50%)' }}>
            Padding Right: {parsedPadding.right}
          </div>
        </div>
      )}
    </div>
  );
};
export default SpacingPreview;