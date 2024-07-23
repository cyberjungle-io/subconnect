import React, { useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import ComponentRenderer from '../Components/ComponentRenderer';

const Canvas = ({ components, selectedIds, onSelectComponent, onClearSelection, onUpdateComponent, onAddComponent, onMoveComponent }) => {
  const canvasRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'COMPONENT',
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
      
      if (item.type === 'ROW') {
        // For rows, place at the top of the canvas with full width
        position = {
          x: 0,
          y: 0,
          width: canvasBounds.width,
          height: 300 // Default height for rows
        };
      } else {
        // For other components, use the drop position
        position = {
          x: offset.x - canvasBounds.left,
          y: offset.y - canvasBounds.top,
          width: 100, // Default width for other components
          height: 300 // Default height for other components
        };
      }

      if (item.id) {
        onMoveComponent(item.id, null, position);
      } else {
        onAddComponent(item.type, null, position);
      }
    },
  });

  const handleCanvasClick = useCallback((event) => {
    if (event.target === canvasRef.current) {
      onClearSelection();
    }
  }, [onClearSelection]);


  return (
    <div 
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="canvas-area relative w-full h-full bg-gray-100 overflow-auto"
      style={{ minHeight: '500px' }}
      onClick={handleCanvasClick}
    >
      {components.map(component => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isSelected={selectedIds.includes(component.id)}
          onSelect={onSelectComponent}
          onUpdate={onUpdateComponent}
          onAddChild={(parentId, childType) => onAddComponent(childType, parentId)}
        />
      ))}
    </div>
  );
};

export default Canvas;