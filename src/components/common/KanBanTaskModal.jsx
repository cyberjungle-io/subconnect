import React, { useState, useEffect } from 'react';

const KanbanTaskModal = ({ isOpen, onClose, onAddOrUpdateTask, columnId, task }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskColor, setTaskColor] = useState('#ffffff'); // Default to white
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskColor(task.color || '#ffffff');
      setIsEditingTitle(false);
      setIsEditingDescription(false);
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskColor('#ffffff');
      setIsEditingTitle(true);
      setIsEditingDescription(true);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddOrUpdateTask({
        id: task ? task.id : Date.now().toString(),
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        columnId: columnId,
        createdAt: task ? task.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: taskColor,
      });
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDoubleClick = (field) => {
    if (field === 'title') setIsEditingTitle(true);
    if (field === 'description') setIsEditingDescription(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg w-96">
        {task ? (
          isEditingTitle ? (
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="text-xl font-bold mb-4 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
            />
          ) : (
            <h2 className="text-xl font-bold mb-4" onDoubleClick={() => handleDoubleClick('title')}>
              {taskTitle}
            </h2>
          )
        ) : (
          <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        )}
        <form onSubmit={handleSubmit}>
          {!task && (
            <div className="mb-4">
              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="taskTitle"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            {task && !isEditingDescription ? (
              <p
                className="mt-1 p-2 w-full min-h-[3em]"
                onDoubleClick={() => handleDoubleClick('description')}
              >
                {taskDescription || 'No description'}
              </p>
            ) : (
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="3"
                onBlur={() => task && setIsEditingDescription(false)}
                autoFocus={task && isEditingDescription}
              />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="taskColor" className="block text-sm font-medium text-gray-700">
              Card Color
            </label>
            <input
              type="color"
              id="taskColor"
              value={taskColor}
              onChange={(e) => setTaskColor(e.target.value)}
              className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KanbanTaskModal;