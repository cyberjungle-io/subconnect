import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  inputPlaceholder = "Type a message..."
}) => {
  return (
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
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors`}
        >
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 