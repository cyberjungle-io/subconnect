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
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        />
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
          Add Task
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
      }}>
        <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
        {task ? renderEditTaskForm() : renderNewTaskForm()}
      </div>
    </div>
  );
};

export default TodoModal;
