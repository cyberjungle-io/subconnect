import { useCallback, useRef, useState } from "react";
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
  const [isResizing, setIsResizing] = useState(false);
  const [manuallyResizedColumns, setManuallyResizedColumns] = useState({});

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
    (e, columnId, isVertical) => {
      e.preventDefault();
      setIsResizing(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = columnWidths[columnId];
      const startHeight = columnHeights[columnId];

      const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        if (isVertical) {
          const deltaY = moveEvent.clientY - startY;
          const newHeight = Math.max(50, startHeight + deltaY);
          dispatch(updateColumnSize({ columnId, height: newHeight }));
          setManuallyResizedColumns(prev => ({ ...prev, [columnId]: true }));
        } else {
          const deltaX = moveEvent.clientX - startX;
          const newWidth = Math.max(50, startWidth + deltaX);
          dispatch(updateColumnSize({ columnId, width: newWidth }));
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch, columnWidths, columnHeights]
  );

  const resetColumnManualResize = useCallback((columnId) => {
    setManuallyResizedColumns(prev => {
      const newState = { ...prev };
      delete newState[columnId];
      return newState;
    });
  }, []);

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

  const handleExpandColumnHeight = useCallback((columnId, rowIndex, path) => {
    console.log('Expanding column height:', { columnId, rowIndex, path });
    
    const columnElement = containerRefs.current[columnId];
    if (!columnElement) {
      console.error('Column element not found in containerRefs');
      return;
    }

    let currentRow = mainRows[rowIndex];
    if (!currentRow) {
      console.error('Row not found for index:', rowIndex);
      return;
    }

    for (let i = 0; i < path.length; i += 2) {
      if (!currentRow || !currentRow.columns) {
        console.error('Invalid path at step', i);
        return;
      }
      const columnIndex = currentRow.columns.findIndex(col => col.id === path[i]);
      if (columnIndex === -1) {
        console.error('Column not found at path step', i);
        return;
      }
      if (i === path.length - 1) {
        currentRow = currentRow.columns[columnIndex];
      } else {
        if (!currentRow.columns[columnIndex].rows || !currentRow.columns[columnIndex].rows[path[i + 1]]) {
          console.error('Invalid nested row at path step', i + 1);
          return;
        }
        currentRow = currentRow.columns[columnIndex].rows[path[i + 1]];
      }
    }

    if (!currentRow || !currentRow.columns) {
      console.error('Invalid row or columns after path traversal');
      return;
    }

    const maxHeight = Math.max(...currentRow.columns.map(col => columnHeights[col.id] || 0));
    const newHeight = Math.max(maxHeight, columnElement.scrollHeight);

    console.log('Calculated new height:', newHeight);

    dispatch(updateColumnSize({ columnId, height: newHeight }));
    setManuallyResizedColumns(prev => ({ ...prev, [columnId]: true }));
  }, [dispatch, mainRows, columnHeights, containerRefs]);

  // Add this new function to handle updating column size
  const handleUpdateColumnSize = useCallback((payload) => {
    dispatch(updateColumnSize(payload));
  }, [dispatch]);

  return {
    mainRows,
    columnWidths,
    columnHeights,
    containerRefs,
    addColumn: handleAddColumn,
    addRow: handleAddRow,
    deleteColumn: handleDeleteColumn,
    deleteRow: handleDeleteRow,
    handleResizeStart,
    expandColumnWidth: handleExpandColumnWidth,
    expandColumnHeight: handleExpandColumnHeight,
    updateColumnSize: useCallback((payload) => dispatch(updateColumnSize(payload)), [dispatch]),
    isResizing,
    manuallyResizedColumns,
    resetColumnManualResize,
  };
};

export default useEditor;