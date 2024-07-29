import React, { useCallback } from "react";
import { useDrop, useDrag } from "react-dnd";
import FlexContainer from "../FlexContainer";
import ContainerRenderer from "./ContainerRenderer";
import HeadingRenderer from "./HeadingRenderer";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ChartRenderer from "./ChartRenderer";

const useDragDrop = (component, onMoveComponent, onAddChild) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
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
    };
  
    switch (component.type) {
      case "FLEX_CONTAINER":
  return <FlexContainer component={component} {...sharedProps} />;
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
      default:
        return null;
    }
  };

  const getComponentStyle = () => {
    const { style } = component;
    
    const componentStyle = {
      ...style,
      position: isFlexChild ? 'relative' : 'absolute',
      border: isThisComponentSelected ? "2px solid blue" : "1px solid #ccc",
      padding: style.padding || "0px",
      margin: style.margin || "0px",
      gap: style.gap || "0px",
      overflow: "hidden",
      boxSizing: 'border-box',
    };

    if (isFlexChild) {
      // These will be overridden by FlexContainer if necessary
      componentStyle.flexGrow = style.flexGrow || 0;
      componentStyle.flexShrink = style.flexShrink || 1;
      componentStyle.flexBasis = style.width || 'auto';
    }

    if (component.type === "CHART") {
      componentStyle.minWidth = style.width || "200px";
      componentStyle.minHeight = style.height || "150px";
      componentStyle.width = style.width || "100%";
      componentStyle.height = style.height || "100%";
    }
    return componentStyle;
  };

  return (
    <div
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      style={getComponentStyle()}
      onClick={handleClick}
      className={`relative ${isThisComponentSelected ? "shadow-lg" : ""} ${isOver ? "bg-blue-100" : ""}`}
    >
      {renderContent()}
      {isThisComponentSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 z-10">
          {component.type}
        </div>
      )}
    </div>
  );
});

export default ComponentRenderer;