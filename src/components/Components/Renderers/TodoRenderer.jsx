import React, { useState, useCallback } from 'react';
import TodoModal from '../../common/TodoModal';

const TodoRenderer = ({ component, isViewMode, onUpdate }) => {
  const { props, style } = component;
  const { tasks = [] } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [lastTap, setLastTap] = useState({ id: null, time: 0 });

  const handleAddTask = (newTask) => {
    const updatedTasks = [...tasks, { id: Date.now(), ...newTask, completed: false }];
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });
  };

  const handleEditTask = (editedTask) => {
    const updatedTasks = tasks.map(task =>
      task.id === editedTask.id ? { ...task, ...editedTask } : task
    );
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleTaskClick = useCallback((task) => {
    const now = Date.now();
    if (lastTap.id === task.id && now - lastTap.time < 300) {
      // Double tap detected
      openModal(task);
    }
    setLastTap({ id: task.id, time: now });
  }, [lastTap]);

  return (
    <div style={{
      ...style,
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }} className="todo-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{
          margin: 0,
          color: '#333',
          borderBottom: '2px solid #4a90e2',
          paddingBottom: '10px',
        }}>{props.title || 'Todo List'}</h3>
        {isViewMode && (
          <button
            onClick={() => openModal()}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            +
          </button>
        )}
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
          }} onClick={() => isViewMode && handleTaskClick(task)}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleTask(task.id);
              }}
              disabled={!isViewMode}
              style={{ marginRight: '10px' }}
            />
            <span style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : '#333',
              flexGrow: 1,
            }}>
              {task.name}
            </span>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <TodoModal
          task={editingTask}
          onSave={editingTask ? handleEditTask : handleAddTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TodoRenderer;
