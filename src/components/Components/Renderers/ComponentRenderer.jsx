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
}) => {
  const { isDragging, isOver, dragRef, dropRef } = useDragDrop(component, onMoveComponent, onAddChild);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onSelect(component.id, isMultiSelect);
  }, [component.id, onSelect]);

  const isThisComponentSelected = selectedIds.includes(component.id);

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
        return <FlexContainer {...sharedProps} />;
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

  const componentStyle = {
    ...component.style,
    border: isThisComponentSelected ? "2px solid blue" : "1px solid #ccc",
    padding: "0",
    minWidth: component.type === "CHART" ? "200px" : undefined,
    minHeight: component.type === "CHART" ? "150px" : undefined,
    overflow: "hidden",
    position: 'relative',
    width: component.type === "ROW" ? "100%" : (component.style.width || "auto"),
    height: component.style.height || "100%", // Changed from "auto" to "100%"
    flexGrow: component.type === "ROW" ? 1 : (component.style.flexGrow || 0),
    flexShrink: component.type === "ROW" ? 0 : (component.style.flexShrink || 1),
    flexBasis: component.style.width || "auto",
    display: component.type === "ROW" ? "flex" : undefined,
    boxSizing: 'border-box', // Add this to include padding and border in the element's total width and height
  };

  return (
    <div
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      style={componentStyle}
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