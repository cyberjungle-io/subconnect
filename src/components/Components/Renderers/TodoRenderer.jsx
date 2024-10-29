import React, { useState, useCallback } from 'react';
import TodoModal from '../../common/TodoModal';

const TodoRenderer = ({ component, isViewMode, onUpdate }) => {
  const { props, style } = component;
  const { tasks = [] } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [lastTap, setLastTap] = useState({ id: null, time: 0 });

  const getDisplayTasks = () => {
    if (!isViewMode && tasks.length === 0) {
      return [{
        id: 'dummy',
        name: 'Example task',
        completed: false
      }];
    }
    return tasks;
  };

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

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div style={{
      ...style,
      width: '100%',
      height: '100%',
      padding: style.padding || '20px',
      backgroundColor: style.backgroundColor || '#f9f9f9',
      boxShadow: style.boxShadow || '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }} className="todo-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '10px' }}>
        <h3 style={{
          margin: 0,
          padding: '0 10px',
          color: style.titleColor || style.color || '#333',
          borderBottom: `2px solid ${style.accentColor || '#4a90e2'}`,
          paddingBottom: '10px',
          fontSize: style.titleFontSize,
          fontFamily: style.titleFontFamily,
          fontWeight: style.titleFontWeight,
          fontStyle: style.titleFontStyle,
          textDecoration: style.titleTextDecoration,
          textAlign: style.titleTextAlign,
        }}>{props.title || 'Todo List'}</h3>
        <button
          onClick={() => isViewMode && openModal()}
          style={{
            backgroundColor: style.accentColor || '#4a90e2',
            color: style.buttonTextColor || 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
          }}
        >
          +
        </button>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {getDisplayTasks().map(task => (
          <li key={task.id} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: style.taskBackgroundColor || 'white',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
          }} onClick={() => isViewMode && handleTaskClick(task)}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                if (task.id !== 'dummy') {
                  handleToggleTask(task.id);
                }
              }}
              disabled={!isViewMode || task.id === 'dummy'}
              style={{ marginRight: '10px' }}
            />
            <span style={{
              textDecoration: task.completed ? 'line-through' : style.taskTextDecoration || 'none',
              color: task.completed ? '#888' : style.taskTextColor || '#333',
              fontSize: style.taskFontSize,
              fontFamily: style.taskFontFamily,
              fontWeight: style.taskFontWeight,
              fontStyle: style.taskFontStyle,
              flexGrow: 1,
            }}>
              {task.name}
            </span>
          </li>
        ))}
      </ul>

      {/* Add completion percentage indicator */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        color: '#888',
        paddingBottom: '5px',
      }}>
        {completedTasks}/{totalTasks} ({completionPercentage}%)
      </div>

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
