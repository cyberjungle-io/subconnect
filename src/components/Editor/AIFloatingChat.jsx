import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processAICommand } from '../../services/ai/processors';
import { FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toggleAIChat } from '../../features/editorSlice';

const AIFloatingChat = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isVisible = useSelector(state => state.editor.isAIChatVisible);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isVisible && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isVisible, isMinimized]);

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I can help you create and modify components. Try saying "Add a text component" or "Create a flex container".',
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isVisible]);

  const handleSendMessage = async (message) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString()
    }]);
    
    try {
      const response = await processAICommand(message);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message,
        timestamp: new Date().toISOString()
      }]);
      
      if (response.commands) {
        response.commands.forEach(command => {
          dispatch(command);
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsProcessing(false);
      scrollToBottom();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-lg rounded-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-t-lg">
        <h3 className="font-semibold">AI Assistant</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-600 rounded"
          >
            {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            onClick={() => dispatch(toggleAIChat())}
            className="p-1 hover:bg-blue-600 rounded"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <div className="h-96 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : msg.isError
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim() && !isProcessing) {
                  handleSendMessage(input.trim());
                  setInput('');
                }
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                className="flex-1 border rounded-lg px-3 py-2 disabled:opacity-50"
                placeholder={isProcessing ? "Processing..." : "Type your command..."}
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isProcessing && !isMinimized && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default AIFloatingChat;
