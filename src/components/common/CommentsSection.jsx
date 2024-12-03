import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CommentsSection = ({ taskId, onAddComment, comments = [] }) => {
  console.log('CommentsSection initialized with taskId:', taskId);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        author: currentUser?.username || 'Guest',
        author_id: currentUser?._id,
        text: newComment,
        timestamp: new Date().toISOString(),
      };
      onAddComment(newCommentObj);
      setNewComment('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Comments</h3>
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-3 rounded">
              <p className="font-medium">{comment.author}</p>
              <p>{comment.text}</p>
              <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmitComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
          rows="3"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;