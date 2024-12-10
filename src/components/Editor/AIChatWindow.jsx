import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  addMessage,
  changeProvider,
} from "../../features/aiChatSlice";
import { FaTimes, FaPaperPlane, FaExternalLinkAlt } from "react-icons/fa";
import { LLMProviders } from "../../services/llm/llmService";
import { aiAddComponent } from "../../features/editorSlice";
import { AICommandExecutor } from "../../services/aiExecutor";
import { format } from "date-fns";
import { TableProcessor } from "../../services/Processors/TableProcessor";
import { WhiteboardProcessor } from "../../services/Processors/WhiteboardProcessor";
import { ImageProcessor } from "../../services/Processors/ImageProcessor";
import { componentConfig } from "../../components/Components/componentConfig";
import { ChartProcessor } from "../../services/Processors/ChartProcessor";
import { VideoProcessor } from "../../services/Processors/VideoProcessor";

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

const Message = ({
  message,
  timestamp,
  onOptionSelect,
  openComponentChat,
  selectedComponent,
  replacedMessageIds,
}) => {
  if (replacedMessageIds.has(message.id)) {
    return null; // Don't render replaced messages
  }

  const renderOptions = (options) => {
    if (!Array.isArray(options)) return null;

    // Check if these are component creation options
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
          // Add specific handling for color type options
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

          // For category options (main options)
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

          // For command options (specific commands)
          if (option.type === "command") {
            const isComponent = option.text.match(
              /^(Container|Text|Image|Chart|Table|Video|Whiteboard|Value|Kanban|List)$/
            );

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

          // For query options (existing functionality)
          if (
            option.type === "query" &&
            !message.content.startsWith("Available options for")
          ) {
            const queryName = option.text
              .replace(/^Name:\s*/, "")
              .split("\n")[0];

            return (
              <div key={index} className="w-full">
                <button
                  onClick={() => onOptionSelect(option)}
                  className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors w-full"
                  title={option.text}
                >
                  <div className="truncate text-sm font-medium">
                    {queryName}
                  </div>
                </button>
              </div>
            );
          }

          // For query options (after selection)
          if (option.type === "queryOption") {
            return (
              <button
                key={index}
                onClick={() => onOptionSelect(option)}
                className="text-sm px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors text-left flex-grow basis-[calc(50%-0.25rem)] min-w-[120px]"
                title={option.value}
              >
                <span className="block truncate">{option.value}</span>
              </button>
            );
          }

          // For field options
          if (option.type === "field") {
            return (
              <div key={index} className="flex flex-col w-full">
                <button
                  onClick={() => onOptionSelect(option)}
                  className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors w-full"
                  title={option.text}
                >
                  <div className="truncate min-w-0">{option.text}</div>
                </button>
                {option.options && (
                  <div className="mt-1 ml-2 flex flex-wrap gap-1">
                    {option.options.map((subOption, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() =>
                          onOptionSelect({
                            ...option,
                            selectedOption: subOption,
                          })
                        }
                        className="text-sm px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors text-left whitespace-nowrap"
                        title={`${option.text} - ${subOption}`}
                      >
                        {subOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // For info type options
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
  const isCommandExecution =
    message.content?.startsWith("Set ") ||
    message.content?.startsWith("Added ") ||
    message.content?.startsWith("Updated ") ||
    message.content?.startsWith("Selected ") ||
    message.content?.startsWith("Created ");

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
          <span
            className="italic max-w-[250px] truncate"
            title={message.content}
          >
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
    <div
      className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
    >
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

const isRecent = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  return now.getTime() - messageTime.getTime() < 60000; // Less than 1 minute ago
};

const isVideoSuggestionsMessage = (message) => {
  return (
    message.role === "assistant" &&
    message.content === "Here are some things you can do with the video:" &&
    message.options?.some((opt) => opt.text === "Set video URL")
  );
};

const isChartSuggestionsMessage = (message) => {
  return (
    message.role === "assistant" &&
    message.content === "Here are some things you can do with the chart:" &&
    message.options?.some((opt) => opt.text === "Chart Type")
  );
};

const isTableSuggestionsMessage = (message) => {
  return (
    message.role === "assistant" &&
    message.content === "Here are some things you can do with the table:" &&
    message.options?.some((opt) => opt.text === "Table Visibility")
  );
};

const isWhiteboardSuggestionsMessage = (message) => {
  return (
    message.role === "assistant" &&
    message.content ===
      "Here are some things you can do with the whiteboard:" &&
    message.options?.some((opt) => opt.text === "Drawing Settings")
  );
};

const getInitialSuggestions = () => {
  // Name mapping for specific components
  const nameMapping = {
    "Todo List": "List",
    "Kanban Board": "Kanban",
    "Query Value": "Value",
    "Flex Container": "Container",
  };

  // Generate component options dynamically from componentConfig, excluding SAVED_COMPONENT
  const componentOptions = Object.entries(componentConfig)
    .filter(([type]) => type !== "SAVED_COMPONENT")
    .map(([type, config]) => ({
      text: nameMapping[config.name] || config.name,
      command: `Add a ${config.name}`,
      type: "command",
    }));

  return [
    {
      text: "Component",
      type: "category",
      options: componentOptions,
    },
    {
      text: "Styling",
      type: "category",
      options: [
        {
          text: "Change background color",
          type: "command",
        },
        {
          text: "Add shadow",
          type: "command",
        },
        {
          text: "Adjust size",
          type: "command",
        },
        {
          text: "Modify borders",
          type: "command",
        },
      ],
    },
    {
      text: "Theme",
      type: "category",
      options: [
        {
          text: "Change color theme",
          type: "command",
        },
        {
          text: "Customize toolbar",
          type: "command",
        },
      ],
    },
    {
      text: "Tips",
      type: "category",
      options: [
        {
          text: "Select a component to see specific options",
          type: "info",
        },
        {
          text: "You can ask me to modify any component's properties",
          type: "info",
        },
        {
          text: "Try natural language commands like 'make it bigger' or 'change the color to blue'",
          type: "info",
        },
      ],
    },
  ];
};

const ChatTab = ({ label, isActive, onSelect, onClose, chatId }) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-b-2 text-sm
      ${
        isActive
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-transparent hover:bg-gray-50 text-gray-600"
      }`}
    onClick={onSelect}
  >
    <span className="truncate max-w-[120px]">{label}</span>
    {label !== "Main Chat" && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(chatId);
        }}
        className="p-1 hover:bg-gray-200 rounded-full"
      >
        <FaTimes size={12} />
      </button>
    )}
  </div>
);

const AIChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.w3s?.queries?.list);
  const [input, setInput] = useState("");
  const { messages, isLoading, provider, isVisible } = useSelector(
    (state) => state.aiChat
  );
  const selectedIds = useSelector((state) => state.editor.selectedIds);
  const components = useSelector((state) => state.editor.components);

  // Add the awaitingResponse state
  const [awaitingResponse, setAwaitingResponse] = useState(null);

  // Add this near the other state declarations at the top of the AIChatWindow component
  const [isAddingComponent, setIsAddingComponent] = useState(false);

  // Add this near other state declarations at the top of the component
  const [replacedMessageIds, setReplacedMessageIds] = useState(new Set());

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
            parent: component,
          };
        }
      }
    }
    return null;
  };

  // Get the selected component details, including nested components
  const selectedComponent =
    selectedIds.length === 1
      ? findSelectedComponent(components, selectedIds[0])
      : null;

  const messagesEndRef = useRef(null);
  const currentProvider = useSelector((state) => state.aiChat.provider);

  const [position, setPosition] = useState({
    x: window.innerWidth - 350,
    y: window.innerHeight / 2 - 300,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messageStates, setMessageStates] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [componentChats, setComponentChats] = useState([]);
  const [activeChat, setActiveChat] = useState("main");

  // Add these refs near the top of the component with other state declarations
  const initializationRef = useRef(false);
  const componentMessageRef = useRef(false);

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
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
    setMessageStates((prev) => ({
      ...prev,
      [messageId]: state,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageId = Date.now().toString();
    const currentInput = input;
    setInput("");

    const newMessage = {
      id: messageId,
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    // Add message to the appropriate chat
    if (activeChat === "main") {
      dispatch(addMessage(newMessage));
    } else {
      setComponentChats((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
            };
          }
          return chat;
        })
      );
    }

    setIsTyping(true);

    try {
      // Process command with the appropriate context
      const commandResult = await AICommandExecutor.processCommand(
        currentInput,
        dispatch,
        activeChat !== "main" ? selectedComponent : null,
        { w3s: { queries: { list: queries } } }
      );

      const responseMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: commandResult
          ? commandResult.message
          : "I'll help you with that.",
        timestamp: new Date(),
        status: commandResult?.success ? "success" : undefined,
        options: commandResult?.options,
      };

      // Add response to the appropriate chat
      if (activeChat === "main") {
        dispatch(addMessage(responseMessage));
      } else {
        setComponentChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, responseMessage],
              };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
        status: "error",
      };

      if (activeChat === "main") {
        dispatch(addMessage(errorMessage));
      } else {
        setComponentChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, errorMessage],
              };
            }
            return chat;
          })
        );
      }
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
    : isLoading
    ? "Processing..."
    : "Ask me anything...";

  // Add this function to generate video suggestions
  const getVideoSuggestions = () => {
    return [
      {
        text: "Set video URL",
        type: "category",
        options: [
          {
            text: "set video url to https://youtube.com/...",
            type: "command",
          },
          {
            text: "load video from https://youtube.com/...",
            type: "command",
          },
          {
            text: "change video source to https://youtube.com/...",
            type: "command",
          },
        ],
      },
      {
        text: "Video Controls",
        type: "category",
        options: [
          {
            text: "show video controls",
            type: "command",
          },
          {
            text: "hide video controls",
            type: "command",
          },
          {
            text: "toggle video controls",
            type: "command",
          },
        ],
      },
      {
        text: "Playback Options",
        type: "category",
        options: [
          {
            text: "enable autoplay",
            type: "command",
          },
          {
            text: "disable autoplay",
            type: "command",
          },
          {
            text: "make video loop",
            type: "command",
          },
          {
            text: "stop video loop",
            type: "command",
          },
        ],
      },
      {
        text: "Audio Settings",
        type: "category",
        options: [
          {
            text: "mute video",
            type: "command",
          },
          {
            text: "unmute video",
            type: "command",
          },
          {
            text: "turn sound on",
            type: "command",
          },
          {
            text: "turn sound off",
            type: "command",
          },
        ],
      },
    ];
  };

  // Modify the getChartSuggestions function
  const getChartSuggestions = () => {
    // Check if a query is selected
    const hasSelectedQuery = selectedComponent?.props?.selectedQueryId;

    // Get current states from the component props
    const showLegend = selectedComponent?.props?.showLegend !== false;
    const showGrid = selectedComponent?.props?.showGrid !== false;
    const showDataPoints = selectedComponent?.props?.showDataPoints !== false;
    const showXAxis = selectedComponent?.props?.showXAxis !== false;
    const showYAxis = selectedComponent?.props?.showYAxis !== false;

    return [
      {
        text: "Chart Type",
        type: "category",
        options: [
          {
            text: "change chart type to line",
            type: "command",
          },
          {
            text: "change chart type to bar",
            type: "command",
          },
          {
            text: "change chart type to area",
            type: "command",
          },
          {
            text: "change chart type to pie",
            type: "command",
          },
        ],
      },
      {
        text: "Chart Styles",
        type: "category",
        options: [
          showLegend
            ? {
                text: "hide the legend",
                type: "command",
              }
            : {
                text: "show the legend",
                type: "command",
              },
          showGrid
            ? {
                text: "hide the grid",
                type: "command",
              }
            : {
                text: "show the grid",
                type: "command",
              },
          showDataPoints
            ? {
                text: "hide the data points",
                type: "command",
              }
            : {
                text: "show the data points",
                type: "command",
              },
        ],
      },
      {
        text: "Data Management",
        type: "category",
        options: hasSelectedQuery
          ? [
              {
                text: "show field options",
                type: "command",
              },
            ]
          : [
              {
                text: "list available queries",
                type: "command",
              },
              {
                text: "Please select a query to see field options",
                type: "info",
              },
            ],
      },
      {
        text: "Axis Controls",
        type: "category",
        options: [
          showXAxis
            ? {
                text: "hide x axis",
                type: "command",
              }
            : {
                text: "show x axis",
                type: "command",
              },
          showYAxis
            ? {
                text: "hide y axis",
                type: "command",
              }
            : {
                text: "show y axis",
                type: "command",
              },
        ],
      },
    ];
  };

  // Add this before createOrOpenComponentChat
  const handleOptionSelect = async (option) => {
    // Get the component context based on active chat
    const componentContext =
      activeChat !== "main"
        ? componentChats.find((chat) => chat.id === activeChat)
        : null;

    const targetComponent = componentContext
      ? components.find((c) => c.id === componentContext.componentId)
      : selectedComponent;

    if (option.needsInput) {
      const message = {
        id: Date.now().toString(),
        role: "assistant",
        content: option.prompt,
        timestamp: new Date(),
        options:
          option.inputType === "color"
            ? [
                {
                  text: "You can use color names (e.g., blue, red) or hex codes (#FF0000)",
                  type: "info",
                },
              ]
            : undefined,
      };

      // Add message to appropriate chat
      if (activeChat === "main") {
        dispatch(addMessage(message));
      } else {
        setComponentChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, message],
              };
            }
            return chat;
          })
        );
      }

      setAwaitingResponse({
        type: option.inputType,
        originalCommand: `set stroke color to`,
      });
      return;
    }

    let input = "";

    // Add loading state for component creation commands
    const isComponentCreation =
      option.type === "command" &&
      option.text.match(
        /^(Container|Text|Image|Chart|Table|Video|Whiteboard|Value|Kanban|List)$/
      );

    if (isComponentCreation) {
      setIsAddingComponent(true);
    }

    try {
      if (option.selectedOption) {
        if (option.type === "field") {
          input = `__fieldOption__:${option.value}::${option.selectedOption}`;
        } else if (option.type === "query") {
          input = `__queryOption__:${option.value}::${option.selectedOption}`;
        } else if (option.type === "queryOption") {
          input = `__queryOption__:${option.queryName}::${option.value}`;
        }
      } else if (
        option.type === "command" &&
        option.value?.startsWith("__colorOption__")
      ) {
        input = option.value;
      } else if (option.type === "category") {
        const message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `${option.text} options:`,
          timestamp: new Date(),
          options: option.options,
        };

        // Add message to appropriate chat
        if (activeChat === "main") {
          dispatch(addMessage(message));
        } else {
          setComponentChats((prev) =>
            prev.map((chat) => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  messages: [...chat.messages, message],
                };
              }
              return chat;
            })
          );
        }
        return;
      } else {
        input = option.text;
      }

      const minimalState = {
        w3s: {
          queries: {
            list: queries,
          },
        },
      };

      const commandResult = await AICommandExecutor.processCommand(
        input,
        dispatch,
        targetComponent,
        minimalState
      );

      if (commandResult) {
        const responseMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: commandResult.message,
          timestamp: new Date(),
          status: commandResult.success ? "success" : "error",
          options: commandResult.options,
        };

        // Add response to appropriate chat
        if (activeChat === "main") {
          dispatch(addMessage(responseMessage));
        } else {
          setComponentChats((prev) =>
            prev.map((chat) => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  messages: [...chat.messages, responseMessage],
                };
              }
              return chat;
            })
          );
        }
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your selection.",
        timestamp: new Date(),
        status: "error",
      };

      if (activeChat === "main") {
        dispatch(addMessage(errorMessage));
      } else {
        setComponentChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, errorMessage],
              };
            }
            return chat;
          })
        );
      }
    } finally {
      if (isComponentCreation) {
        setIsAddingComponent(false);
      }
    }
  };

  // Replace the existing useEffect
  useEffect(() => {
    if (!isVisible) {
      // Reset initialization flags when chat is closed
      initializationRef.current = false;
      componentMessageRef.current = false;
      return;
    }

    // Handle initial messages only once
    if (!initializationRef.current && messages.length === 0) {
      initializationRef.current = true;

      const initialMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "How can I help you today?",
        timestamp: new Date(),
        options: getInitialSuggestions(),
      };
      dispatch(addMessage(initialMessage));

      // Add component message if component is selected during initialization
      if (selectedComponent && !componentMessageRef.current) {
        componentMessageRef.current = true;
        const componentMessage = {
          id: Date.now().toString() + 1,
          role: "assistant",
          content: `Here are some things you can do with the ${selectedComponent.type.toLowerCase()}:`,
          timestamp: new Date(),
          options: getComponentSpecificOptions(selectedComponent),
        };
        dispatch(addMessage(componentMessage));
      }
      return;
    }

    // Handle component selection changes after initialization
    if (
      initializationRef.current &&
      selectedComponent &&
      !componentMessageRef.current
    ) {
      componentMessageRef.current = true;
      const componentMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Here are some things you can do with the ${selectedComponent.type.toLowerCase()}:`,
        timestamp: new Date(),
        options: getComponentSpecificOptions(selectedComponent),
      };
      dispatch(addMessage(componentMessage));
    }

    // Reset component message flag when component changes
    if (!selectedComponent) {
      componentMessageRef.current = false;
    }

    // Cleanup function
    return () => {
      if (!isVisible) {
        initializationRef.current = false;
        componentMessageRef.current = false;
      }
    };
  }, [isVisible, selectedComponent?.id, messages.length]);

  // Keep the createOrOpenComponentChat function unchanged for manual switching
  const createOrOpenComponentChat = (component) => {
    if (!component) return;

    const chatId = `${component.type}_${component.id}`;
    const existingChat = componentChats.find(
      (chat) => chat.id === chatId || chat.componentId === component.id
    );

    if (existingChat) {
      setActiveChat(existingChat.id);
      return;
    }

    const initialMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Here are some things you can do with the ${component.type.toLowerCase()}:`,
      timestamp: new Date(),
      options: getComponentSpecificOptions(component),
    };

    setComponentChats((prev) => [
      ...prev,
      {
        id: chatId,
        componentId: component.id,
        type: component.type,
        name: component.type,
        messages: [initialMessage],
      },
    ]);
    setActiveChat(chatId);
  };

  // Replace the openComponentChat function
  const openComponentChat = () => {
    if (selectedComponent) {
      // Create a confirmation message with our new "Created" pattern
      const confirmationMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Created new ${selectedComponent.type} chat`,  // Added "new" to the message
        timestamp: new Date(),
        status: 'success'
      };

      // If we're in the main chat, replace the component message
      if (activeChat === 'main') {
        // Find the last component-specific message
        const lastComponentMessage = [...messages].reverse().find(msg => 
          msg.role === 'assistant' && 
          msg.content.startsWith(`Here are some things you can do with the ${selectedComponent.type.toLowerCase()}`)
        );

        if (lastComponentMessage && !replacedMessageIds.has(lastComponentMessage.id)) {
          // Add the message ID to our set of replaced messages
          setReplacedMessageIds(prev => new Set([...prev, lastComponentMessage.id]));
          
          // Dispatch the confirmation message to replace the component message
          dispatch(addMessage(confirmationMessage));
        }
      }

      // Create or open the component chat as before
      createOrOpenComponentChat(selectedComponent);
    }
  };

  // Add this helper function to get component-specific options
  const getComponentSpecificOptions = (component) => {
    switch (component.type) {
      case "CHART":
        return [
          {
            text: "Chart Type",
            type: "category",
            options: [
              {
                text: "change chart type to line",
                type: "command",
              },
              {
                text: "change chart type to bar",
                type: "command",
              },
              {
                text: "change chart type to area",
                type: "command",
              },
              {
                text: "change chart type to pie",
                type: "command",
              },
            ],
          },
          {
            text: "Chart Styles",
            type: "category",
            options: [
              {
                text: "show the legend",
                type: "command",
              },
              {
                text: "hide the legend",
                type: "command",
              },
              {
                text: "show the grid",
                type: "command",
              },
              {
                text: "hide the grid",
                type: "command",
              },
            ],
          },
          {
            text: "Data Management",
            type: "category",
            options: [
              {
                text: "show field options",
                type: "command",
              },
              {
                text: "list available queries",
                type: "command",
              },
            ],
          },
          {
            text: "Axis Controls",
            type: "category",
            options: [
              {
                text: "show x axis",
                type: "command",
              },
              {
                text: "hide x axis",
                type: "command",
              },
              {
                text: "show y axis",
                type: "command",
              },
              {
                text: "hide y axis",
                type: "command",
              },
            ],
          },
        ];
      case "TABLE":
        return new TableProcessor().getSuggestionsWithState({
          w3s: { queries: { list: queries } },
        });
      case "VIDEO":
        return getVideoSuggestions();
      case "WHITEBOARD":
        return new WhiteboardProcessor().getSuggestions();
      case "IMAGE":
        return new ImageProcessor().getSuggestions();
      default:
        return [];
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
      <div className="flex flex-col">
        <div
          className="flex justify-between items-center p-3 border-b border-blue-100 bg-[#e6f3ff] cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">
              AI Assistant
            </h3>
            {selectedComponent && (
              <span className="text-sm text-blue-600">
                Selected:{" "}
                {selectedComponent.props?.name || selectedComponent.type}
                {selectedComponent.parent && (
                  <span className="text-xs text-gray-500">
                    {" "}
                    (nested in {selectedComponent.parent.type})
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
                {Object.values(LLMProviders).map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <ChatTab
            label="Main Chat"
            isActive={activeChat === "main"}
            onSelect={() => setActiveChat("main")}
          />
          {componentChats.map((chat) => (
            <ChatTab
              key={chat.id}
              chatId={chat.id}
              label={chat.name}
              isActive={activeChat === chat.id}
              onSelect={() => setActiveChat(chat.id)}
              onClose={(chatId) => {
                setComponentChats((prev) =>
                  prev.filter((c) => c.id !== chatId)
                );
                setActiveChat("main");
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 px-4 space-y-4 min-h-[300px] max-h-[calc(80vh-200px)] relative">
        {activeChat === "main"
          ? // Render main chat messages from Redux
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                timestamp={message.timestamp}
                onOptionSelect={handleOptionSelect}
                openComponentChat={openComponentChat}
                selectedComponent={selectedComponent}
                replacedMessageIds={replacedMessageIds}
              />
            ))
          : // Render component-specific chat messages from local state
            componentChats
              .find((chat) => chat.id === activeChat)
              ?.messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  timestamp={message.timestamp}
                  onOptionSelect={handleOptionSelect}
                  openComponentChat={openComponentChat}
                  selectedComponent={selectedComponent}
                  replacedMessageIds={replacedMessageIds}
                />
              ))}
        {isAddingComponent && <TypingIndicator />}
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
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
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
