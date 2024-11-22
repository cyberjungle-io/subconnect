import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addMessage, changeProvider } from '../../features/aiChatSlice';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { LLMProviders } from '../../services/llm/llmService';

const AIChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const { messages, isLoading, provider } = useSelector(state => state.aiChat);
  const messagesEndRef = useRef(null);
  const currentProvider = useSelector(state => state.aiChat.provider);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(addMessage({
      role: 'user',
      content: input,
    }));
    
    const currentInput = input;
    setInput('');
    
    await dispatch(sendMessage(currentInput));
  };

  const handleProviderChange = (e) => {
    dispatch(changeProvider(e.target.value));
  };

  return (
    <div className="fixed right-14 top-1/2 transform -translate-y-1/2 w-80 bg-white border border-blue-200 rounded-lg shadow-xl z-[960] flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-blue-100 bg-[#e6f3ff]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-700">AI Assistant</h3>
          <select
            value={currentProvider}
            onChange={handleProviderChange}
            className="text-sm border border-blue-200 rounded px-1"
          >
            <option value={LLMProviders.ANTHROPIC_HAIKU}>Haiku</option>
            <option value={LLMProviders.ANTHROPIC_CLAUDE}>Claude</option>
          </select>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-blue-600"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 max-h-[60vh]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${
              msg.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-blue-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
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