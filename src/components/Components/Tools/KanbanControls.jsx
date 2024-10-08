import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const KanbanControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState(null);
  const listRef = useRef(null);

  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = { id: uuidv4(), title: newColumnTitle.trim() };
      onPropsChange({ columns: [...(props.columns || []), newColumn] });
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const cancelAddColumn = () => {
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const updateColumnColor = (color) => {
    if (selectedColumn) {
      const updatedColumns = (props.columns || []).map(column => 
        column.id === selectedColumn.id ? { ...column, backgroundColor: color } : column
      );
      onPropsChange({ columns: updatedColumns });
    }
  };

  const updateInnerColumnColor = (color) => {
    if (selectedColumn) {
      const updatedColumns = (props.columns || []).map(column => 
        column.id === selectedColumn.id ? { ...column, innerBackgroundColor: color } : column
      );
      onPropsChange({ columns: updatedColumns });
    }
  };

  const handleDragStart = useCallback((e, column) => {
    setDraggedColumn(column);
    e.dataTransfer.setData('text/plain', column.id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const mouseY = e.clientY - listRect.top;
      const itemHeight = listRect.height / props.columns.length;
      let index = Math.floor(mouseY / itemHeight);
      
      // Allow dropping at the end of the list
      if (index >= props.columns.length) {
        index = props.columns.length;
      }
      
      setDropIndicatorIndex(index);
    }
  }, [props.columns]);

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDropIndicatorIndex(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (draggedColumn && dropIndicatorIndex !== null) {
      const newColumns = [...props.columns];
      const fromIndex = newColumns.findIndex(col => col.id === draggedColumn.id);
      newColumns.splice(fromIndex, 1);
      
      // If dropping at the end, use the length of the array as the insert index
      const insertIndex = dropIndicatorIndex >= newColumns.length ? newColumns.length : dropIndicatorIndex;
      newColumns.splice(insertIndex, 0, draggedColumn);
      
      onPropsChange({ columns: newColumns });
    }
    handleDragEnd();
  }, [draggedColumn, dropIndicatorIndex, props.columns, onPropsChange]);

  return (
    <div className="kanban-controls">
      <h3 className="text-lg font-semibold mb-4">Kanban Controls</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Columns</h4>
          <button
            onClick={() => setIsAddingColumn(true)}
            className="text-blue-500 font-bold text-xl"
          >
            +
          </button>
        </div>
        {isAddingColumn && (
          <div className="flex items-center mb-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="w-full pr-16 p-2 border rounded"
                placeholder="New Column Name"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={addColumn}
                  className="h-full px-2 text-green-600 hover:text-green-800"
                >
                  ✓
                </button>
                <button
                  onClick={cancelAddColumn}
                  className="h-full px-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-600 italic mb-2">Drag and Drop to Reorder</p>
        <ul 
          ref={listRef}
          className="min-h-[50px] relative"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        >
          {dropIndicatorIndex !== null && (
            <li 
              className="absolute w-full bg-blue-100 border-2 border-blue-300 rounded-lg transition-all duration-300 ease-in-out animate-pulse"
              style={{ 
                top: `${dropIndicatorIndex * (100 / props.columns.length)}%`,
                height: `${100 / props.columns.length}%`
              }}
            />
          )}
          {(props.columns || []).map((column, index) => (
            <React.Fragment key={column.id}>
              <li
                draggable
                onDragStart={(e) => handleDragStart(e, column)}
                className={`mb-2 flex items-center justify-between p-2 rounded cursor-move 
                  ${selectedColumn?.id === column.id ? 'bg-gray-200' : ''}
                  ${draggedColumn?.id === column.id ? 'opacity-50' : ''}`}
                onClick={() => setSelectedColumn(column)}
              >
                <span>{column.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropsChange({ columns: (props.columns || []).filter(c => c.id !== column.id) });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>

      {selectedColumn && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Customize "{selectedColumn.title}"</h4>
          <div className="flex items-center mb-2">
            <label className="mr-2">Column Color:</label>
            <input 
              type="color" 
              value={selectedColumn.backgroundColor || '#ffffff'}
              onChange={(e) => updateColumnColor(e.target.value)}
              className="cursor-pointer"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Inner Column Color:</label>
            <input 
              type="color" 
              value={selectedColumn.innerBackgroundColor || '#ffffff'}
              onChange={(e) => updateInnerColumnColor(e.target.value)}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanControls;