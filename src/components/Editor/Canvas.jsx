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
  globalSettings = {},
  isDragModeEnabled,
}) => {
  const { backgroundColor = '#ffffff', componentLayout = 'vertical', style = {} } = useSelector(state => state.editor.globalSettings || {});
  const canvasRef = useRef(null);
  const [, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      const offset = monitor.getClientOffset();
      const canvasElement = canvasRef.current;

      if (!offset || !canvasElement) {
        onAddComponent(item.type, null);
        return;
      }

      const canvasBounds = canvasElement.getBoundingClientRect();
      const dropPosition = {
        x: offset.x - canvasBounds.left,
        y: offset.y - canvasBounds.top,
      };

      // Find the FLEX_CONTAINER at the drop position
      const flexContainerAtPosition = components.find(comp => {
        if (comp.type !== 'FLEX_CONTAINER') return false;
        const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
        return dropPosition.x >= compRect.left && dropPosition.x <= compRect.right &&
               dropPosition.y >= compRect.top && dropPosition.y <= compRect.bottom;
      });

      if (flexContainerAtPosition) {
        // If dropping into a FLEX_CONTAINER, add as a child
        if (item.id && isDragModeEnabled) {
          onMoveComponent(item.id, flexContainerAtPosition.id);
        } else {
          onAddComponent(item.type, flexContainerAtPosition.id);
        }
      } else {
        // If not dropping into a FLEX_CONTAINER, add to canvas
        const insertIndex = components.findIndex(comp => {
          const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
          return (componentLayout === 'vertical' && dropPosition.y < compRect.bottom) ||
                 (componentLayout === 'horizontal' && dropPosition.x < compRect.right);
        });

        if (item.id && isDragModeEnabled) {
          onMoveComponent(item.id, null, insertIndex);
        } else {
          onAddComponent(item.type, null, insertIndex);
        }
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

  const handleToolbarInteraction = useCallback((event) => {
    event.stopPropagation();
  }, []);

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
    padding: '20px', // Uniform padding on all sides
    gap: '20px', // Gap between components
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
          globalSettings={globalSettings}
          isTopLevel={true}
          onToolbarInteraction={handleToolbarInteraction}
          isDragModeEnabled={isDragModeEnabled}
        />
      ))}
    </div>
  );
};

export default Canvas;