import React, { useState, useEffect, useRef } from 'react';
import CommentsSection from './CommentsSection'; // You'll need to create this component
import { useSelector } from 'react-redux';

// Add this helper function at the top of the file
const findTodoLists = (components) => {
  let todoLists = [];
  components.forEach(component => {
    if (component.type === 'TODO') {
      todoLists.push(component);
    }
    if (component.children && component.children.length > 0) {
      todoLists = todoLists.concat(findTodoLists(component.children));
    }
  });
  return todoLists;
};

const KanbanTaskModal = ({ isOpen, onClose, onAddTask, columnId, task, isViewMode }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskColor, setTaskColor] = useState('#ffffff');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [linkedTodoList, setLinkedTodoList] = useState(task?.linkedTodoList || null);
  const allComponents = useSelector(state => state.editor.components);
  const todoLists = findTodoLists(allComponents);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskColor(task.color || '#ffffff');
      setHasChanges(false);
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskColor('#ffffff');
      setHasChanges(false);
    }
  }, [task]);

  const handleChange = (field, value) => {
    switch (field) {
      case 'title':
        setTaskTitle(value);
        break;
      case 'description':
        setTaskDescription(value);
        break;
      case 'color':
        setTaskColor(value);
        break;
    }
    setHasChanges(true);
  };

  const handleLinkTodoList = (todoListId) => {
    setLinkedTodoList(todoListId);
    setHasChanges(true);
  };

  const handleSubmit = () => {
    if (task) {
      onAddTask(columnId, { ...task, title: taskTitle, description: taskDescription, color: taskColor, linkedTodoList });
    } else {
      onAddTask(columnId, { title: taskTitle, description: taskDescription, color: taskColor, linkedTodoList });
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
      <div className={`bg-white rounded-lg ${isViewMode ? 'w-3/4 max-w-6xl' : 'w-96'}`} onDoubleClick={handleModalDoubleClick}>
        <div className={`p-6 ${isViewMode ? 'flex' : ''}`}>
          {isViewMode ? (
            <>
              <div className="flex-1 pr-6">
                <ViewTaskSection
                  taskTitle={taskTitle}
                  setTaskTitle={setTaskTitle}
                  taskDescription={taskDescription}
                  setTaskDescription={setTaskDescription}
                  taskColor={taskColor}
                  setTaskColor={setTaskColor}
                  isEditingTitle={isEditingTitle}
                  setIsEditingTitle={setIsEditingTitle}
                  isEditingDescription={isEditingDescription}
                  setIsEditingDescription={setIsEditingDescription}
                  titleInputRef={titleInputRef}
                  descriptionInputRef={descriptionInputRef}
                  handleChange={handleChange}
                  linkedTodoList={linkedTodoList}
                  todoLists={todoLists}
                  handleLinkTodoList={handleLinkTodoList}
                />
              </div>
              <div className="w-1/2 pl-6 border-l">
                <CommentsSection taskId={task.id} />
              </div>
            </>
          ) : (
            <AddNewTaskSection
              taskTitle={taskTitle}
              taskDescription={taskDescription}
              taskColor={taskColor}
              handleChange={handleChange}
              linkedTodoList={linkedTodoList}
              todoLists={todoLists}
              handleLinkTodoList={handleLinkTodoList}
            />
          )}
        </div>
        <div className="flex justify-end mt-4 p-6 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {(task && hasChanges) || (!task && (taskTitle || taskDescription || taskColor !== '#ffffff')) ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {task ? 'Update Task' : 'Add Task'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ViewTaskSection = ({
  taskTitle, setTaskTitle, taskDescription, setTaskDescription, taskColor, setTaskColor,
  isEditingTitle, setIsEditingTitle, isEditingDescription, setIsEditingDescription,
  titleInputRef, descriptionInputRef, handleChange,
  linkedTodoList,
  todoLists,
  handleLinkTodoList
}) => {
  return (
    <>
      <div className="mb-4" onDoubleClick={() => setIsEditingTitle(true)}>
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={taskTitle}
            onChange={(e) => handleChange('title', e.target.value)}
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
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => setIsEditingDescription(false)}
            className="mt-1 p-2 w-full min-h-[3em] border border-gray-300 rounded-md text-gray-900"
            rows="3"
          />
        ) : (
          <p className="mt-1 p-2 w-full min-h-[3em] text-gray-900">
            {taskDescription || 'No description'}
          </p>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Card Color</h3>
        <div className="flex items-center">
          <div
            className="w-10 h-10 border border-gray-300 rounded-md mr-2"
            style={{ backgroundColor: taskColor }}
          ></div>
          <input
            type="color"
            value={taskColor}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-8 h-8"
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Linked Todo List</h3>
        <select
          value={linkedTodoList || ''}
          onChange={(e) => handleLinkTodoList(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">None</option>
          {todoLists.map((todoList) => (
            <option key={todoList.id} value={todoList.id}>
              {todoList.props.title || 'Untitled Todo List'}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

const AddNewTaskSection = ({
  taskTitle, taskDescription, taskColor, handleChange,
  linkedTodoList,
  todoLists,
  handleLinkTodoList
}) => {
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
          onChange={(e) => handleChange('title', e.target.value)}
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
          onChange={(e) => handleChange('description', e.target.value)}
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
          onChange={(e) => handleChange('color', e.target.value)}
          className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="linkedTodoList" className="block text-sm font-medium text-gray-700">
          Linked Todo List
        </label>
        <select
          id="linkedTodoList"
          value={linkedTodoList || ''}
          onChange={(e) => handleLinkTodoList(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">None</option>
          {todoLists.map((todoList) => (
            <option key={todoList.id} value={todoList.id}>
              {todoList.props.title || 'Untitled Todo List'}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default KanbanTaskModal;
