import React from 'react';

const TodoControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const handleTitleChange = (e) => {
    onPropsChange({ ...props, title: e.target.value });
  };

  return (
    <div className="todo-controls">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Title
        <input
          type="text"
          value={props.title || ''}
          onChange={handleTitleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </label>
      {/* Add more controls as needed */}
    </div>
  );
};

export default TodoControls;

