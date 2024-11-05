import React, { useRef } from 'react';

const SvgRenderer = ({ component, isViewMode }) => {
  const svgRef = useRef(null);
  const {
    style = {},
    props = {},
    content = null
  } = component;

  // Container styles - use explicit pixel values for width/height
  const containerStyle = {
    position: 'relative',
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: style.width || '24px',
    height: style.height || '24px',
    backgroundColor: style.backgroundColor || 'transparent',
    margin: style.margin || '0px',
    padding: style.padding || '0px',
  };

  // Process the SVG content to inject styling
  const processSvgContent = (content) => {
    if (!content || typeof content !== 'string') return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (!svg) return content;

    // Remove existing width/height/scale attributes
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    
    // Set new attributes
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    
    // Ensure viewBox exists
    if (!svg.hasAttribute('viewBox')) {
      svg.setAttribute('viewBox', '0 0 16 16');
    }
    
    return svg.outerHTML;
  };

  // SVG wrapper styles - handle scale separately
  const svgWrapperStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: `scale(${style.scale || 1})`,
    transformOrigin: 'center',
    transition: 'transform 0.2s ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <div
        ref={svgRef}
        style={svgWrapperStyle}
        dangerouslySetInnerHTML={{ 
          __html: processSvgContent(content?.trim() || '')
        }}
      />
    </div>
  );
};

export default React.memo(SvgRenderer);
