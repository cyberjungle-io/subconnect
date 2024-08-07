import React, { useCallback } from "react";
import { useDrop, useDrag } from "react-dnd";

import ContainerRenderer from "./ContainerRenderer";
import HeadingRenderer from "./HeadingRenderer";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ChartRenderer from "./ChartRenderer";
import WhiteboardRenderer from "./WhiteboardRenderer";

const useDragDrop = (component, onMoveComponent, onAddChild) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !component.isDraggingDisabled, // Add this line to disable dragging
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      
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
  selectedIds,
  isFlexChild = false,
  parent = null,
  globalComponentLayout,
}) => {
  const { isDragging, isOver, dragRef, dropRef } = useDragDrop(component, onMoveComponent, onAddChild);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onSelect(component.id, isMultiSelect);
  }, [component.id, onSelect]);

  const isThisComponentSelected = selectedIds.includes(component.id);

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
      parent,  // Add this line
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
        return <ChartRenderer {...sharedProps} />;
      case "WHITEBOARD":
        return <WhiteboardRenderer {...sharedProps} />;
      default:
        return null;
    }
  };
  const getComponentStyle = () => {
    const { style, type, props } = component;
    
    const componentStyle = {
      ...style,
      position: 'relative',
      border: isSelected ? "2px solid blue" : "1px solid #ccc",
      padding: style.padding || "0px",
      margin: style.margin || "0px",
      overflow: "hidden",
      boxSizing: 'border-box',
    };
  
    if (type === "FLEX_CONTAINER") {
      const isRow = props.direction !== "column";
      
      componentStyle.display = "flex";
      componentStyle.flexDirection = props.direction || "row";
      componentStyle.flexWrap = props.wrap || "nowrap";
      componentStyle.alignItems = props.alignItems || "stretch";
      componentStyle.justifyContent = props.justifyContent || "flex-start";
      componentStyle.gap = style.gap || "0px";
      
      if (!isFlexChild) {
        // Top-level FLEX_CONTAINER
        if (globalComponentLayout === "horizontal") {
          componentStyle.width = style.width || "100%";
          componentStyle.height = style.height || "200px";
        } else {
          componentStyle.width = style.width || "200px";
          componentStyle.height = style.height || "100%";
        }
      } else {
        // Nested FLEX_CONTAINER
        componentStyle.flexGrow = 1;
        componentStyle.flexShrink = 1;
        componentStyle.flexBasis = '0%';
        componentStyle.width = style.width || 'auto';
        componentStyle.height = style.height || 'auto';
      }
      
      componentStyle.minWidth = style.minWidth || "50px";
      componentStyle.minHeight = style.minHeight || "50px";
    } else {
      // For non-FLEX_CONTAINER components
      componentStyle.flexGrow = 0;
      componentStyle.flexShrink = 0;
      componentStyle.flexBasis = 'auto';
      componentStyle.width = style.width || 'auto';
      componentStyle.height = style.height || 'auto';
    }
  
    if (type === "CHART") {
      componentStyle.minWidth = style.width || "200px";
      componentStyle.minHeight = style.height || "150px";
      componentStyle.width = style.width || "100%";
      componentStyle.height = style.height || "100%";
    }
  
    console.log(`Component ${component.id} style:`, componentStyle);
    return componentStyle;
  };

  return (
    <div
      ref={(node) => {
        // Only apply drag ref if dragging is not disabled
        if (!component.isDraggingDisabled) {
          dragRef(dropRef(node));
        } else {
          dropRef(node);
        }
      }}
      style={getComponentStyle()}
      onClick={handleClick}
      className={`${isSelected ? "shadow-lg" : ""} ${isOver ? "bg-blue-100" : ""} ${
        component.isDraggingDisabled ? "cursor-default" : "cursor-move"
      }`}
      data-id={component.id}
    >
      {renderContent()}
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 z-10">
          {component.type}
        </div>
      )}
    </div>
  );
});

export default ComponentRenderer;