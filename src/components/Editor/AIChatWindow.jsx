import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addMessage, changeProvider } from '../../features/aiChatSlice';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { LLMProviders } from '../../services/llm/llmService';
import { aiAddComponent } from '../../features/editorSlice';
import { AICommandExecutor } from '../../services/aiExecutor';
import { format } from 'date-fns';

const TypingIndicator = () => (
  <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg w-16">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const Message = ({ message, timestamp }) => (
  <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
    <div className="flex flex-col gap-1">
      <div
        className={`inline-block p-3 rounded-lg max-w-[85%] ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.content}
      </div>
      <span className="text-xs text-gray-500">
        {format(timestamp || new Date(), 'h:mm a')}
      </span>
    </div>
  </div>
);

const isRecent = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  return now.getTime() - messageTime.getTime() < 60000; // Less than 1 minute ago
};

const AIChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const { messages, isLoading, provider } = useSelector(state => state.aiChat);
  const selectedIds = useSelector(state => state.editor.selectedIds);
  const components = useSelector(state => state.editor.components);
  
  // Get the selected component details
  const selectedComponent = selectedIds.length === 1 
    ? components.find(c => c.id === selectedIds[0])
    : null;

  const messagesEndRef = useRef(null);
  const currentProvider = useSelector(state => state.aiChat.provider);
  
  const [position, setPosition] = useState({ x: window.innerWidth - 350, y: window.innerHeight / 2 - 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messageStates, setMessageStates] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const updateMessageState = (messageId, state) => {
    setMessageStates(prev => ({
      ...prev,
      [messageId]: state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageId = Date.now().toString();
    const currentInput = input;
    setInput('');
    
    dispatch(addMessage({
      id: messageId,
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    }));

    setIsTyping(true);
    
    try {
      const commandResult = await AICommandExecutor.processCommand(currentInput, dispatch);
      
      if (commandResult) {
        dispatch(addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: commandResult.success 
            ? commandResult.message 
            : `Sorry, I encountered an error: ${commandResult.message}`,
          timestamp: new Date(),
          status: commandResult.success ? 'success' : 'error',
        }));
      } else {
        await dispatch(sendMessage(currentInput));
      }
    } catch (error) {
      dispatch(addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        status: 'error',
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleProviderChange = (e) => {
    dispatch(changeProvider(e.target.value));
  };

  return (
    <div 
      className="fixed w-80 bg-white border border-blue-200 rounded-lg shadow-xl z-[960] flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div 
        className="flex justify-between items-center p-3 border-b border-blue-100 bg-[#e6f3ff] cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700">AI Assistant</h3>
          {selectedComponent && (
            <span className="text-sm text-blue-600">
              Selected: {selectedComponent.props?.name || selectedComponent.type}
            </span>
          )}
          <div className="flex items-center gap-2">
            <select
              value={currentProvider}
              onChange={handleProviderChange}
              className="text-sm border border-blue-200 rounded px-1"
            >
              <option value={LLMProviders.ANTHROPIC_HAIKU}>Haiku</option>
              <option value={LLMProviders.ANTHROPIC_CLAUDE}>Claude</option>
            </select>
            {isLoading && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-blue-600"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 max-h-[60vh]">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} timestamp={msg.timestamp} />
        ))}
        {isTyping && (
          <div className="text-left">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-blue-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Processing..." : "Ask me anything..."}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChatWindow; 