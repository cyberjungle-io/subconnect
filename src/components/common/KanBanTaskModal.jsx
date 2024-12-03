import React, { useState, useEffect } from 'react';
import CommentsSection from './CommentsSection';

const KanBanTaskModal = ({ isOpen, onClose, onSubmit, task, isReadOnly }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setComments(task.comments || []);
    } else {
      setTitle('');
      setDescription('');
      setComments([]);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isReadOnly) {
      onSubmit({
        ...task,
        title,
        description,
        comments
      });
    }
  };

  const handleAddComment = (newComment) => {
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    onSubmit({
      ...task,
      title,
      description,
      comments: updatedComments
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
         style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl" 
           style={{ position: 'relative' }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task title"
              disabled={isReadOnly}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task description"
              rows="3"
              disabled={isReadOnly}
            />
          </div>
          
          {task && (
            <CommentsSection
              taskId={task.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {task ? 'Update' : 'Create'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default KanBanTaskModal;
