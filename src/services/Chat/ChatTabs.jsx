import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedIds } from '../../features/editorSlice';
import { FaHome } from 'react-icons/fa';

const ChatTab = ({ 
  chatId, 
  label, 
  isActive, 
  componentId, 
  mode, 
  onSelect, 
  onClose,
  icon,
  isGeneral
}) => (
  <div
    className={`flex items-center gap-2 px-3 py-1 text-sm cursor-pointer transition-colors ${
      isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
    }`}
    onClick={() => onSelect(componentId)}
  >
    {icon ? icon : <span className="truncate">{label}</span>}
    {chatId !== 'main' && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(chatId);
        }}
        className="p-1 hover:bg-blue-200 rounded-full"
      >
        ×
      </button>
    )}
  </div>
);

const ChatTabs = ({
  activeChat,
  componentChats,
  mode,
  setActiveChat,
  setComponentChats,
  dispatch
}) => {
  const handleTabSelect = (componentId, chatId) => {
    // Ensure the chat exists before switching
    const chatExists = chatId === 'main' || componentChats.some(chat => chat.id === chatId);
    if (!chatExists) return;
    
    setActiveChat(chatId);
    
    // If switching to main chat, clear component selection
    if (chatId === "main") {
      dispatch(setSelectedIds([]));
    }
    // Otherwise only select component if we're in edit mode
    else if (mode === 'edit' && componentId) {
      dispatch(setSelectedIds([componentId]));
    }
  };

  const handleTabClose = (chatId) => {
    setActiveChat("main");
    setComponentChats((prev) => prev.filter((c) => c.id !== chatId));
  };

  return (
    <div className="flex overflow-x-auto border-b border-blue-100">
      <div className="flex">
        <ChatTab
          chatId="main"
          label="Main Chat"
          isActive={activeChat === "main"}
          onSelect={() => handleTabSelect(null, "main")}
          mode={mode}
          icon={<FaHome className="text-base" />}
        />
        {componentChats.map((chat) => (
          <ChatTab
            key={chat.id}
            chatId={chat.id}
            label={chat.name}
            isActive={activeChat === chat.id}
            componentId={chat.type === 'general' ? null : chat.componentId}
            mode={mode}
            onSelect={(componentId) => handleTabSelect(componentId, chat.id)}
            onClose={handleTabClose}
            isGeneral={chat.type === 'general'}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatTabs; 