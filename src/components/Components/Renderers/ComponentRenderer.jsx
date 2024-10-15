import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { useSelector, useDispatch } from 'react-redux';
import { deleteComponents, renameComponent } from '../../../features/editorSlice'; // Update this import

import HeadingRenderer from "./HeadingRenderer";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ChartRenderer from "./ChartRenderer";
import WhiteboardRenderer from "./WhiteboardRenderer";
import VideoRenderer from "./VideoRenderer";
import QueryValueRenderer from "./QueryValueRenderer"; // Add this import
import KanbanRenderer from "./KanbanRenderer";
import { getHighlightColor } from '../../../utils/highlightColors'; // We'll create this utility function
import { FaPencilAlt, FaTimes } from 'react-icons/fa'; // Add FaTimes import
import FloatingToolbar from '../Tools/FloatingToolbar';
import ResizeHandle from '../../common/ResizeHandle';
import TableRenderer from "./TableRenderer";

const defaultGlobalSettings = {
  generalComponentStyle: {
    fontSize: '16px',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: '4px', // Add default border radius
  }
};

const useDragDrop = (component, onMoveComponent, onAddChild, isDragModeEnabled) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => isDragModeEnabled && !component.isDraggingDisabled,
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      
      if (item.id && isDragModeEnabled) {
        onMoveComponent(item.id, component.id);
      } else {
        onAddChild(component.id, item.type);
      }
    },
    canDrop: () => component.type === "FLEX_CONTAINER",
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  return { isDragging, isOver, dragRef: drag, dropRef: drop };
};

const ComponentRenderer = React.memo(({
  component,
  onUpdate,
  onSelect,
  isSelected,
  onAddChild,
  onMoveComponent,
  depth = 0, // Add depth prop with default value 0
  selectedIds = [],
  isFlexChild = false,
  parent = null,
  globalComponentLayout,
  isViewMode = false,
  globalSettings = defaultGlobalSettings, // Provide a default value
  isTopLevel = false, // Add this prop
  onStyleChange, // Add this prop
  onToolbarInteraction, // Add this prop
  isDragModeEnabled, // Add this prop
  onToolbarOpen,
  onToolbarClose,
  isToolbarOpen,
  onDeselect, // Add this prop
}) => {
  const dispatch = useDispatch();
  const componentRef = useRef(null);
  const { isDragging, isOver, dragRef, dropRef } = useDragDrop(component, onMoveComponent, onAddChild, isDragModeEnabled);
  const [toolbarState, setToolbarState] = useState({ show: false, position: { x: 0, y: 0 } });
  const [isEditing, setIsEditing] = useState(false);
  const editingRef = useRef(false);

  useEffect(() => {
    editingRef.current = isEditing;
  }, [isEditing]);

  const handleClick = useCallback((event) => {
    if (isViewMode) return; // Add this line
    event.stopPropagation();
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onSelect(component.id, isMultiSelect);
  }, [component.id, onSelect, isViewMode]); // Add isViewMode to dependencies

  // Add this effect to handle the delete key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && !isViewMode && selectedIds.includes(component.id)) {
        e.preventDefault();
        dispatch(deleteComponents([component.id]));
      }
    };

    const currentRef = componentRef.current;
    if (currentRef) {
      currentRef.addEventListener('keydown', handleKeyDown);

      return () => {
        currentRef.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [dispatch, component.id, selectedIds, isViewMode]);

  const isThisComponentSelected = selectedIds?.includes(component.id) || false;
  const highlightColor = getHighlightColor(depth);

  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return null;
    }
  
    return component.children.map((child) => (
      <ComponentRenderer
        key={child.id}
        component={child}
        onUpdate={onUpdate}
        onSelect={onSelect}
        onAddChild={onAddChild}
        onMoveComponent={onMoveComponent}
        selectedIds={selectedIds}
        depth={depth + 1}
        isFlexChild={component.type === "FLEX_CONTAINER"}
        parent={component}
        isViewMode={isViewMode}
        globalSettings={globalSettings}
        onStyleChange={onStyleChange} // Pass onStyleChange prop
        onToolbarInteraction={onToolbarInteraction} // Pass onToolbarInteraction prop
        isDragModeEnabled={isDragModeEnabled} // Pass isDragModeEnabled prop
        onToolbarOpen={onToolbarOpen}
        onToolbarClose={onToolbarClose}
        isToolbarOpen={isToolbarOpen}
        onDeselect={onDeselect}
      />
    ));
  };

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (isViewMode) return;

    const rect = componentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the available space on the right and bottom
    const spaceRight = viewportWidth - e.clientX;
    const spaceBottom = viewportHeight - e.clientY;

    // Determine the position based on available space
    let x = e.clientX;
    let y = e.clientY;

    // If there's not enough space on the right, position on the left
    if (spaceRight < 300) { // Assuming toolbar width is 300px
      x = Math.max(0, e.clientX - 300);
    }

    // If there's not enough space at the bottom, position above
    if (spaceBottom < 400) { // Assuming a max toolbar height of 400px
      y = Math.max(0, e.clientY - 400);
    }

    if (component.type === "TEXT") {
      if (!toolbarState.show) {
        setToolbarState({ show: true, position: { x, y } });
        onToolbarOpen(component.id);
      }
      setIsEditing(true);
    } else {
      setToolbarState(prev => ({ show: !prev.show, position: { x, y } }));
      if (!toolbarState.show) {
        onToolbarOpen(component.id);
      } else {
        onToolbarClose();
        onDeselect(); // Deselect when closing toolbar
      }
    }
  }, [isViewMode, component.type, toolbarState, onToolbarOpen, onToolbarClose, onDeselect]);

  const handleUpdate = useCallback((id, updates) => {
    const updatedComponent = {
      ...component,
      ...updates,
      style: {
        ...component.style,
        ...(updates.style || {}),
      },
      props: {
        ...component.props,
        ...(updates.props || {}),
      },
    };
    if (updatedComponent.type === "FLEX_CONTAINER") {
      // Ensure layout properties are correctly updated
      updatedComponent.style = {
        ...updatedComponent.style,
        flexDirection: updates.style?.flexDirection || component.style.flexDirection,
        flexWrap: updates.style?.flexWrap || component.style.flexWrap,
        alignItems: updates.style?.alignItems || component.style.alignItems,
        justifyContent: updates.style?.justifyContent || component.style.justifyContent,
        alignContent: updates.style?.alignContent || component.style.alignContent,
      };
    }
    onUpdate(id, updatedComponent);
    if (editingRef.current) {
      setTimeout(() => {
        const textElement = componentRef.current.querySelector('[contenteditable="true"]');
        if (textElement) {
          textElement.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(textElement);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 0);
    }
  }, [onUpdate, component]);

  const handleToolbarClose = useCallback(() => {
    setToolbarState({ show: false, position: { x: 0, y: 0 } });
    setIsEditing(false);
    onToolbarClose();
  }, [onToolbarClose]);

  const handleToolbarInteraction = useCallback((e) => {
    e.stopPropagation();
    // Prevent closing the toolbar when interacting with it
  }, []);

  const renderContent = () => {
    const sharedProps = {
      component: {
        ...component,
        style: {
          ...component.style,
          margin: '0px',
          // Remove width and height overrides
        },
      },
      onUpdate: handleUpdate, // Use the new handleUpdate function
      onSelect,
      onAddChild,
      onMoveComponent,
      selectedIds,
      depth: depth + 1,
      parent,
      isViewMode,
      globalSettings: {
        ...defaultGlobalSettings,
        ...globalSettings,
        generalComponentStyle: {
          ...defaultGlobalSettings.generalComponentStyle,
          ...globalSettings.generalComponentStyle,
        },
      },
      onStyleChange, // Add this prop
      isSelected: isThisComponentSelected,
      onDoubleClick: handleDoubleClick,
      isEditing: isEditing,
      setIsEditing: setIsEditing,
      isDragModeEnabled, // Add this prop
    };
  
    switch (component.type) {
      case "FLEX_CONTAINER":
        return renderChildren();
      case "HEADING":
        return <HeadingRenderer {...sharedProps} />;
      case "TEXT":
        return <TextRenderer {...sharedProps} />;
      case "IMAGE":
        return <ImageRenderer {...sharedProps} />;
      case "BUTTON":
        return <ButtonRenderer {...sharedProps} />;
      case "CHART":
        return <ChartRenderer {...sharedProps} globalChartStyle={globalSettings.chartStyle} />;
      case "WHITEBOARD":
        return <WhiteboardRenderer {...sharedProps} />;
      case "VIDEO":
        return <VideoRenderer {...sharedProps} />;
      case "QUERY_VALUE": // Add this case
        return <QueryValueRenderer {...sharedProps} />;
      case 'KANBAN':
        return <KanbanRenderer {...sharedProps} isInteractive={isViewMode} />;
      case "TABLE":
        return <TableRenderer {...sharedProps} />;
      default:
        return null;
    }
  };

  const getComponentStyle = () => {
    const { style, type, props } = component;
    const generalComponentStyle = globalSettings?.generalComponentStyle || defaultGlobalSettings.generalComponentStyle;
    
    const componentStyle = {
      ...generalComponentStyle,
      ...style,
      position: 'relative',
      overflow: "hidden",
      boxSizing: 'border-box',
      borderRadius: style.borderRadius || props.borderRadius || generalComponentStyle.borderRadius || '4px',
      padding: style.padding || "0px",
      margin: style.margin || "0px",
      backgroundColor: style.backgroundColor || 'transparent',
      boxShadow: style.boxShadow || 'none',
      opacity: style.opacity || 1,
      transform: style.transform || 'none',
      transition: style.transition || 'none',
      maxWidth: '100%',
      maxHeight: '100%',
    };

    // Handle height for different component types
    if (type === 'TEXT') {
      componentStyle.height = 'auto';
      componentStyle.minHeight = style.height || 'auto';
    } else if (type === 'CHART') {
      componentStyle.width = style.width || '100%';
      componentStyle.height = style.height || '300px'; // Provide a default height for charts
      componentStyle.minWidth = style.minWidth || "200px";
      componentStyle.minHeight = style.minHeight || "150px";
    } else if (isTopLevel) {
      componentStyle.height = style.height || '300px';
    } else {
      componentStyle.height = style.height || 'auto';
    }

    if (style.showBorder !== false) {
      componentStyle.borderWidth = style.borderWidth || '1px';
      componentStyle.borderStyle = style.borderStyle || 'solid';
      componentStyle.borderColor = style.borderColor || '#000';
    }

    if (type === "FLEX_CONTAINER") {
      Object.assign(componentStyle, {
        display: "flex",
        flexDirection: style.flexDirection || props.direction || "row",
        flexWrap: style.flexWrap || props.wrap || "nowrap",
        alignItems: style.alignItems || props.alignItems || "stretch",
        justifyContent: style.justifyContent || props.justifyContent || "flex-start",
        alignContent: style.alignContent || props.alignContent || "stretch",
        gap: style.gap || "0px",
      });

      if (!isFlexChild) {
        componentStyle[globalComponentLayout === "horizontal" ? "width" : "height"] = "100%";
      } else {
        Object.assign(componentStyle, {
          flexGrow: style.flexGrow || 0,
          flexShrink: style.flexShrink || 1,
          flexBasis: style.flexBasis || 'auto',
          width: style.width || 'auto',
          height: style.height || 'auto',
        });
      }
    } else if (isFlexChild) {
      Object.assign(componentStyle, {
        flexGrow: style.flexGrow || 0,
        flexShrink: style.flexShrink || 1,
        flexBasis: style.flexBasis || 'auto',
        width: style.width || 'auto',
        height: style.height || 'auto',
      });
    }

    // Add this condition for top-level components
    if (isTopLevel) {
      componentStyle.width = '100%';
    }

    return componentStyle;
  };

  const handleResize = (newSize, unit, dimension) => {
    onUpdate(component.id, {
      style: {
        ...component.style,
        [dimension]: `${newSize}${unit}`
      }
    });
  };

  const getSize = (dimension) => {
    const size = component.style[dimension];
    if (!size) return { size: 100, unit: '%' };
    
    const match = String(size).match(/^([\d.]+)(.*)$/);
    return match ? { size: parseFloat(match[1]), unit: match[2] || 'px' } : { size: 100, unit: '%' };
  };

  const { size: width, unit: widthUnit } = getSize('width');
  const { size: height, unit: heightUnit } = getSize('height');

  // Use the same rendering logic for both view and edit modes
  return (
    <>
      <div
        ref={(node) => {
          componentRef.current = node;
          if (component.type === "FLEX_CONTAINER") {
            dropRef(node);
          }
          dragRef(node);
        }}
        style={{
          ...getComponentStyle(),
          ...(isThisComponentSelected && !isViewMode ? { outline: `2px solid ${highlightColor}` } : {}),
          position: 'relative', // Add this line
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isViewMode && !isToolbarOpen) {
            handleClick(e);
          }
        }}
        onDoubleClick={handleDoubleClick}
        className={`
          ${isViewMode ? "" : isThisComponentSelected ? "shadow-lg" : ""}
          ${isViewMode ? "" : isOver ? "bg-blue-100" : ""}
          ${isViewMode ? "" : component.isDraggingDisabled ? "cursor-default" : "cursor-move"}
        `}
        data-id={component.id}
        tabIndex={0}
      >
        {renderContent()}
        {!isViewMode && isThisComponentSelected && (
          <div 
            className="absolute top-0 right-0 text-white text-xs px-1 z-10"
            style={{ backgroundColor: highlightColor }}
          >
            {component.name || component.type}
          </div>
        )}
        {isThisComponentSelected && !isViewMode && (
          <>
            <ResizeHandle
              onResize={(newSize, unit) => handleResize(newSize, unit, 'width')}
              isHorizontal={true}
              currentSize={width}
              currentUnit={widthUnit}
            />
            <ResizeHandle
              onResize={(newSize, unit) => handleResize(newSize, unit, 'height')}
              isHorizontal={false}
              currentSize={height}
              currentUnit={heightUnit}
            />
          </>
        )}
      </div>
      {toolbarState.show && (
        <FloatingToolbar
          componentId={component.id}
          componentType={component.type}
          initialPosition={toolbarState.position}
          onClose={() => {
            handleToolbarClose();
            onDeselect(); // Deselect when closing toolbar
          }}
          style={component.style}
          props={component.props}
          content={component.content}
          onStyleChange={(updates) => {
            if (updates.style) onUpdate(component.id, { style: updates.style });
            if (updates.props) onUpdate(component.id, { props: updates.props });
            if (updates.content !== undefined) onUpdate(component.id, { content: updates.content });
          }}
          onToolbarInteraction={handleToolbarInteraction}
        />
      )}
    </>
  );
});

export default ComponentRenderer;