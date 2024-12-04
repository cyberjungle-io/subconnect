import React, { useState, useEffect } from 'react';
import CommentsSection from './CommentsSection';
import DeleteConfirmModal from './DeleteConfirmModal';

const KanBanTaskModal = ({ isOpen, onClose, onSubmit, onDelete, task, isReadOnly }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task);
    setIsDeleteModalOpen(false);
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

          <div className="flex justify-between items-center gap-2 mt-4">
            {task && !isReadOnly && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Task
              </button>
            )}
            
            <div className="flex gap-2 ml-auto">
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
          </div>
        </form>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default KanBanTaskModal;
