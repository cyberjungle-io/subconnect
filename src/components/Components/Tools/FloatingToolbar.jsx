import React, { useState, useEffect, useCallback } from 'react';
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
  const [isMouseDown, setIsMouseDown] = useState(false);

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

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setIsMouseDown(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onToolbarInteraction(e);
  }, [position, onToolbarInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsMouseDown(false);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = (e) => {
      if (isMouseDown) {
        handleMouseUp();
        e.stopPropagation();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDown, handleMouseUp]);

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

  const buttonClass = (isActive) => `
    p-2 rounded-full
    ${isActive 
      ? 'bg-[#cce7ff] text-blue-600 border border-blue-300' 
      : 'hover:bg-[#d9ecff] border border-transparent'
    }
  `;

  return (
    <div
      className="fixed z-[940] bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl w-[280px] max-h-[80vh] overflow-hidden flex flex-col group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={onToolbarInteraction}
      onMouseDown={onToolbarInteraction}
    >
      <div
        className="h-6 cursor-move bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onMouseDown={handleMouseDown}
      />
      <div className="px-4 pt-1 pb-3">
        <div
          className="flex justify-between items-center mb-3"
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-lg font-semibold text-gray-700">Component Toolbar</h3>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
            <FaTimes />
          </button>
        </div>
        <div className="flex mb-2 space-x-2">
          {icons.map((iconData, index) => (
            <button
              key={index}
              className={buttonClass(activeControl === iconData.tooltip)}
              title={iconData.tooltip}
              onClick={() => handleIconClick(iconData.tooltip)}
            >
              <iconData.icon />
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-[#cce0ff] flex-grow overflow-y-auto">
        <div className="p-4">
          {renderActiveControl()}
        </div>
      </div>
    </div>
  );
};

export default FloatingToolbar;