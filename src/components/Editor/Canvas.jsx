import React, { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from 'react-redux';
import ComponentRenderer from "../Components/Renderers/ComponentRenderer";

const Canvas = ({
  components,
  selectedIds,
  onSelectComponent,
  onClearSelection,
  onUpdateComponent,
  onAddComponent,
  onMoveComponent,
}) => {
  const canvasRef = useRef(null);
  const { backgroundColor, componentLayout } = useSelector(state => state.editor.globalSettings);
  const [, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return; // Prevent adding the component twice
      }

      const offset = monitor.getClientOffset();
      const canvasElement = canvasRef.current;

      if (!offset || !canvasElement) {
        // If we don't have a valid offset or canvas element, add the component at a default position
        onAddComponent(item.type, null, { x: 0, y: 0 });
        return;
      }

      const canvasBounds = canvasElement.getBoundingClientRect();

      let position;
      const lastComponent = components[components.length - 1];
      const lastPosition = lastComponent ? lastComponent.style : { left: 0, top: 0, width: 0, height: 0 };

      const isVertical = componentLayout === 'vertical';

      if (isVertical) {
        position = {
          x: lastPosition.left + (lastPosition.width || 0) + 2, // 2px gap
          y: 0,
          width: 200, // Default width
          height: canvasBounds.height, // Full height
        };
      } else { // horizontal layout
        position = {
          x: 0,
          y: lastPosition.top + (lastPosition.height || 0) + 2, // 2px gap
          width: canvasBounds.width, // Full width
          height: 200, // Default height
        };
      }

      if (item.id) {
        onMoveComponent(item.id, null, position);
      } else {
        onAddComponent(item.type, null, position);
      }
    },
  });

  const handleCanvasClick = useCallback(
    (event) => {
      if (event.target === canvasRef.current) {
        onClearSelection();
      }
    },
    [onClearSelection]
  );

  return (
    <div
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="canvas-area relative w-full h-full bg-gray-100 overflow-auto"
      style={{ 
        minHeight: "500px",
        backgroundColor: backgroundColor // Apply the background color here
      }}
      onClick={handleCanvasClick}
    >
      {components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isSelected={selectedIds.includes(component.id)}
          selectedIds={selectedIds}
          onSelect={onSelectComponent}
          onUpdate={onUpdateComponent}
          onAddChild={(parentId, childType) =>
            onAddComponent(childType, parentId)
          }
          onMoveComponent={onMoveComponent}
        />
      ))}
    </div>
  );
};

export default Canvas;
