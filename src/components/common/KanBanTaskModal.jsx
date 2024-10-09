import React, { useState, useEffect } from 'react';

const KanbanTaskModal = ({ isOpen, onClose, onAddTask, columnId, task }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskColor, setTaskColor] = useState('#ffffff');

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskColor(task.color || '#ffffff');
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskColor('#ffffff');
    }
  }, [task]);

  const handleSubmit = () => {
    if (!task) {
      onAddTask(columnId, { title: taskTitle, description: taskDescription, color: taskColor });
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg w-96">
        {task ? (
          <ViewTaskSection
            taskTitle={taskTitle}
            taskDescription={taskDescription}
            taskColor={taskColor}
          />
        ) : (
          <AddNewTaskSection
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            taskColor={taskColor}
            setTaskColor={setTaskColor}
          />
        )}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {!task && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ViewTaskSection = ({ taskTitle, taskDescription, taskColor }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4" style={{ color: taskColor }}>
        {taskTitle}
      </h2>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
        <p className="mt-1 p-2 w-full min-h-[3em] border border-gray-200 rounded-md">
          {taskDescription || 'No description'}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Card Color</h3>
        <div
          className="w-full h-10 border border-gray-300 rounded-md"
          style={{ backgroundColor: taskColor }}
        ></div>
      </div>
    </>
  );
};

const AddNewTaskSection = ({ taskTitle, setTaskTitle, taskDescription, setTaskDescription, taskColor, setTaskColor }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
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
      <div className="mb-4">
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="taskDescription"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows="3"
        />
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
    </>
  );
};

export default KanbanTaskModal;