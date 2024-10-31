import React, { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../../../features/editorSlice';

const ImageRenderer = ({ component, isViewMode }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Extract styles and props
  const {
    style = {},
    props = {},
    content: imageUrl = component.defaultContent || 'https://via.placeholder.com/200'
  } = component;

  // Separate container styles from image transformation styles
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: style.backgroundColor || 'transparent',
    borderRadius: style.borderRadius || '4px',
    boxShadow: style.boxShadow,
    border: style.border,
    transform: 'none',
  };

  // Image-specific styles for transformations
  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: style.width || '100%',
    height: style.height || '100%',
    objectFit: style.objectFit || 'contain',
    objectPosition: style.objectPosition || 'center',
    transform: style.imageTransform || 'scale(1)',
    transition: 'transform 0.2s ease-in-out',
    transformOrigin: 'center center',
  };

  // Handle image load error
  const handleError = useCallback(() => {
    setError('Failed to load image');
    setIsLoading(false);
  }, []);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

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
      />
    </div>
  );
};

export default React.memo(ImageRenderer);
