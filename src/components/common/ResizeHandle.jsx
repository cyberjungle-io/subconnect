import React, { useState, useCallback, useEffect } from 'react';

const ResizeHandle = ({ onResize, isHorizontal, currentSize, currentUnit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(null);

  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize(currentSize);
  }, [currentSize]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || startSize === null) return;

    const delta = isHorizontal ? e.clientX - startPos.x : e.clientY - startPos.y;
    let newSize;

    if (currentUnit === '%') {
      const parentSize = isHorizontal ? window.innerWidth : window.innerHeight;
      const percentDelta = (delta / parentSize) * 100;
      newSize = Math.max(10, startSize + percentDelta);
    } else {
      const smoothingFactor = isHorizontal ? 1 : 0.9;
      newSize = Math.max(50, startSize + (delta * smoothingFactor));
    }

    const maxSize = currentUnit === '%' ? 100 : 2000;
    newSize = Math.min(maxSize, newSize);
    newSize = Math.round(newSize);

    onResize(newSize, currentUnit);
  }, [isDragging, startPos, startSize, onResize, isHorizontal, currentUnit]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setStartSize(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleStyle = {
    position: 'absolute',
    background: isDragging ? '#2b6cb0' : '#4299e1',
    opacity: isDragging ? 0.9 : 0.7,
    cursor: isHorizontal ? 'ew-resize' : 'ns-resize',
    ...(isHorizontal
      ? { top: 0, right: '-4px', width: '8px', height: '100%' }
      : { bottom: '-4px', left: 0, height: '8px', width: '100%' }),
    transition: 'background-color 0.2s',
    zIndex: 0,
  };

  return (
    <div 
      style={handleStyle} 
      onMouseDown={handleMouseDown}
      title={`Drag to resize (Current: ${Math.round(currentSize)}${currentUnit})`}
    />
  );
};

export default ResizeHandle;