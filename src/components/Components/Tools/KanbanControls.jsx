import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const KanbanControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = { id: uuidv4(), title: newColumnTitle.trim() };
      onPropsChange({ columns: [...props.columns, newColumn] });
      setNewColumnTitle('');
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: uuidv4(),
        title: newTaskTitle.trim(),
        columnId: props.columns[0].id,
        createdAt: new Date().toISOString(),
      };
      onPropsChange({ tasks: [...props.tasks, newTask] });
      setNewTaskTitle('');
    }
  };

  return (
    <div className="kanban-controls">
      <h3 className="text-lg font-semibold mb-4">Kanban Controls</h3>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Add Column</h4>
        <div className="flex">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="flex-grow mr-2 p-2 border rounded"
            placeholder="Column Title"
          />
          <button onClick={addColumn} className="px-4 py-2 bg-blue-500 text-white rounded">
            Add
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Add Task</h4>
        <div className="flex">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-grow mr-2 p-2 border rounded"
            placeholder="Task Title"
          />
          <button onClick={addTask} className="px-4 py-2 bg-blue-500 text-white rounded">
            Add
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Existing Columns</h4>
        <ul>
          {props.columns.map((column) => (
            <li key={column.id} className="mb-2">
              {column.title}
              <button
                onClick={() => onPropsChange({ columns: props.columns.filter(c => c.id !== column.id) })}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KanbanControls;
