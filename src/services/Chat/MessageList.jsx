import React, { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({
  messages,
  activeChat,
  componentChats,
  isAddingComponent,
  handleOptionSelect,
  openComponentChat,
  selectedComponent,
  replacedMessageIds
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessages = () => {
    const messageList = activeChat === "main"
      ? messages
      : componentChats.find((chat) => chat.id === activeChat)?.messages || [];

    return messageList.map((message) => (
      <Message
        key={message.id}
        message={message}
        timestamp={message.timestamp}
        onOptionSelect={handleOptionSelect}
        openComponentChat={openComponentChat}
        selectedComponent={selectedComponent}
        replacedMessageIds={replacedMessageIds}
      />
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto pt-4 px-4 space-y-4 min-h-[300px] max-h-[calc(80vh-200px)] relative">
      {renderMessages()}
      {isAddingComponent && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 