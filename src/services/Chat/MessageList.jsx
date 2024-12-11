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
  replacedMessageIds = new Set()
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessages = () => {
    const currentMessages = activeChat === 'main' 
      ? messages 
      : componentChats.find(chat => chat.id === activeChat)?.messages || [];

    return currentMessages.map((message) => (
      <Message
        key={message.id}
        message={message}
        isAddingComponent={isAddingComponent}
        onOptionSelect={handleOptionSelect}
        openComponentChat={openComponentChat}
        selectedComponent={selectedComponent}
        replacedMessageIds={replacedMessageIds}
      />
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {renderMessages()}
      {isAddingComponent && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 