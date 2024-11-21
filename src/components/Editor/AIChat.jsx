import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPlay } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { processAICommand } from '../../features/editorSlice';

const AIChat = ({ onClose, initialPosition = { x: 100, y: 100 } }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const dispatch = useDispatch();
  const selectedIds = useSelector(state => state.editor.selectedIds);

  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const response = await dispatch(processAICommand({
        command: input,
        selectedIds,
      })).unwrap();

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'error',
        content: error.message,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={chatRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-xl w-96 flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        height: '500px',
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="chat-header flex justify-between items-center p-3 bg-blue-50 border-b border-gray-200 cursor-move rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-700">AI Assistant</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Type your request..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaPlay />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
