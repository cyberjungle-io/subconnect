import React, { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../../../features/editorSlice';
import SvgRenderer from './SvgRenderer';

const ImageRenderer = ({ component, isViewMode, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Extract styles and props from component config
  const {
    style = {},
    props = {},
    content = null
  } = component;

  // Update how we determine the imageUrl
  const imageUrl = content || props.defaultContent || 'https://via.placeholder.com/200';

  // Container styles following component config defaults
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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

  // Image-specific styles
  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: props.keepAspectRatio ? 'auto' : '100%',
    height: props.keepAspectRatio ? 'auto' : '100%',
    objectFit: style.objectFit || props.objectFit || 'contain',
    objectPosition: style.objectPosition || '50% 50%',
    borderRadius: props.shape === 'circle' ? '50%' : (style.borderRadius || props.borderRadius || '4px'),
    opacity: style.opacity || 1,
    transition: 'transform 0.2s ease-in-out, object-position 0.2s ease-in-out',
    transform: `scale(${style.scale || 1})`,
    pointerEvents: 'none',
  };

  const handleError = useCallback(() => {
    setError('Failed to load image');
    setIsLoading(false);
    if (onUpdate) {
      onUpdate(component.id, {
        props: { ...props, error: 'Failed to load image' }
      });
    }
  }, [component.id, onUpdate, props]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    if (onUpdate) {
      onUpdate(component.id, {
        props: { ...props, error: null }
      });
    }
  }, [component.id, onUpdate, props]);

  // Update the SVG detection and add debugging
  const isSvg = component.props?.isSvg || 
    (component.content && 
     typeof component.content === 'string' && 
     component.content.includes('<svg'));

  // Add debug logging
  console.log('ImageRenderer SVG Detection:', {
    isSvg,
    componentProps: component.props,
    content: component.content,
    hasSvgTag: component.content?.includes('<svg')
  });

  if (isSvg) {
    console.log('ImageRenderer switching to SVG Renderer');
    return <SvgRenderer component={component} isViewMode={isViewMode} onUpdate={onUpdate} />;
  }

  if (isLoading) {
    return (
      <div style={containerStyle} className="animate-pulse bg-gray-200">
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle} className="bg-red-50">
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  console.log('Image style:', {
    objectFit: style.objectFit,
    objectPosition: style.objectPosition
  });

  return (
    <div ref={containerRef} style={containerStyle}>
      <img
        ref={imageRef}
        src={imageUrl}
        alt={props.alt || 'Image'}
        style={imageStyle}
        onError={handleError}
        onLoad={handleLoad}
        draggable={false}
        className={props.className}
      />
    </div>
  );
};

export default React.memo(ImageRenderer);
