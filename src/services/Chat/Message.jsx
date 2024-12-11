import React from 'react';
import { format } from 'date-fns';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Message = ({
  message,
  timestamp,
  onOptionSelect,
  openComponentChat,
  selectedComponent,
  replacedMessageIds = new Set(),
}) => {
  const isReplaced = replacedMessageIds.has(message.id) || false;

  if (isReplaced) {
    return null;
  }

  if (message.isNotification) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const renderOptions = (options) => {
    if (!Array.isArray(options)) return null;

    const isComponentList = options.every((opt) =>
      opt.text.match(
        /^(Container|Text|Image|Chart|Table|Video|Whiteboard|Value|Kanban|List)$/
      )
    );

    return (
      <div
        className={`mt-2 flex gap-2 ${
          isComponentList ? "flex-row flex-wrap" : "flex-col"
        } w-full`}
      >
        {options.map((option, index) => {
          if (option.type === "color") {
            return (
              <div key={index} className="w-full">
                <button
                  onClick={() => onOptionSelect(option)}
                  className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors w-full flex items-center gap-2"
                  title={`${option.text} - Click to modify`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="flex-1">{option.text}</span>
                </button>
                {option.options && (
                  <div className="ml-6 mt-1 flex flex-wrap gap-1">
                    {option.options.map((subOption, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => onOptionSelect(subOption)}
                        className="text-sm px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors text-left"
                      >
                        {subOption.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (option.type === "category") {
            return (
              <button
                key={index}
                onClick={() => onOptionSelect(option)}
                className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors w-full"
              >
                {option.text}
              </button>
            );
          }

          if (option.type === "command") {
            return (
              <button
                key={index}
                onClick={() => onOptionSelect(option)}
                className={`text-sm px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors text-left ${
                  isComponentList ? "flex-shrink-0" : "w-full"
                }`}
              >
                {option.text}
              </button>
            );
          }

          if (option.type === "info") {
            return (
              <div
                key={index}
                className="text-sm px-3 py-2 bg-gray-50 rounded text-gray-600 italic flex-grow basis-[calc(50%-0.25rem)]"
              >
                {option.text}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // Check if this is a command execution message
  const isCommandExecution = message.content?.match(
    /^(Set |Added |Updated |Selected |Created |Opened )/
  );

  // Check if this is a component-specific suggestions message
  const isComponentSuggestions =
    message.role === "assistant" &&
    message.content.startsWith("Here are some things you can do with");

  if (isCommandExecution) {
    return (
      <div className="flex flex-col items-center my-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
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
          {format(timestamp || new Date(), "h:mm a")}
        </span>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
      <div className="flex flex-col gap-1">
        <div className="relative group">
          {isComponentSuggestions && selectedComponent && (
            <button
              onClick={openComponentChat}
              className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity 
                      p-1.5 bg-blue-500 hover:bg-blue-600 
                      text-white rounded-full shadow-sm"
              title="Open chat"
            >
              <FaExternalLinkAlt size={10} />
            </button>
          )}
          <div
            className={`inline-block p-3 rounded-lg w-full ${
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="break-words">{message.content}</div>
            {message.options && renderOptions(message.options)}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {format(timestamp || new Date(), "h:mm a")}
        </span>
      </div>
    </div>
  );
};

export default Message; 