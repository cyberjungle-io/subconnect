import React, { useState, useEffect } from 'react';

const TodoModal = ({ task, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: task ? task.id : Date.now(), name, description });
    onClose();
  };

  const renderNewTaskForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows="3"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderEditTaskForm = () => (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <strong>Name: </strong>
        {editingField === 'name' ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setEditingField(null)}
            autoFocus
            style={{ width: '100%', padding: '5px' }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditingField('name')}
            style={{ cursor: 'pointer', display: 'inline-block', width: '100%' }}
          >
            {name}
          </span>
        )}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Description: </strong>
        {editingField === 'description' ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setEditingField(null)}
            autoFocus
            style={{ width: '100%', padding: '5px' }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditingField('description')}
            style={{ cursor: 'pointer', display: 'inline-block', width: '100%' }}
          >
            {description || 'No description'}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="submit" style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Update Task
        </button>
        <button type="button" onClick={onClose} style={{
          backgroundColor: '#ccc',
          color: 'black',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </form>
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Add New Task'}</h2>
        {task ? renderEditTaskForm() : renderNewTaskForm()}
      </div>
    </div>
  );
};

export default TodoModal;
