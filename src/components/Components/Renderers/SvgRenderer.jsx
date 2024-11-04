import React, { useRef, useCallback } from 'react';

const SvgRenderer = ({ component, isViewMode, onUpdate }) => {
  const svgRef = useRef(null);
  const {
    style = {},
    props = {},
    content = null
  } = component;

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: style.width || '100px',
    height: style.height || '100px',
    backgroundColor: style.backgroundColor || 'transparent',
    borderRadius: style.borderRadius || props.borderRadius || '4px',
    boxShadow: style.boxShadow,
    border: style.border,
    flexGrow: style.flexGrow || '1',
    flexShrink: style.flexShrink || '1',
    flexBasis: style.flexBasis || 'auto',
    margin: '0px',
    padding: style.padding || '0px',
  };

  const svgStyle = {
    width: '100%',
    height: '100%',
    objectFit: style.objectFit || props.objectFit || 'contain',
    transform: `
      scale(${style.scale || 1})
      rotate(${style.rotation || 0}deg)
    `,
    fill: style.fill || props.fill || 'currentColor',
    stroke: style.stroke || props.stroke,
    strokeWidth: style.strokeWidth || props.strokeWidth,
  };

  return (
    <div style={containerStyle}>
      <div
        ref={svgRef}
        style={svgStyle}
        dangerouslySetInnerHTML={{ 
          __html: content?.trim() || ''
        }}
      />
    </div>
  );
};

export default React.memo(SvgRenderer);
