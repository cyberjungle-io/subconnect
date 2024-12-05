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

const Message = ({ message, timestamp, onOptionSelect }) => {
  const renderOptions = (options) => {
    if (!Array.isArray(options)) return null;
    
    return (
      <div className="mt-2 flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index} className="flex flex-col gap-1">
            <button
              onClick={() => onOptionSelect(option)}
              className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors overflow-hidden"
            >
              <div className="truncate">{option.text}</div>
            </button>
            {option.options && (
              <div className="ml-4 flex flex-wrap gap-2">
                {option.options.map((subOption, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => onOptionSelect({
                      ...option,
                      selectedOption: subOption
                    })}
                    className="text-sm px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  >
                    {subOption}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Check if this is a command execution message
  const isCommandExecution = message.content?.startsWith('Set ') || 
                           message.content?.startsWith('Added ') ||
                           message.content?.startsWith('Updated ') ||
                           message.content?.startsWith('Selected ');

  if (isCommandExecution) {
    return (
      <div className="flex flex-col items-center my-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <svg 
            className="w-3.5 h-3.5 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <span className="italic max-w-[250px] truncate" title={message.content}>
            {message.content}
          </span>
        </div>
        <span className="text-gray-400 text-[10px] mt-0.5">
          {format(timestamp || new Date(), 'h:mm a')}
        </span>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className="flex flex-col gap-1">
        <div
          className={`inline-block p-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-500 text-white max-w-[85%]'
              : 'bg-gray-100 text-gray-800 max-w-[85%]'
          }`}
        >
          <div className="break-words">
            {message.content}
          </div>
          {message.options && renderOptions(message.options)}
        </div>
        <span className="text-xs text-gray-500">
          {format(timestamp || new Date(), 'h:mm a')}
        </span>
      </div>
    </div>
  );
};

const isRecent = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  return now.getTime() - messageTime.getTime() < 60000; // Less than 1 minute ago
};

const AIChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s?.queries?.list);
  const [input, setInput] = useState('');
  const { messages, isLoading, provider } = useSelector(state => state.aiChat);
  const selectedIds = useSelector(state => state.editor.selectedIds);
  const components = useSelector(state => state.editor.components);
  
  // Add the awaitingResponse state
  const [awaitingResponse, setAwaitingResponse] = useState(null);
  
  // Enhanced function to find selected component, including nested children
  const findSelectedComponent = (components, selectedId) => {
    for (const component of components) {
      if (component.id === selectedId) {
        return component;
      }
      if (component.children && component.children.length > 0) {
        const found = findSelectedComponent(component.children, selectedId);
        if (found) {
          // Add parent reference to help with context
          return {
            ...found,
            parent: component
          };
        }
      }
    }
    return null;
  };

  // Get the selected component details, including nested components
  const selectedComponent = selectedIds.length === 1 
    ? findSelectedComponent(components, selectedIds[0])
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
    
    // If we have an awaiting response, combine it with the current input
    const processedInput = awaitingResponse 
      ? `${awaitingResponse.originalCommand} (${awaitingResponse.type}: ${currentInput})`
      : currentInput;
    
    dispatch(addMessage({
      id: messageId,
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    }));

    setIsTyping(true);
    
    try {
      // Create a minimal state object with just what we need
      const minimalState = {
        w3s: {
          queries: {
            list: queries
          }
        }
      };

      const commandResult = await AICommandExecutor.processCommand(
        processedInput, 
        dispatch,
        selectedComponent,
        minimalState  // Pass the minimal state object
      );
      
      if (commandResult) {
        dispatch(addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: commandResult.message,
          timestamp: new Date(),
          status: commandResult.success ? 'success' : 'error',
          needsMoreInfo: commandResult.needsMoreInfo,
          type: commandResult.type,
          options: commandResult.options // Add the options to the message
        }));

        // If we need more info, store the context for the next message
        if (commandResult.needsMoreInfo) {
          setAwaitingResponse({
            type: commandResult.type,
            originalCommand: currentInput
          });
        } else {
          // Clear awaiting response if we don't need more info
          setAwaitingResponse(null);
        }
      } else {
        setAwaitingResponse(null); // Clear awaiting response
        await dispatch(sendMessage(currentInput));
      }
    } catch (error) {
      setAwaitingResponse(null); // Clear awaiting response on error
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

  // Optional: Add visual indicator when awaiting response
  const inputPlaceholder = awaitingResponse 
    ? `Please specify ${awaitingResponse.type}...`
    : (isLoading ? "Processing..." : "Ask me anything...");

  const handleOptionSelect = async (option) => {
    let input = '';
    
    if (option.selectedOption) {
      // Handle field or query option selection
      if (option.type === 'field') {
        input = `__fieldOption__:${option.value}::${option.selectedOption}`;
      } else if (option.type === 'query') {
        input = `__queryOption__:${option.value}::${option.selectedOption}`;
      } else if (option.type === 'queryOption') {
        input = `__queryOption__:${option.queryName}::${option.value}`;
      }
    } else if (option.type === 'query' || option.type === 'field') {
      // Don't process the text directly, show the options instead
      dispatch(addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: `Available options for ${option.value}:`,
        timestamp: new Date(),
        options: [{
          ...option,
          text: option.value,
          options: option.options
        }]
      }));
      return;
    } else {
      // Handle other clickable text selection
      input = option.text;
    }
    
    try {
      const minimalState = {
        w3s: {
          queries: {
            list: queries
          }
        }
      };

      const commandResult = await AICommandExecutor.processCommand(
        input, 
        dispatch,
        selectedComponent,
        minimalState
      );
      
      if (commandResult) {
        dispatch(addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: commandResult.message,
          timestamp: new Date(),
          status: commandResult.success ? 'success' : 'error',
          options: commandResult.options
        }));
      }
    } catch (error) {
      dispatch(addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your selection.',
        timestamp: new Date(),
        status: 'error',
      }));
    }
  };

  return (
    <div 
      className="fixed w-80 bg-white border border-blue-200 rounded-lg shadow-xl z-[960] flex flex-col max-h-[80vh]"
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
              {selectedComponent.parent && (
                <span className="text-xs text-gray-500">
                  {' '}(nested in {selectedComponent.parent.type})
                </span>
              )}
            </span>
          )}
          <div className="flex items-center gap-2">
            <select
              value={currentProvider}
              onChange={handleProviderChange}
              className="text-sm p-1 rounded border border-blue-200"
            >
              {Object.values(LLMProviders).map(provider => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-100 rounded-full transition-colors"
        >
          <FaTimes className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[calc(80vh-200px)]">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            timestamp={message.timestamp}
            onOptionSelect={handleOptionSelect}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-blue-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="flex-1 p-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`p-2 rounded-lg ${
              isLoading
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChatWindow; 