import React, { useRef, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from 'react-redux';
import ComponentRenderer from "../Components/Renderers/ComponentRenderer";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating new IDs

export const getCanvasStyle = (canvasSettings, componentLayout) => ({
  ...canvasSettings.style,
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
});

const Canvas = ({
  components,
  selectedIds,
  onSelectComponent,
  onClearSelection,
  onUpdateComponent,
  onAddComponent,
  onMoveComponent,
  globalSettings = {}, // Provide a default empty object
  isDragModeEnabled,
  onDeselectAll, // Add this prop
  isViewMode = false, // Add this prop
  onUpdateCanvasSettings,
}) => {
  const { backgroundColor = '#ffffff', componentLayout = 'vertical', style = {} } = useSelector(state => state.editor.globalSettings || {});
  const canvasSettings = useSelector(state => state.editor.canvasSettings);
  const canvasRef = useRef(null);
  const [, drop] = useDrop({
    accept: ["COMPONENT", "SAVED_COMPONENT"],
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

        if (item.type === "SAVED_COMPONENT") {
          // Handle saved component drop
          const newComponentData = {
            ...item.savedComponent,
            id: uuidv4(), // Generate a new ID for the component
            style: {
              ...item.savedComponent.style,
              left: dropPosition.x,
              top: dropPosition.y,
            },
          };
          onAddComponent(newComponentData, null, insertIndex);
        } else {
          // Existing logic for regular components
          if (item.id && isDragModeEnabled) {
            onMoveComponent(item.id, null, insertIndex);
          } else {
            onAddComponent(item.type, null, insertIndex);
          }
        }
      }
    },
  });

  const [isClickFromToolbar, setIsClickFromToolbar] = useState(false);
  const [openToolbarId, setOpenToolbarId] = useState(null);

  const handleCanvasClick = useCallback(
    (event) => {
      if (event.target === canvasRef.current && !isClickFromToolbar) {
        if (!openToolbarId) {
          onClearSelection();
        }
      }
      setIsClickFromToolbar(false);
    },
    [onClearSelection, isClickFromToolbar, openToolbarId]
  );

  const handleToolbarOpen = useCallback((componentId) => {
    setOpenToolbarId(componentId);
  }, []);

  const handleToolbarClose = useCallback(() => {
    setOpenToolbarId(null);
  }, []);

  const handleToolbarInteraction = useCallback((event) => {
    event.stopPropagation();
    setIsClickFromToolbar(true);
  }, []);

  const handleCanvasDoubleClick = useCallback(
    (event) => {
      if (event.target === canvasRef.current) {
        onDeselectAll();
      }
    },
    [onDeselectAll]
  );

  const canvasStyle = getCanvasStyle(canvasSettings, componentLayout);

  return (
    <div
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="canvas-area w-full h-full bg-gray-100 overflow-auto"
      style={canvasStyle}
      onClick={handleCanvasClick}
      onMouseDown={() => setIsClickFromToolbar(false)}
      onDoubleClick={handleCanvasDoubleClick}
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
          onToolbarOpen={handleToolbarOpen}
          onToolbarClose={handleToolbarClose}
          isToolbarOpen={openToolbarId === component.id}
          onDeselect={onDeselectAll}
          isViewMode={isViewMode} // Add this prop
        />
      ))}
    </div>
  );
};

export default Canvas;