import React, { useCallback, useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { useSelector, useDispatch } from 'react-redux';
import { deleteComponents } from '../../../features/editorSlice'; // Update this import

import ContainerRenderer from "./ContainerRenderer";
import HeadingRenderer from "./HeadingRenderer";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ChartRenderer from "./ChartRenderer";
import WhiteboardRenderer from "./WhiteboardRenderer";
import VideoRenderer from "./VideoRenderer";

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
  depth = 0,
  selectedIds = [], // Provide a default empty array
  isFlexChild = false,
  parent = null,
  globalComponentLayout,
  isViewMode = false,
}) => {
  const dispatch = useDispatch();
  const componentRef = useRef(null);
  const { isDragging, isOver, dragRef, dropRef } = useDragDrop(component, onMoveComponent, onAddChild, isViewMode);
  const globalSettings = useSelector(state => state.editor.globalSettings);

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
      globalSettings, // Pass the entire globalSettings object
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
    
    const componentStyle = {
      ...style,
      position: 'relative',
      border: isSelected 
        ? "2px solid blue" 
        : style.borderWidth && style.borderStyle
          ? `${style.borderWidth} ${style.borderStyle} ${style.borderColor || '#000'}`
          : "1px solid #ccc",
      borderRadius: style.borderRadius || props.borderRadius || '4px', // Updated this line
      padding: style.padding || "0px",
      margin: style.margin || "0px",
      overflow: "hidden",
      boxSizing: 'border-box',
      backgroundColor: style.backgroundColor || 'transparent',
      boxShadow: style.boxShadow || 'none',
      opacity: style.opacity || 1,
      transform: style.transform || 'none',
      transition: style.transition || 'none',
    };
  
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

  // Use the same rendering logic for both view and edit modes
  return (
    <div
      ref={(node) => {
        componentRef.current = node;
        if (!isViewMode && !component.isDraggingDisabled) {
          dragRef(dropRef(node));
        } else if (!isViewMode) {
          dropRef(node);
        }
      }}
      style={getComponentStyle()}
      onClick={isViewMode ? undefined : handleClick}
      className={`
        ${isViewMode ? "" : isThisComponentSelected ? "shadow-lg" : ""}
        ${isViewMode ? "" : isOver ? "bg-blue-100" : ""}
        ${isViewMode ? "" : component.isDraggingDisabled ? "cursor-default" : "cursor-move"}
      `}
      data-id={component.id}
      tabIndex={0} // Make the div focusable
    >
      {renderContent()}
      {!isViewMode && isThisComponentSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 z-10">
          {component.type}
        </div>
      )}
    </div>
  );
});

export default ComponentRenderer;