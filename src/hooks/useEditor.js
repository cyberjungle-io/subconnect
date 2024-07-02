import { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addColumn, 
  addRow, 
  deleteColumn, 
  deleteRow, 
  updateColumnSize, 
  updateContainerWidth 
} from '../features/editorSlice';

const useEditor = () => {
    const dispatch = useDispatch();
    const {
      mainRows,
      columnWidths,
      columnHeights,
      containerWidths
    } = useSelector(state => state.editor);
    const containerRefs = useRef({});
  
    const handleAddColumn = useCallback((rowIndex, path = []) => {
      console.log('handleAddColumn called with:', { rowIndex, path });
      dispatch(addColumn({ rowIndex, path }));
    }, [dispatch]);
  
  const handleAddRow = useCallback((rowIndex, path = []) => {
    dispatch(addRow({ rowIndex, path }));
  }, [dispatch]);

  const handleDeleteColumn = useCallback((rowIndex, path = []) => {
    dispatch(deleteColumn({ rowIndex, path }));
  }, [dispatch]);

  const handleDeleteRow = useCallback((rowIndex, path = []) => {
    dispatch(deleteRow({ rowIndex, path }));
  }, [dispatch]);

  const handleResizeStart = useCallback((e, columnId, isVertical = false) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = columnWidths[columnId];
    const startHeight = columnHeights[columnId];
    const containerWidth = containerRefs.current[columnId]?.parentElement?.offsetWidth || 0;

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      if (isVertical) {
        const deltaY = moveEvent.clientY - startY;
        dispatch(updateColumnSize({ 
          columnId, 
          height: Math.max(50, startHeight + deltaY) 
        }));
      } else {
        const deltaX = moveEvent.clientX - startX;
        dispatch(updateColumnSize({ 
          columnId, 
          width: Math.max(50, Math.min(startWidth + deltaX, containerWidth - 50)) 
        }));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dispatch, columnWidths, columnHeights]);

  const handleExpandColumn = useCallback((columnId) => {
    const containerWidth = containerRefs.current[columnId].parentElement.offsetWidth;
    const siblingWidths = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
    const availableWidth = containerWidth - siblingWidths + columnWidths[columnId];
    dispatch(updateColumnSize({ columnId, width: availableWidth }));
  }, [dispatch, columnWidths]);

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
    expandColumn: handleExpandColumn,
  };
};

export default useEditor;