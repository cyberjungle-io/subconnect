import React from 'react';

const TypingIndicator = () => (
  <div className="sticky bottom-0 bg-white border-t border-gray-100">
    <div className="flex flex-col text-xs text-gray-500 p-2">
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <div
            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="italic">Adding component...</span>
      </div>
    </div>
  </div>
);

export default TypingIndicator; 