import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { executeAICommands } from '../../../utils/aiCommandExecutor';

const AIFloatingChat = ({ onClose, initialPosition = { x: 300, y: 100 } }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef(null);
  const dispatch = useDispatch();
  
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
    if (!input.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      const newUserMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, newUserMessage]);
      setInput('');

      console.log('Sending request to AI service...');

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get AI response: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('AI response data:', data);

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      
      if (data.commands && data.commands.length > 0) {
        console.log('Executing AI commands:', data.commands);
        executeAICommands(data.commands, dispatch);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsProcessing(false);
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
      className="fixed bg-white rounded-lg shadow-xl z-[980] w-96"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        height: '500px',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="chat-header bg-blue-600 text-white px-4 py-2 rounded-t-lg flex justify-between items-center cursor-move">
        <h3>AI Design Assistant</h3>
        <button onClick={onClose} className="hover:text-gray-200">
          <FaTimes />
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-100 ml-8' 
                : msg.role === 'system'
                ? 'bg-red-100'
                : 'bg-gray-100 mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isProcessing ? 'Processing...' : 'Type your design request...'}
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIFloatingChat; 