import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import { useSelector, useDispatch } from 'react-redux';
import { deleteComponents, renameComponent } from '../../../features/editorSlice'; // Update this import

import ContainerRenderer from "./ContainerRenderer";
import HeadingRenderer from "./HeadingRenderer";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ChartRenderer from "./ChartRenderer";
import WhiteboardRenderer from "./WhiteboardRenderer";
import VideoRenderer from "./VideoRenderer";
import { getHighlightColor } from '../../../utils/highlightColors'; // We'll create this utility function
import { FaPencilAlt, FaTimes } from 'react-icons/fa'; // Add FaTimes import
import FloatingToolbar from '../Tools/FloatingToolbar';

const defaultGlobalSettings = {
  generalComponentStyle: {
    fontSize: '16px',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: '4px', // Add default border radius
  }
};

const useDragDrop = (component, onMoveComponent, onAddChild, isViewMode) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !isViewMode && !component.isDraggingDisabled,
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item, monitor) => {
      if (isViewMode || monitor.didDrop()) return;
      
      if (item.id) {
        onMoveComponent(item.id, component.id);
      } else {
        onAddChild(component.id, item.type);
      }
    },
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
  globalSettings = defaultGlobalSettings,
  isTopLevel = false, // Add this prop
  onStyleChange, // Add this prop
}) => {
  const dispatch = useDispatch();
  const componentRef = useRef(null);
  const { isDragging, isOver, dragRef, dropRef } = useDragDrop(component, onMoveComponent, onAddChild, isViewMode);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onSelect(component.id, isMultiSelect);
  }, [component.id, onSelect]);

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

  const getContainerStyles = () => {
    if (component.type !== "FLEX_CONTAINER") return {};

    return {
      display: "flex",
      flexDirection: component.props.direction || "row",
      flexWrap: component.props.wrap || "nowrap",
      alignItems: component.props.alignItems || "stretch",
      justifyContent: component.props.justifyContent || "flex-start",
      gap: component.props.gap || "0px",
    };
  };

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
      />
    ));
  };

  const renderContent = () => {
    const sharedProps = {
      component,
      onUpdate,
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
    };
  
    switch (component.type) {
      case "FLEX_CONTAINER":
        return renderChildren();  // Just render children directly
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
    };

    // Apply border radius if not explicitly set in component style
    if (!style.borderRadius) {
      componentStyle.borderRadius = generalComponentStyle.borderRadius || '4px';
    }

    // Override with component-specific styles
    if (style.showBorder === false) {
      componentStyle.border = "none";
    } else {
      componentStyle.borderWidth = style.borderWidth || '1px';
      componentStyle.borderStyle = style.borderStyle || 'solid';
      componentStyle.borderColor = style.borderColor || '#000';
    }
    
    componentStyle.borderRadius = style.borderRadius || props.borderRadius || '4px';
    componentStyle.padding = style.padding || "0px";
    componentStyle.margin = style.margin || "0px";
    componentStyle.backgroundColor = style.backgroundColor || 'transparent';
    componentStyle.boxShadow = style.boxShadow || 'none';
    componentStyle.opacity = style.opacity || 1;
    componentStyle.transform = style.transform || 'none';
    componentStyle.transition = style.transition || 'none';

    if (type === "FLEX_CONTAINER") {
      componentStyle.display = "flex";
      componentStyle.flexDirection = props.direction || "row";
      componentStyle.flexWrap = props.wrap || "nowrap";
      componentStyle.alignItems = props.alignItems || "stretch";
      componentStyle.justifyContent = props.justifyContent || "flex-start";
      componentStyle.gap = style.gap || "0px";
      
      // Always allow the FLEX_CONTAINER to grow based on its content
      componentStyle.minWidth = style.minWidth || "300px";
      componentStyle.minHeight = style.minHeight || "300px";
      componentStyle.width = style.width || "auto";
      componentStyle.height = style.height || "auto";

      if (!isFlexChild) {
        // Top-level FLEX_CONTAINER
        if (globalComponentLayout === "horizontal") {
          componentStyle.width = style.width || "100%";
        } else {
          componentStyle.height = style.height || "100%";
        }
      } else {
        // Nested FLEX_CONTAINER
        componentStyle.flexGrow = style.flexGrow || 1;
        componentStyle.flexShrink = style.flexShrink || 1;
        componentStyle.flexBasis = style.flexBasis || 'auto';
      }

      // Apply ComponentControls styles
      componentStyle.backgroundColor = style.backgroundColor || 'transparent';
      componentStyle.borderColor = style.borderColor || '#000';
      componentStyle.borderStyle = style.borderStyle || 'solid';
      componentStyle.borderWidth = style.borderWidth || '1px';
      componentStyle.borderRadius = style.borderRadius || '0px';
      componentStyle.boxShadow = style.boxShadow || 'none';
    } else {
      // For non-FLEX_CONTAINER components
      if (isFlexChild) {
        componentStyle.flexGrow = style.flexGrow || 0;
        componentStyle.flexShrink = style.flexShrink || 0;
        componentStyle.flexBasis = style.flexBasis || 'auto';
      }
      componentStyle.width = style.width || 'auto';
      componentStyle.height = style.height || 'auto';
    }
  
    if (type === "CHART") {
      componentStyle.minWidth = style.minWidth || "200px";
      componentStyle.minHeight = style.minHeight || "150px";
      componentStyle.width = style.width || "100%";
      componentStyle.height = style.height || "100%";
    }
  
    console.log(`Component ${component.id} style:`, componentStyle);
    return componentStyle;
  };

  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  const handleEditClick = (e) => {
    e.stopPropagation();
    const rect = componentRef.current.getBoundingClientRect();
    setToolbarPosition({ 
      x: rect.right - 300, // Align with the right edge of the component
      y: rect.top - 60 // Position 60px above the component
    });
    setShowToolbar(true);
  };

  const handleCloseToolbar = () => {
    setShowToolbar(false);
  };

  // Effect to hide toolbar when component is deselected
  useEffect(() => {
    if (!isThisComponentSelected) {
      setShowToolbar(false);
    }
  }, [isThisComponentSelected]);

  // Use the same rendering logic for both view and edit modes
  return (
    <>
      <div
        ref={(node) => {
          componentRef.current = node;
          if (!isViewMode && !component.isDraggingDisabled) {
            dragRef(dropRef(node));
          } else if (!isViewMode) {
            dropRef(node);
          }
        }}
        style={{
          ...getComponentStyle(),
          ...(isThisComponentSelected && !isViewMode ? { outline: `2px solid ${highlightColor}` } : {}),
        }}
        onClick={isViewMode ? undefined : handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        {!isViewMode && isThisComponentSelected && isHovered && (
          <button
            className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md z-20 hover:bg-gray-100 transition-colors duration-200"
            style={{ marginTop: '20px', marginRight: '5px' }}
            onClick={handleEditClick}
          >
            <FaPencilAlt className="text-gray-600" />
          </button>
        )}
      </div>
      {showToolbar && (
        <FloatingToolbar
          componentId={component.id}
          componentType={component.type}
          initialPosition={toolbarPosition}
          onClose={handleCloseToolbar}
          style={component.style}
          props={component.props}
          content={component.content}
          onStyleChange={(updates) => {
            if (updates.style) onUpdate(component.id, { style: updates.style });
            if (updates.props) onUpdate(component.id, { props: updates.props });
            if (updates.content !== undefined) onUpdate(component.id, { content: updates.content });
          }}
        />
      )}
    </>
  );
});

export default ComponentRenderer;