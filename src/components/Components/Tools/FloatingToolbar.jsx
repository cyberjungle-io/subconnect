import React, { useState, useEffect } from 'react';
import { FaTimes, FaLayerGroup, FaPalette, FaExpand, FaBorderStyle, FaFont, FaImage, FaChartBar, FaPlay, FaHeading, FaArrowsAlt, FaMousePointer, FaPencilAlt } from 'react-icons/fa';
import SizeControls from './SizeControls';
import LayoutControls from './LayoutControls';
import BorderControls from './BorderControls';
import BackgroundControls from './BackgroundControls';
import TextControls from './TextControls';
import HeadingControls from './HeadingControls';
import ImageControls from './ImageControls';
import ChartControls from './ChartControls';
import SpacingControls from './SpacingControls';
import VideoControls from './VideoControls';
import WhiteboardControls from './WhiteboardControls';
import ButtonControls from './ButtonControls';

const iconMap = {
  FLEX_CONTAINER: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaLayerGroup, tooltip: 'Layout' },
  ],
  TEXT: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaFont, tooltip: 'Text Controls' },
    { icon: FaHeading, tooltip: 'Heading Controls' },
  ],
  HEADING: [
    { icon: FaLayerGroup, tooltip: 'Layout' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaHeading, tooltip: 'Heading Controls' },
    { icon: FaFont, tooltip: 'Font' },
  ],
  IMAGE: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaImage, tooltip: 'Image Controls' },
  ],
  CHART: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaChartBar, tooltip: 'Chart Controls' },
  ],
  VIDEO: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaPlay, tooltip: 'Video Controls' },
  ],
  BUTTON: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaMousePointer, tooltip: 'Button Controls' },
  ],
  WHITEBOARD: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaPencilAlt, tooltip: 'Whiteboard Controls' },
  ],
  // Add more component types and their corresponding icons as needed
};

const FloatingToolbar = ({ componentId, componentType, initialPosition, onClose, style, props, content, onStyleChange, onToolbarInteraction }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeControl, setActiveControl] = useState('Size');
  const [toolbarHeight, setToolbarHeight] = useState('auto');

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (activeControl === 'Size') {
      setToolbarHeight('auto');
    } else {
      setToolbarHeight('60px');
    }
  }, [activeControl]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleIconClick = (tooltip) => {
    setActiveControl(activeControl === tooltip ? null : tooltip);
  };

  const icons = iconMap[componentType] || [];

  const renderActiveControl = () => {
    console.log('Active Control:', activeControl);
    const sharedProps = {
      style,
      props,
      content,
      onStyleChange: (updates) => onStyleChange({ style: updates }),
      onPropsChange: (updates) => onStyleChange({ props: updates }),
      onContentChange: (content) => onStyleChange({ content }),
    };

    switch (activeControl) {
      case 'Size':
        return <SizeControls {...sharedProps} />;
      case 'Spacing':
        return <SpacingControls {...sharedProps} />;
      case 'Border':
        return <BorderControls {...sharedProps} />;
      case 'Background':
        return <BackgroundControls {...sharedProps} />;
      case 'Text Controls':
        return <TextControls {...sharedProps} />;
      case 'Heading Controls':
        return <HeadingControls {...sharedProps} />;
      case 'Image Controls':
        return <ImageControls {...sharedProps} />;
      case 'Layout':
        return <LayoutControls {...sharedProps} />;
      case 'Chart Controls':
        return <ChartControls {...sharedProps} />;
      case 'Video Controls':
        return <VideoControls {...sharedProps} />;
      case 'Whiteboard Controls':
        return <WhiteboardControls {...sharedProps} />;
      case 'Button Controls':
        return <ButtonControls {...sharedProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        height: activeControl ? 'auto' : '60px',
        maxHeight: '80vh',
        overflow: 'auto',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 9999,
        transition: 'height 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onClick={onToolbarInteraction}
    >
      <div
        style={{
          height: '20px',
          backgroundColor: '#f0f0f0',
          cursor: 'move',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5px',
        }}
        onMouseDown={handleMouseDown}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Component Toolbar</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <FaTimes />
        </button>
      </div>
      <div style={{ display: 'flex', padding: '5px', flexWrap: 'wrap' }}>
        {icons.map((iconData, index) => (
          <button
            key={index}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              fontSize: '18px',
              color: activeControl === iconData.tooltip ? '#007bff' : '#333',
            }}
            title={iconData.tooltip}
            onClick={() => handleIconClick(iconData.tooltip)}
          >
            <iconData.icon />
          </button>
        ))}
      </div>
      {activeControl && (
        <div style={{ padding: '10px', flexGrow: 1, overflowY: 'auto' }}>
          {renderActiveControl()}
        </div>
      )}
    </div>
  );
};

export default FloatingToolbar;