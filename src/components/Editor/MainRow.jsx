import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addColumn } from '../../features/editorSlice';
import Column from './Column';
import AddColumnButton from './AddColumnButton';

// Memoized selector for better performance
const selectMainRow = (state, rowId) => {
  const row = state.editor.mainRows.find(row => row.id === rowId);
  console.log('Selected row:', row); // Debugging
  return row;
};

const MainRow = React.memo(({ rowId, rowIndex }) => {
  const dispatch = useDispatch();
  const mainRow = useSelector(state => selectMainRow(state, rowId));
  const containerWidth = useSelector(state => state.editor.containerWidths[rowId] || 0);
  const columnWidths = useSelector(state => state.editor.columnWidths);

  console.log('MainRow render:', { rowId, rowIndex, mainRow, containerWidth, columnWidths }); // Debugging

  const handleAddColumn = React.useCallback(() => {
    console.log('Adding column to row:', rowIndex); // Debugging
    dispatch(addColumn({ rowIndex }));
  }, [dispatch, rowIndex]);

  const totalColumnWidth = useMemo(() => {
    if (!mainRow || !mainRow.columns) {
      console.warn('MainRow or columns undefined:', mainRow); // Debugging
      return 0;
    }
    return mainRow.columns.reduce((sum, col) => sum + (columnWidths[col.id] || 0), 0);
  }, [mainRow, columnWidths]);

  const canAddColumn = containerWidth - totalColumnWidth >= 220;

  if (!mainRow) {
    console.error('MainRow not found for rowId:', rowId); // Debugging
    return <div>Error: Row not found</div>;
  }

  return (
    <div 
      className="border border-gray-300 p-4 mb-4"
      ref={el => {
        if (el && el.offsetWidth !== containerWidth) {
          console.log('Updating container width:', el.offsetWidth); // Debugging
          dispatch({ type: 'editor/updateContainerWidth', payload: { containerId: rowId, width: el.offsetWidth } });
        }
      }}
    >
      <h2 className="text-xl font-semibold mb-2">Main Row {mainRow.id}</h2>
      
      <div className="flex gap-2">
        {mainRow.columns && mainRow.columns.map((column) => (
          <Column 
            key={column.id} 
            column={column} 
            rowIndex={rowIndex} 
          />
        ))}
        
        {canAddColumn && (
          <AddColumnButton onClick={handleAddColumn} />
        )}
      </div>
    </div>
  );
});

export default MainRow;