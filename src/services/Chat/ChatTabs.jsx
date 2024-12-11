import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedIds } from '../../features/editorSlice';

const ChatTab = ({ 
  chatId, 
  label, 
  isActive, 
  componentId, 
  mode, 
  onSelect, 
  onClose 
}) => (
  <div
    className={`flex items-center gap-2 px-3 py-1 text-sm cursor-pointer transition-colors ${
      isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
    }`}
    onClick={() => onSelect(componentId)}
  >
    <span className="truncate">{label}</span>
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
    setActiveChat(chatId);
    // Only select component if we're in edit mode
    if (mode === 'edit' && componentId) {
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
        />
        {componentChats.map((chat) => (
          <ChatTab
            key={chat.id}
            chatId={chat.id}
            label={chat.name}
            isActive={activeChat === chat.id}
            componentId={chat.componentId}
            mode={mode}
            onSelect={(componentId) => handleTabSelect(componentId, chat.id)}
            onClose={handleTabClose}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatTabs; 