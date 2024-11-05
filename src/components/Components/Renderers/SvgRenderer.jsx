import React, { useRef } from 'react';

const SvgRenderer = ({ component, isViewMode }) => {
  const svgRef = useRef(null);
  const {
    style = {},
    props = {},
    content = null
  } = component;

  // Container styles - updated to ensure proper centering context
  const containerStyle = {
    position: 'relative',
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
    width: style.width || '24px',
    height: style.height || '24px',
    backgroundColor: style.backgroundColor || 'transparent',
    margin: style.margin || '0px',
    padding: style.padding || '0px',
  };

  // Process the SVG content to inject styling and centering attributes
  const processSvgContent = (content) => {
    if (!content || typeof content !== 'string') return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (!svg) return content;

    // Remove existing width/height/scale attributes
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    
    // Set new attributes for proper centering
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'); // This ensures the SVG content is centered
    
    // Apply fill color if specified in style
    if (style.fill) {
      svg.setAttribute('fill', style.fill);
      // Also apply fill to all child paths and shapes
      const elements = svg.querySelectorAll('path, rect, circle, ellipse, polygon, polyline');
      elements.forEach(element => {
        if (!element.getAttribute('fill') || element.getAttribute('fill') === 'none') {
          element.setAttribute('fill', style.fill);
        }
      });
    }

    // Apply stroke color if specified in style
    if (style.stroke) {
      svg.setAttribute('stroke', style.stroke);
      // Also apply stroke to all child paths and shapes
      const elements = svg.querySelectorAll('path, rect, circle, ellipse, polygon, polyline');
      elements.forEach(element => {
        if (!element.getAttribute('stroke') || element.getAttribute('stroke') === 'none') {
          element.setAttribute('stroke', style.stroke);
        }
      });
    }
    
    // Ensure viewBox exists and is properly set
    if (!svg.hasAttribute('viewBox')) {
      // Try to get original dimensions from the SVG
      const width = svg.getAttribute('originalWidth') || '16';
      const height = svg.getAttribute('originalHeight') || '16';
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
    
    return svg.outerHTML;
  };

  // SVG wrapper styles - updated for better centering
  const svgWrapperStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: `scale(${style.scale || 1}) rotate(${style.rotation || 0}deg)`,
    transformOrigin: 'center',
    transition: 'transform 0.2s ease-in-out',
    position: 'relative', // Added for proper centering
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
