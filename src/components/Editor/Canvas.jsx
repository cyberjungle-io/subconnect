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
  const { backgroundColor, componentLayout, style } = useSelector(state => state.editor.globalSettings);
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
        // If we don't have a valid offset or canvas element, add the component at the end
        onAddComponent(item.type, null);
        return;
      }

      const canvasBounds = canvasElement.getBoundingClientRect();
      const dropPosition = {
        x: offset.x - canvasBounds.left,
        y: offset.y - canvasBounds.top,
      };

      // Find the index where to insert the new component
      const insertIndex = components.findIndex(comp => {
        const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
        return (componentLayout === 'vertical' && dropPosition.x < compRect.right) ||
               (componentLayout === 'horizontal' && dropPosition.y < compRect.bottom);
      });

      if (item.id) {
        onMoveComponent(item.id, null, insertIndex);
      } else {
        onAddComponent(item.type, null, insertIndex);
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

  const canvasStyle = {
    backgroundColor,
    padding: `${style.paddingTop || '0px'} ${style.paddingRight || '0px'} ${style.paddingBottom || '0px'} ${style.paddingLeft || '0px'}`,
    margin: `${style.marginTop || '0px'} ${style.marginRight || '0px'} ${style.marginBottom || '0px'} ${style.marginLeft || '0px'}`,
    gap: style.gap || '0px',
    display: 'flex',
    flexDirection: componentLayout === 'vertical' ? 'row' : 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    alignContent: 'stretch',
    minHeight: "500px",
    width: '100%',
    height: '100%',
    position: 'relative',
  };


  return (
    <div
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="canvas-area w-full h-full bg-gray-100 overflow-auto"
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
          globalComponentLayout={componentLayout}
        />
      ))}
    </div>
  );
};

export default Canvas;
