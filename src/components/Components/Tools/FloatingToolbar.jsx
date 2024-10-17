import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaTimes, FaLayerGroup, FaPalette, FaExpand, FaBorderStyle, FaFont, FaImage, FaChartBar, FaPlay, FaArrowsAlt, FaMousePointer, FaPencilAlt, FaDatabase, FaSave, FaClipboardList, FaTable } from 'react-icons/fa';
import SizeControls from './SizeControls';
import LayoutControls from './LayoutControls';
import BorderControls from './BorderControls';
import BackgroundControls from './BackgroundControls';
import TextControls from './TextControls';
import ImageControls from './ImageControls';
import ChartControls from './ChartControls';
import SpacingControls from './SpacingControls';
import VideoControls from './VideoControls';
import WhiteboardControls from './WhiteboardControls';
import ButtonControls from './ButtonControls';
import QueryValueControls from './QueryValueControls';
import BasicTextControls from './BasicTextControls';
import ChartDataControls from './ChartDataControls';
import KanbanControls from './KanbanControls';
import { useDispatch } from 'react-redux';
import { renameComponent, saveComponentThunk } from '../../../features/editorSlice';
import ColorThemeControls from './ColorThemeControls';
import TableControls from './TableControls';
import TableDataControls from './TableDataControls';
import ToolbarControls from './ToolbarControls';

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
    { icon: FaDatabase, tooltip: 'Chart Data' },
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
  QUERY_VALUE: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaDatabase, tooltip: 'Query Controls' },
    { icon: FaFont, tooltip: 'Text Controls' },
  ],
  CANVAS: [
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaPalette, tooltip: 'Color Theme' },
    { icon: FaPalette, tooltip: 'Toolbar Settings' }, // Add this line
  ],
  KANBAN: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaClipboardList, tooltip: 'Kanban Controls' },
    { icon: FaFont, tooltip: 'Text Styling' }, // Changed from FaHeading to FaFont
  ],
  TABLE: [
    { icon: FaExpand, tooltip: 'Size' },
    { icon: FaArrowsAlt, tooltip: 'Spacing' },
    { icon: FaBorderStyle, tooltip: 'Border' },
    { icon: FaTable, tooltip: 'Table Style' },
    { icon: FaDatabase, tooltip: 'Table Data' },
    { icon: FaPalette, tooltip: 'Background' },
    { icon: FaFont, tooltip: 'Text Styling' },
  ],
  TOOLBAR: [
    { icon: FaPalette, tooltip: 'Toolbar Settings' },
  ],
};

const FloatingToolbar = ({ componentId, componentType, initialPosition, onClose, style, props, content, onStyleChange, onToolbarInteraction }) => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeControl, setActiveControl] = useState('Size');
  const [toolbarHeight, setToolbarHeight] = useState('auto');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const toolbarRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(props?.name || componentType);
  const inputRef = useRef(null);

  useEffect(() => {
    const updateToolbarSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateToolbarSize();
    window.addEventListener('resize', updateToolbarSize);

    return () => window.removeEventListener('resize', updateToolbarSize);
  }, []);

  useEffect(() => {
    if (toolbarRef.current) {
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = initialPosition;

      // Ensure the toolbar stays within the viewport
      if (x + toolbarRect.width > viewportWidth) {
        x = viewportWidth - toolbarRect.width;
      }
      if (y + toolbarRect.height > viewportHeight) {
        y = viewportHeight - toolbarRect.height;
      }

      setPosition({ x: Math.max(0, x), y: Math.max(0, y) });
    }
  }, [initialPosition]);

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

  const handleToolbarInteraction = useCallback((e) => {
    e.stopPropagation();
    onToolbarInteraction(e);
  }, [onToolbarInteraction]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!isEditing) {
      setIsDragging(true);
      setIsMouseDown(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onToolbarInteraction(e);
    }
  }, [position, onToolbarInteraction, isEditing]);

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

  useEffect(() => {
    const handleDoubleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('dblclick', handleDoubleClickOutside);
    return () => {
      document.removeEventListener('dblclick', handleDoubleClickOutside);
    };
  }, [onClose]);

  const handleIconClick = (tooltip) => {
    setActiveControl(activeControl === tooltip ? null : tooltip);
  };

  const icons = iconMap[componentType] || [];

  // Add this condition to render icons for CANVAS type
  const renderIcons = () => {
    if (componentType === 'CANVAS') {
      return (
        <div className="flex flex-wrap mb-2 gap-2">
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
      );
    }
    return null;
  };

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
        return componentType === 'TEXT' ? (
          <TextControls {...sharedProps} />
        ) : (
          <BasicTextControls {...sharedProps} />
        );
      case 'Image Controls':
        return <ImageControls {...sharedProps} />;
      case 'Layout':
        return <LayoutControls {...sharedProps} />;
      case 'Chart Controls':
        return <ChartControls {...sharedProps} />;
      case 'Chart Data':
        return <ChartDataControls {...sharedProps} />;
      case 'Video Controls':
        return <VideoControls {...sharedProps} />;
      case 'Whiteboard Controls':
        return <WhiteboardControls {...sharedProps} />;
      case 'Button Controls':
        return <ButtonControls {...sharedProps} />;
      case 'Query Controls':
        return  <QueryValueControls {...sharedProps} />;
      case 'Kanban Controls':
        return <KanbanControls {...sharedProps} />;
      case 'Text Styling': // Changed from 'Header Text' to 'Text Styling'
        return componentType === 'KANBAN' ? (
          <div>
            <BasicTextControls 
              {...sharedProps} 
              style={props.columnHeaderStyle || {}} 
              onStyleChange={(updates) => onStyleChange({ props: { ...props, columnHeaderStyle: updates } })}
              label="Column Header Text"
            />
            <BasicTextControls 
              {...sharedProps} 
              style={props.taskTextStyle || {}} 
              onStyleChange={(updates) => onStyleChange({ props: { ...props, taskTextStyle: updates } })}
              label="Task Text"
            />
          </div>
        ) : null;
      case 'Color Theme':
        return <ColorThemeControls />;
      case 'Table Style':
        return <TableControls {...sharedProps} />;
      case 'Table Data':
        return <TableDataControls {...sharedProps} />;
      case 'Toolbar Settings':
        return <ToolbarControls {...sharedProps} />;
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

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editedName.trim() !== '' && editedName !== (props.name || componentType)) {
      dispatch(renameComponent({ id: componentId, newName: editedName.trim() }));
      onStyleChange({ props: { ...props, name: editedName.trim() } });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditedName(props.name || componentType);
      setIsEditing(false);
    }
    e.stopPropagation(); // Prevent dragging when typing
  };

  const handleSaveComponent = (e) => {
    e.stopPropagation();
    const componentToSave = { id: componentId, type: componentType, style, props, content };
    dispatch(saveComponentThunk(componentToSave))
      .then(() => {
        console.log('Component saved successfully');
      })
      .catch((error) => {
        console.error('Error saving component:', error);
      });
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[940] bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl w-[280px] flex flex-col group select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxHeight: '80vh', // Set maximum height to 80% of viewport height
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        transform: 'scale(0.8)', // Slightly reduce the size
      }}
      onClick={handleToolbarInteraction}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`h-6 ${isEditing ? '' : 'cursor-move'} bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
        onMouseDown={handleMouseDown}
      />
      <div className="px-4 pt-1 pb-3">
        <div
          className={`flex items-center mb-3 ${isEditing ? '' : 'cursor-move'}`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex-grow mr-2 min-w-0">
            {componentType === 'TOOLBAR' ? (
              <h3 className="text-lg font-semibold text-gray-500 truncate">
                Toolbar Settings
              </h3>
            ) : (
              isEditing ? (
                <input
                  ref={inputRef}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-semibold text-gray-500 bg-white border border-gray-300 rounded px-1 py-0 w-full select-text"
                  style={{
                    userSelect: 'text',
                    WebkitUserSelect: 'text',
                    MozUserSelect: 'text',
                    msUserSelect: 'text',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 
                  className="text-lg font-semibold text-gray-500 cursor-text truncate"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  title={props?.name || componentType}
                >
                  {props?.name || componentType}
                </h3>
              )
            )}
          </div>
          <div className="flex-shrink-0 flex items-center">
            {componentType !== 'TOOLBAR' && (
              <button
                onClick={handleSaveComponent}
                className="mr-2 text-gray-500 hover:text-blue-600"
                title="Save Component"
              >
                <FaSave />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-blue-600"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        {renderIcons()}
      </div>
      <div className="border-t border-[#cce0ff] flex-grow overflow-hidden flex flex-col">
        <div className="p-4 overflow-y-auto flex-grow">
          {renderActiveControl()}
        </div>
      </div>
    </div>
  );
};

export default FloatingToolbar;
