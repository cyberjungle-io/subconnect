import React, { useState, useEffect, useRef } from 'react';

const KanbanTaskModal = ({ isOpen, onClose, onAddTask, columnId, task, isViewMode }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskColor, setTaskColor] = useState('#ffffff');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

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
    if (task) {
      onAddTask(columnId, { ...task, title: taskTitle, description: taskDescription, color: taskColor });
    } else {
      onAddTask(columnId, { title: taskTitle, description: taskDescription, color: taskColor });
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleModalDoubleClick = (e) => {
    e.stopPropagation(); // Stop the event from propagating
    if (isViewMode) {
      // Add your custom logic for double-clicking while viewing a task
      console.log("Double-clicked while viewing task:", task);
      // For example, you could toggle an edit mode:
      // setIsEditing(!isEditing);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg w-96" onDoubleClick={handleModalDoubleClick}>
        {isViewMode ? (
          <ViewTaskSection
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            taskColor={taskColor}
            isEditingTitle={isEditingTitle}
            setIsEditingTitle={setIsEditingTitle}
            isEditingDescription={isEditingDescription}
            setIsEditingDescription={setIsEditingDescription}
            titleInputRef={titleInputRef}
            descriptionInputRef={descriptionInputRef}
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
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {task ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewTaskSection = ({
  taskTitle, setTaskTitle, taskDescription, setTaskDescription, taskColor,
  isEditingTitle, setIsEditingTitle, isEditingDescription, setIsEditingDescription,
  titleInputRef, descriptionInputRef
}) => {
  return (
    <>
      <div className="mb-4" onDoubleClick={() => setIsEditingTitle(true)}>
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setIsEditingTitle(false);
              }
            }}
            className="text-xl font-bold w-full p-1 border border-gray-300 rounded text-gray-900"
            style={{ backgroundColor: 'white' }}
          />
        ) : (
          <h2 className="text-xl font-bold text-gray-900">
            {taskTitle || 'Untitled Task'}
          </h2>
        )}
      </div>
      <div className="mb-4" onDoubleClick={() => setIsEditingDescription(true)}>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
        {isEditingDescription ? (
          <textarea
            ref={descriptionInputRef}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            onBlur={() => setIsEditingDescription(false)}
            className="mt-1 p-2 w-full min-h-[3em] border border-gray-300 rounded-md text-gray-900"
            rows="3"
          />
        ) : (
          <p className="mt-1 p-2 w-full min-h-[3em] border border-gray-200 rounded-md text-gray-900">
            {taskDescription || 'No description'}
          </p>
        )}
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