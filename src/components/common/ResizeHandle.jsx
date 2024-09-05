import React, { useState, useCallback, useEffect } from 'react';

const ResizeHandle = ({ onResize, isHorizontal, currentSize, currentUnit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const delta = isHorizontal ? e.clientX - startPos.x : e.clientY - startPos.y;
    let newSize;

    if (currentUnit === '%') {
      const parentSize = isHorizontal ? window.innerWidth : window.innerHeight;
      const percentDelta = (delta / parentSize) * 100;
      newSize = Math.max(0, currentSize + percentDelta);
    } else {
      newSize = Math.max(0, currentSize + delta);
    }

    onResize(newSize, currentUnit);
    setStartPos({ x: e.clientX, y: e.clientY });
  }, [isDragging, startPos, onResize, isHorizontal, currentSize, currentUnit]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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
    background: '#4299e1', // Change color to a more visible blue
    opacity: 0.7,
    cursor: isHorizontal ? 'ew-resize' : 'ns-resize',
    ...(isHorizontal
      ? { top: 0, right: '-4px', width: '8px', height: '100%' }
      : { bottom: '-4px', left: 0, height: '8px', width: '100%' }),
  };

  return <div style={handleStyle} onMouseDown={handleMouseDown} />;
};

export default ResizeHandle;