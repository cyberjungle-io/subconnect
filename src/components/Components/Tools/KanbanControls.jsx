import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const KanbanControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(null);

  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = { id: uuidv4(), title: newColumnTitle.trim() };
      onPropsChange({ columns: [...props.columns, newColumn] });
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
      const updatedColumns = props.columns.map(column => 
        column.id === selectedColumn.id ? { ...column, backgroundColor: color } : column
      );
      onPropsChange({ columns: updatedColumns });
    }
  };

  const updateInnerColumnColor = (color) => {
    if (selectedColumn) {
      const updatedColumns = props.columns.map(column => 
        column.id === selectedColumn.id ? { ...column, innerBackgroundColor: color } : column
      );
      onPropsChange({ columns: updatedColumns });
    }
  };

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
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="flex-grow mr-2 p-2 border rounded"
              placeholder="New Column Name"
            />
            <button
              onClick={addColumn}
              className="px-2 py-1 bg-green-500 text-white rounded mr-1"
            >
              ✓
            </button>
            <button
              onClick={cancelAddColumn}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              ✕
            </button>
          </div>
        )}
        <ul>
          {props.columns.map((column) => (
            <li 
              key={column.id} 
              className={`mb-2 flex items-center justify-between p-2 rounded cursor-pointer ${selectedColumn?.id === column.id ? 'bg-gray-200' : ''}`}
              onClick={() => setSelectedColumn(column)}
            >
              <span>{column.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPropsChange({ columns: props.columns.filter(c => c.id !== column.id) });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
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
