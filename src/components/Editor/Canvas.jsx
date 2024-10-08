import React, { useRef, useCallback, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from 'react-redux';
import ComponentRenderer from "../Components/Renderers/ComponentRenderer";
import GhostDropIndicator from "../common/GhostDropIndicator";
import { v4 as uuidv4 } from 'uuid';
import { componentTypes } from '../Components/componentConfig';

export const getCanvasStyle = (canvasSettings, componentLayout) => ({
  ...canvasSettings.style,
  display: 'flex',
  flexDirection: componentLayout === 'vertical' ? 'row' : 'column',
  flexWrap: 'nowrap',
  alignItems: 'stretch',
  alignContent: 'stretch',
  minHeight: "100%", // Changed from "500px" to "100%"
  height: 'auto', // Changed from '100%' to 'auto'
  position: 'relative',
  padding: '20px',
  gap: '20px',
  overflowY: 'auto',
});

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
  onDeselectAll,
  isViewMode = false,
  onUpdateCanvasSettings,
}) => {
  const { backgroundColor = '#ffffff', componentLayout = 'vertical', style = {} } = useSelector(state => state.editor.globalSettings || {});
  const canvasSettings = useSelector(state => state.editor.canvasSettings);
  const canvasRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const [, drop] = useDrop({
    accept: ["COMPONENT", "SAVED_COMPONENT"],
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasElement = canvasRef.current;

      if (!offset || !canvasElement) return;

      const canvasBounds = canvasElement.getBoundingClientRect();
      const dropPosition = {
        x: offset.x - canvasBounds.left,
        y: offset.y - canvasBounds.top,
      };

      const flexContainerAtPosition = components.find(comp => {
        if (comp.type !== 'FLEX_CONTAINER') return false;
        const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
        return dropPosition.x >= compRect.left && dropPosition.x <= compRect.right &&
               dropPosition.y >= compRect.top && dropPosition.y <= compRect.bottom;
      });

      if (flexContainerAtPosition) {
        const flexRect = canvasRef.current.querySelector(`[data-id="${flexContainerAtPosition.id}"]`).getBoundingClientRect();
        const flexChildren = flexContainerAtPosition.children || [];
        
        let insertIndex = flexChildren.length;
        let indicatorPosition = { 
          x: flexRect.left - canvasBounds.left, 
          y: flexRect.top - canvasBounds.top 
        };
        let indicatorWidth = 50; // Default width
        let indicatorHeight = flexRect.height;

        for (let i = 0; i < flexChildren.length; i++) {
          const childRect = canvasRef.current.querySelector(`[data-id="${flexChildren[i].id}"]`).getBoundingClientRect();
          if (dropPosition.x < childRect.right - canvasBounds.left) {
            insertIndex = i;
            indicatorPosition.x = childRect.left - canvasBounds.left;
            indicatorWidth = Math.min(50, childRect.width);
            break;
          }
        }

        // If it's after all children, position it at the end
        if (insertIndex === flexChildren.length && flexChildren.length > 0) {
          const lastChildRect = canvasRef.current.querySelector(`[data-id="${flexChildren[flexChildren.length - 1].id}"]`).getBoundingClientRect();
          indicatorPosition.x = lastChildRect.right - canvasBounds.left;
        }

        setGhostIndicator({
          position: indicatorPosition,
          width: indicatorWidth,
          height: indicatorHeight,
          isFlexContainer: true,
          flexDirection: flexContainerAtPosition.style.flexDirection || 'row',
        });
      } else {
        const lastComponentRect = components.length > 0
          ? canvasRef.current.querySelector(`[data-id="${components[components.length - 1].id}"]`).getBoundingClientRect()
          : { bottom: canvasBounds.top };

        const indicatorY = Math.max(
          lastComponentRect.bottom - canvasBounds.top,
          dropPosition.y
        );

        setGhostIndicator({
          position: {
            x: 0,
            y: indicatorY,
          },
          width: canvasBounds.width,
          height: 200,
          isFlexContainer: false,
        });

        // Auto-scroll logic
        const scrollThreshold = 100; // pixels from top/bottom to trigger scroll
        const maxScrollSpeed = 15; // maximum pixels to scroll per frame

        let scrollSpeed = 0;
        if (dropPosition.y < scrollThreshold) {
          // Near top edge, scroll up
          scrollSpeed = -getScrollSpeed(dropPosition.y, scrollThreshold, maxScrollSpeed);
        } else if (dropPosition.y > canvasBounds.height - scrollThreshold) {
          // Near bottom edge, scroll down
          scrollSpeed = getScrollSpeed(canvasBounds.height - dropPosition.y, scrollThreshold, maxScrollSpeed);
        }

        if (scrollSpeed !== 0) {
          startAutoScroll(scrollSpeed);
        } else {
          stopAutoScroll();
        }

        // Extend canvas if necessary
        if (indicatorY + 200 > canvasElement.scrollHeight) {
          canvasElement.style.height = `${indicatorY + 200}px`;
        }
      }
    },
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      const offset = monitor.getClientOffset();
      const canvasElement = canvasRef.current;

      if (!offset || !canvasElement) {
        onAddComponent(item.type, null, null, item.savedComponent);
        setGhostIndicator(null); // Clear the ghost indicator
        return;
      }

      const canvasBounds = canvasElement.getBoundingClientRect();
      const dropPosition = {
        x: offset.x - canvasBounds.left,
        y: offset.y - canvasBounds.top,
      };

      const flexContainerAtPosition = components.find(comp => {
        if (comp.type !== 'FLEX_CONTAINER') return false;
        const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
        return dropPosition.x >= compRect.left && dropPosition.x <= compRect.right &&
               dropPosition.y >= compRect.top && dropPosition.y <= compRect.bottom;
      });

      if (flexContainerAtPosition) {
        if (item.id && isDragModeEnabled) {
          onMoveComponent(item.id, flexContainerAtPosition.id);
        } else {
          onAddComponent(item.type, flexContainerAtPosition.id, null, item.savedComponent);
        }
      } else {
        const insertIndex = components.findIndex(comp => {
          const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
          return (componentLayout === 'vertical' && dropPosition.y < compRect.bottom) ||
                 (componentLayout === 'horizontal' && dropPosition.x < compRect.right);
        });

        if (item.id && isDragModeEnabled) {
          onMoveComponent(item.id, null, insertIndex);
        } else {
          onAddComponent(item.type, null, insertIndex, item.savedComponent);
        }
      }

      // Reset canvas height and stop auto-scroll after drop
      canvasRef.current.style.height = 'auto';
      setGhostIndicator(null);
      stopAutoScroll();
    },
  });

  const [isClickFromToolbar, setIsClickFromToolbar] = useState(false);
  const [openToolbarId, setOpenToolbarId] = useState(null);
  const [ghostIndicator, setGhostIndicator] = useState(null);

  useEffect(() => {
    return () => setGhostIndicator(null);
  }, []);

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

  const startAutoScroll = useCallback((speed) => {
    if (scrollAnimationRef.current) return;
    
    const scroll = () => {
      canvasRef.current.scrollTop += speed;
      scrollAnimationRef.current = requestAnimationFrame(scroll);
    };
    scrollAnimationRef.current = requestAnimationFrame(scroll);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }, []);

  const getScrollSpeed = (distance, threshold, maxSpeed) => {
    // Quadratic easing function
    const ratio = 1 - (distance / threshold);
    return Math.round(maxSpeed * ratio * ratio);
  };

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
          onAddChild={(parentId, childType, savedComponent) =>
            onAddComponent(childType, parentId, null, savedComponent)
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
          isViewMode={isViewMode}
        />
      ))}
      {ghostIndicator && (
        <GhostDropIndicator
          position={ghostIndicator.position}
          width={ghostIndicator.width}
          height={ghostIndicator.height}
          isFlexContainer={ghostIndicator.isFlexContainer}
          flexDirection={ghostIndicator.flexDirection}
          isInline={ghostIndicator.isInline}
        />
      )}
    </div>
  );
};

export default Canvas;