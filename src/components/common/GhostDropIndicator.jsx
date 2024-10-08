import React from 'react';

const GhostDropIndicator = ({ position, width, height, isFlexContainer, flexDirection }) => {
  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: 'rgba(0, 0, 255, 0.2)',
    border: '2px dashed blue',
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
  };

  if (isFlexContainer) {
    style.display = 'flex';
    style.flexDirection = flexDirection;
    style.alignItems = 'center';
    style.justifyContent = 'center';
  }

  return (
    <div style={style}>
      {isFlexContainer && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'blue',
          fontWeight: 'bold',
          fontSize: '12px',
          textAlign: 'center',
        }}>
          Drop here
        </div>
      )}
    </div>
  );
};

export default GhostDropIndicator;