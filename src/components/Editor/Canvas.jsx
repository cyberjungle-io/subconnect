import React, { useRef, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from 'react-redux';
import ComponentRenderer from "../Components/Renderers/ComponentRenderer";
import { updateComponent } from "../../features/editorSlice";


const GRID_SIZE = 20; // Size of grid cells in pixels

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
  const dispatch = useDispatch();
  const { backgroundColor, componentLayout, style } = useSelector(state => state.editor.globalSettings);
  const [showGrid, setShowGrid] = useState(true);

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
      const x = offset.x - canvasBounds.left;
      const y = offset.y - canvasBounds.top;
      
      // Snap to grid
      const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;


      let position;
      const lastComponent = components[components.length - 1];
      const lastPosition = lastComponent ? lastComponent.style : { left: 0, top: 0, width: 0, height: 0 };

      const isVertical = componentLayout === 'vertical';

      if (isVertical) {
        position = {
          x: lastPosition.left + (lastPosition.width || 0) + 2, // 2px gap
          y: snappedY,
          width: 200, // Default width
          height: canvasBounds.height, // Full height
        };
      } else { // horizontal layout
        position = {
          x: snappedX,
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

  const handleComponentMove = (id, newPosition) => {
    const snappedX = Math.round(newPosition.x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(newPosition.y / GRID_SIZE) * GRID_SIZE;
    dispatch(updateComponent({ 
      id, 
      updates: { 
        style: { 
          left: snappedX, 
          top: snappedY 
        } 
      } 
    }));
  };

  const canvasStyle = {
    backgroundColor,
    padding: `${style.paddingTop || '0px'} ${style.paddingRight || '0px'} ${style.paddingBottom || '0px'} ${style.paddingLeft || '0px'}`,
    margin: `${style.marginTop || '0px'} ${style.marginRight || '0px'} ${style.marginBottom || '0px'} ${style.marginLeft || '0px'}`,
    gap: style.gap || '0px',
    display: 'flex',
    flexDirection: componentLayout === 'vertical' ? 'row' : 'column',
    minHeight: "500px",
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundImage: showGrid ? `
      linear-gradient(to right, #f0f0f0 1px, transparent 1px),
      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
    ` : 'none',
    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  };

  return (
    <div
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="canvas-area relative w-full h-full bg-gray-100 overflow-auto"
      style={canvasStyle}
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
          onMove={handleComponentMove}
          gridSize={GRID_SIZE}
        />
      ))}
      <button
  className="absolute top-2 right-2 bg-white p-2 rounded shadow"
  onClick={() => setShowGrid(!showGrid)}
>
  {showGrid ? "Hide Grid" : "Show Grid"}
</button>
    </div>
  );
};

export default Canvas;
