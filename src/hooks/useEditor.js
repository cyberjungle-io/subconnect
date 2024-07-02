import { useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  updateColumnSize,
  updateContainerWidth,
} from "../features/editorSlice";

const useEditor = () => {
  const dispatch = useDispatch();
  const { mainRows, columnWidths, columnHeights, containerWidths } =
    useSelector((state) => state.editor);
  const containerRefs = useRef({});

  const handleAddColumn = useCallback(
    (rowIndex, path = []) => {
      console.log("handleAddColumn called with:", { rowIndex, path });
      dispatch(addColumn({ rowIndex, path }));
    },
    [dispatch]
  );

  const handleAddRow = useCallback(
    (rowIndex, path = []) => {
      dispatch(addRow({ rowIndex, path }));
    },
    [dispatch]
  );

  const handleDeleteColumn = useCallback(
    (rowIndex, path = []) => {
      dispatch(deleteColumn({ rowIndex, path }));
    },
    [dispatch]
  );

  const handleDeleteRow = useCallback(
    (rowIndex, path = []) => {
      dispatch(deleteRow({ rowIndex, path }));
    },
    [dispatch]
  );

  const handleResizeStart = useCallback(
    (e, columnId, isVertical = false) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = columnWidths[columnId];
      const startHeight = columnHeights[columnId];
      const containerWidth =
        containerRefs.current[columnId]?.parentElement?.offsetWidth || 0;

      const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        if (isVertical) {
          const deltaY = moveEvent.clientY - startY;
          dispatch(
            updateColumnSize({
              columnId,
              height: Math.max(50, startHeight + deltaY),
            })
          );
        } else {
          const deltaX = moveEvent.clientX - startX;
          dispatch(
            updateColumnSize({
              columnId,
              width: Math.max(
                50,
                Math.min(startWidth + deltaX, containerWidth - 50)
              ),
            })
          );
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch, columnWidths, columnHeights]
  );

  const handleExpandColumnWidth = useCallback(
    (columnId) => {
      const columnElement = containerRefs.current[columnId];
      if (!columnElement) return;

      const parentElement = columnElement.parentElement;
      const parentWidth = parentElement.offsetWidth;
      const siblingWidths = Array.from(parentElement.children)
        .filter((child) => child !== columnElement)
        .reduce((sum, sibling) => sum + sibling.offsetWidth, 0);

      const availableWidth = parentWidth - siblingWidths;
      const newWidth = Math.max(columnWidths[columnId], availableWidth);

      dispatch(updateColumnSize({ columnId, width: newWidth }));
    },
    [dispatch, columnWidths]
  );

  const handleExpandColumnHeight = useCallback((columnId) => {
    const columnElement = containerRefs.current[columnId];
    if (!columnElement) return;

    const parentElement = columnElement.parentElement;
    const parentHeight = parentElement.offsetHeight;
    
    // Get all sibling elements
    const siblings = Array.from(parentElement.children).filter(child => child !== columnElement);
    
    // Calculate the maximum height of sibling elements
    const maxSiblingHeight = Math.max(...siblings.map(sibling => sibling.offsetHeight), 0);
    
    // Calculate the total height of all siblings
    const totalSiblingsHeight = siblings.reduce((sum, sibling) => sum + sibling.offsetHeight, 0);
    
    // Calculate available height
    const availableHeight = parentHeight - totalSiblingsHeight + (columnHeights[columnId] || 0);
    
    // New height should be the maximum of current height, available height, and max sibling height
    const newHeight = Math.max(columnHeights[columnId] || 0, availableHeight, maxSiblingHeight);

    console.log('Expanding height:', { 
      columnId, 
      newHeight, 
      parentHeight, 
      maxSiblingHeight, 
      totalSiblingsHeight,
      availableHeight 
    });

    dispatch(updateColumnSize({ columnId, height: newHeight }));
  }, [dispatch, columnHeights]);

  return {
    mainRows,
    columnWidths,
    columnHeights,
    containerWidths,
    containerRefs,
    addColumn: handleAddColumn,
    addRow: handleAddRow,
    deleteColumn: handleDeleteColumn,
    deleteRow: handleDeleteRow,
    handleResizeStart,
    expandColumnWidth: handleExpandColumnWidth,
    expandColumnHeight: handleExpandColumnHeight,
  };
};

export default useEditor;
