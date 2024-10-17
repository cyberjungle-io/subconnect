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
  const [canvasBounds, setCanvasBounds] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasBounds = () => {
      if (canvasRef.current) {
        setCanvasBounds(canvasRef.current.getBoundingClientRect());
      }
    };

    const handleScroll = () => {
      if (canvasRef.current) {
        setScrollPosition({
          x: canvasRef.current.scrollLeft,
          y: canvasRef.current.scrollTop
        });
      }
    };

    updateCanvasBounds(); // Initial bounds calculation
    window.addEventListener('resize', updateCanvasBounds);
    
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasBounds);
      if (canvasElement) {
        canvasElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Update canvas dimensions when components change
  useEffect(() => {
    const updateCanvasDimensions = () => {
      if (canvasRef.current) {
        const { scrollWidth, scrollHeight } = canvasRef.current;
        setCanvasSize({ width: scrollWidth, height: scrollHeight });
      }
    };

    updateCanvasDimensions();
  }, [components]);

  const getDropPosition = useCallback((offset) => {
    if (!canvasBounds) return null;
    return {
      x: offset.x - canvasBounds.left + scrollPosition.x,
      y: offset.y - canvasBounds.top + scrollPosition.y
    };
  }, [canvasBounds, scrollPosition]);

  const findDeepestFlexContainer = useCallback((comps, x, y) => {
    if (!canvasBounds || !canvasRef.current) return null;

    for (const comp of comps) {
      if (comp.type !== 'FLEX_CONTAINER') continue;
      const compElement = canvasRef.current.querySelector(`[data-id="${comp.id}"]`);
      if (!compElement) continue;
      const compRect = compElement.getBoundingClientRect();
      const compPosition = {
        x: compRect.left - canvasBounds.left + scrollPosition.x,
        y: compRect.top - canvasBounds.top + scrollPosition.y,
      };
      if (x >= compPosition.x && x <= compPosition.x + compRect.width &&
          y >= compPosition.y && y <= compPosition.y + compRect.height) {
        // Check for nested flex containers
        const nestedResult = findDeepestFlexContainer(comp.children || [], x, y);
        return nestedResult || { container: comp, position: compPosition };
      }
    }
    return null;
  }, [canvasBounds, scrollPosition]);

  const calculateInsertIndexAndPosition = useCallback((children, dropPosition, containerPosition, isHorizontal, containerRect) => {
    let insertIndex = children.length;
    let indicatorPosition = { ...containerPosition };

    if (children.length === 0) {
      return {
        insertIndex: 0,
        indicatorPosition: {
          x: isHorizontal ? dropPosition.x : containerPosition.x,
          y: isHorizontal ? containerPosition.y : dropPosition.y,
        },
      };
    }

    for (let i = 0; i < children.length; i++) {
      const childElement = canvasRef.current.querySelector(`[data-id="${children[i].id}"]`);
      if (!childElement) continue;
      const childRect = childElement.getBoundingClientRect();
      const childPosition = {
        x: childRect.left - canvasBounds.left + scrollPosition.x,
        y: childRect.top - canvasBounds.top + scrollPosition.y,
      };

      if ((isHorizontal && dropPosition.x < childPosition.x + childRect.width / 2) ||
          (!isHorizontal && dropPosition.y < childPosition.y + childRect.height / 2)) {
        insertIndex = i;
        indicatorPosition = {
          x: isHorizontal ? childPosition.x - 1 : containerPosition.x,
          y: isHorizontal ? containerPosition.y : childPosition.y - 1,
        };
        break;
      }
    }

    // If the indicator is after the last child, adjust its position
    if (insertIndex === children.length) {
      const lastChild = children[children.length - 1];
      const lastChildElement = canvasRef.current.querySelector(`[data-id="${lastChild.id}"]`);
      const lastChildRect = lastChildElement.getBoundingClientRect();
      indicatorPosition = {
        x: isHorizontal ? lastChildRect.right - canvasBounds.left + scrollPosition.x + 1 : containerPosition.x,
        y: isHorizontal ? containerPosition.y : lastChildRect.bottom - canvasBounds.top + scrollPosition.y + 1,
      };
    }

    return { insertIndex, indicatorPosition };
  }, [canvasBounds, scrollPosition]);

  const updateGhostIndicatorForFlexContainer = useCallback((flexContainerResult, dropPosition) => {
    const { container: flexContainer, position: flexPosition } = flexContainerResult;
    const flexElement = canvasRef.current.querySelector(`[data-id="${flexContainer.id}"]`);
    const flexRect = flexElement.getBoundingClientRect();
    const flexChildren = flexContainer.children || [];
    
    const isHorizontal = flexContainer.style.flexDirection === 'row';
    const { insertIndex, indicatorPosition } = calculateInsertIndexAndPosition(
      flexChildren, dropPosition, flexPosition, isHorizontal, flexRect
    );

    setGhostIndicator({
      position: indicatorPosition,
      width: isHorizontal ? 2 : flexRect.width,
      height: isHorizontal ? flexRect.height : 2,
      isFlexContainer: true,
      flexDirection: flexContainer.style.flexDirection || 'row',
    });
  }, [calculateInsertIndexAndPosition]);

  const updateGhostIndicatorForCanvas = useCallback((dropPosition) => {
    let indicatorY = dropPosition.y;
    let insertIndex = components.length;

    for (let i = 0; i < components.length; i++) {
      const componentElement = canvasRef.current.querySelector(`[data-id="${components[i].id}"]`);
      if (!componentElement) continue;
      const componentRect = componentElement.getBoundingClientRect();
      const componentY = componentRect.top - canvasBounds.top + scrollPosition.y;

      if (dropPosition.y < componentY + componentRect.height / 2) {
        indicatorY = componentY - 1;
        insertIndex = i;
        break;
      }
    }

    // If dropping after the last component, adjust the indicator position
    if (insertIndex === components.length) {
      if (components.length > 0) {
        const lastComponentElement = canvasRef.current.querySelector(`[data-id="${components[components.length - 1].id}"]`);
        const lastComponentRect = lastComponentElement.getBoundingClientRect();
        indicatorY = lastComponentRect.bottom - canvasBounds.top + scrollPosition.y + 1;
      } else {
        indicatorY = dropPosition.y;
      }
    }

    // Ensure the indicator doesn't go beyond the canvas size
    indicatorY = Math.min(indicatorY, canvasSize.height);

    setGhostIndicator({
      position: { x: 0, y: indicatorY },
      width: canvasSize.width,
      height: 2,
      isFlexContainer: false,
    });
  }, [components, canvasBounds, scrollPosition, canvasSize]);

  const updateGhostIndicator = useCallback((dropPosition) => {
    if (!dropPosition || !canvasBounds) return;

    const flexContainerResult = findDeepestFlexContainer(components, dropPosition.x, dropPosition.y);

    if (flexContainerResult) {
      updateGhostIndicatorForFlexContainer(flexContainerResult, dropPosition);
    } else {
      updateGhostIndicatorForCanvas(dropPosition);
    }
  }, [components, canvasBounds, findDeepestFlexContainer, updateGhostIndicatorForFlexContainer, updateGhostIndicatorForCanvas]);

  const [, drop] = useDrop({
    accept: ["COMPONENT", "SAVED_COMPONENT"],
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !canvasRef.current || !canvasBounds) return;

      handleAutoScroll(clientOffset.y);

      const dropPosition = getDropPosition(clientOffset);
      if (dropPosition) {
        setMousePosition(dropPosition);
        updateGhostIndicator(dropPosition);
      }
    },
    drop: (item, monitor) => {
      stopAutoScroll();
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
        x: offset.x - canvasBounds.left + scrollPosition.x,
        y: offset.y - canvasBounds.top + scrollPosition.y,
      };

      const flexContainerAtPosition = components.find(comp => {
        if (comp.type !== 'FLEX_CONTAINER') return false;
        const compRect = canvasRef.current.querySelector(`[data-id="${comp.id}"]`).getBoundingClientRect();
        return dropPosition.x >= compRect.left - canvasBounds.left && 
               dropPosition.x <= compRect.right - canvasBounds.left &&
               dropPosition.y >= compRect.top - canvasBounds.top && 
               dropPosition.y <= compRect.bottom - canvasBounds.top;
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
          return (componentLayout === 'vertical' && dropPosition.y < compRect.bottom - canvasBounds.top) ||
                 (componentLayout === 'horizontal' && dropPosition.x < compRect.right - canvasBounds.left);
        });

        if (item.id && isDragModeEnabled) {
          onMoveComponent(item.id, null, insertIndex);
        } else {
          onAddComponent(item.type, null, insertIndex, item.savedComponent);
        }
      }

      // Reset canvas height, clear ghost indicator, and stop auto-scroll after drop
      canvasRef.current.style.height = 'auto';
      setGhostIndicator(null);
      stopAutoScroll();
    },
  });

  const [isClickFromToolbar, setIsClickFromToolbar] = useState(false);
  const [openToolbarId, setOpenToolbarId] = useState(null);
  const [ghostIndicator, setGhostIndicator] = useState(null);

  const stopAutoScroll = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleDragEnd = () => {
      setGhostIndicator(null);
      stopAutoScroll();
    };

    window.addEventListener('dragend', handleDragEnd);

    return () => {
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, [stopAutoScroll]);

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
      const canvasElement = canvasRef.current;
      canvasElement.scrollTop += speed;
      setScrollPosition(prev => ({
        ...prev,
        y: canvasElement.scrollTop
      }));
      
      scrollAnimationRef.current = requestAnimationFrame(scroll);
    };
    scrollAnimationRef.current = requestAnimationFrame(scroll);
  }, []);

  const handleAutoScroll = useCallback((clientY) => {
    const { top, bottom, height } = canvasRef.current.getBoundingClientRect();
    const scrollThreshold = 50;
    const maxScrollSpeed = 10;

    if (clientY < top + scrollThreshold) {
      const speed = -maxScrollSpeed * (1 - (clientY - top) / scrollThreshold);
      startAutoScroll(speed);
    } else if (clientY > bottom - scrollThreshold) {
      const speed = maxScrollSpeed * (1 - (bottom - clientY) / scrollThreshold);
      startAutoScroll(speed);
    } else {
      stopAutoScroll();
    }
  }, [startAutoScroll, stopAutoScroll]);

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
