import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  addMessage,
  changeProvider,
} from "../../features/aiChatSlice";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { LLMProviders } from "../../services/llm/llmService";
import { aiAddComponent } from "../../features/editorSlice";
import { AICommandExecutor } from "../../services/aiExecutor";
import { format } from "date-fns";
import { TableProcessor } from "../../services/Processors/TableProcessor";
import { WhiteboardProcessor } from "../../services/Processors/WhiteboardProcessor";
import { ImageProcessor } from "../../services/Processors/ImageProcessor";

const TypingIndicator = () => (
  <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg w-16">
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    />
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    />
  </div>
);

const Message = ({ message, timestamp, onOptionSelect }) => {
  const renderOptions = (options) => {
    if (!Array.isArray(options)) return null;

    return (
      <div className="mt-2 flex flex-col gap-2 w-full">
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
                {/* Add sub-options rendering */}
                {option.options && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
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

          // For category options (main video options)
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

          // For command options (specific video commands)
          if (option.type === "command") {
            if (option.needsInput) {
              return (
                <button
                  key={index}
                  onClick={() => onOptionSelect(option)}
                  className="text-sm px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors w-full text-left"
                >
                  {option.text}
                </button>
              );
            }
            return (
              <button
                key={index}
                onClick={() => onOptionSelect(option)}
                className="text-sm px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors w-full text-left"
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
            // Extract just the name from the text (remove "Name: " prefix)
            const queryName = option.text
              .replace(/^Name:\s*/, "")
              .split("\n")[0];

            return (
              <div key={index} className="w-full">
                <button
                  onClick={() => onOptionSelect(option)}
                  className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors w-full"
                  title={option.text} // Keep full details in tooltip
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
              <div key={index} className="w-full">
                <button
                  onClick={() => onOptionSelect(option)}
                  className="text-sm px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors w-full text-left"
                  title={option.value}
                >
                  <span className="block truncate">{option.value}</span>
                </button>
              </div>
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
                  <div className="mt-1 ml-2 flex flex-row flex-wrap gap-1">
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

          // For info type options (examples/instructions)
          if (option.type === "info") {
            return (
              <div
                key={index}
                className="text-sm px-3 py-2 bg-gray-50 rounded text-gray-600 italic"
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
    message.content?.startsWith("Selected ");

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
  return [
    {
      text: "Create a Component",
      type: "category",
      options: [
        {
          text: "Add a Chart",
          type: "command",
        },
        {
          text: "Add a Table",
          type: "command",
        },
        {
          text: "Add a Video",
          type: "command",
        },
        {
          text: "Add a Kanban Board",
          type: "command",
        },
        {
          text: "Add an Image",
          type: "command",
        },
      ],
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
      text: "Theme Management",
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

const AIChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.w3s?.queries?.list);
  const [input, setInput] = useState("");
  const { messages, isLoading, provider } = useSelector(
    (state) => state.aiChat
  );
  const selectedIds = useSelector((state) => state.editor.selectedIds);
  const components = useSelector((state) => state.editor.components);

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

    // Check if we're awaiting a video URL paste
    const lastMessage = messages[messages.length - 1];
    const isAwaitingVideoUrl = lastMessage?.content === "Paste video URL:";

    // If we're awaiting a video URL and the input looks like a YouTube URL
    const isYoutubeUrl =
      currentInput.includes("youtube.com/watch?v=") ||
      currentInput.includes("youtu.be/");

    // Modify the input if we're awaiting a video URL
    const processedInput =
      isAwaitingVideoUrl && isYoutubeUrl
        ? `set video url to ${currentInput}`
        : awaitingResponse
        ? `${awaitingResponse.originalCommand} (${awaitingResponse.type}: ${currentInput})`
        : currentInput;

    dispatch(
      addMessage({
        id: messageId,
        role: "user",
        content: currentInput,
        timestamp: new Date(),
      })
    );

    setIsTyping(true);

    try {
      // Create a minimal state object with just what we need
      const minimalState = {
        w3s: {
          queries: {
            list: queries,
          },
        },
      };

      const commandResult = await AICommandExecutor.processCommand(
        processedInput,
        dispatch,
        selectedComponent,
        minimalState
      );

      if (commandResult) {
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: commandResult.message,
            timestamp: new Date(),
            status: commandResult.success ? "success" : "error",
            needsMoreInfo: commandResult.needsMoreInfo,
            type: commandResult.type,
            options: commandResult.options, // Add the options to the message
          })
        );

        // If we need more info, store the context for the next message
        if (commandResult.needsMoreInfo) {
          setAwaitingResponse({
            type: commandResult.type,
            originalCommand: currentInput,
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
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
          timestamp: new Date(),
          status: "error",
        })
      );
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

  // Modify the useEffect hook that handles component selection
  useEffect(() => {
    if (selectedComponent?.type === "VIDEO") {
      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : null;

      if (!lastMessage || !isVideoSuggestionsMessage(lastMessage)) {
        const suggestions = getVideoSuggestions();
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: "Here are some things you can do with the video:",
            timestamp: new Date(),
            options: suggestions,
          })
        );
      }
    } else if (selectedComponent?.type === "CHART") {
      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : null;

      if (!lastMessage || !isChartSuggestionsMessage(lastMessage)) {
        const suggestions = getChartSuggestions();
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: "Here are some things you can do with the chart:",
            timestamp: new Date(),
            options: suggestions,
          })
        );
      }
    } else if (selectedComponent?.type === "TABLE") {
      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : null;

      if (!lastMessage || !isTableSuggestionsMessage(lastMessage)) {
        // Create minimal state object with just what we need
        const minimalState = {
          w3s: {
            queries: {
              list: queries,
            },
          },
        };

        const suggestions =
          TableProcessor.getSuggestionsWithState(minimalState);
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: "Here are some things you can do with the table:",
            timestamp: new Date(),
            options: suggestions,
          })
        );
      }
    } else if (selectedComponent?.type === "WHITEBOARD") {
      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : null;

      if (!lastMessage || !isWhiteboardSuggestionsMessage(lastMessage)) {
        const suggestions = WhiteboardProcessor.getSuggestions();
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: "Here are some things you can do with the whiteboard:",
            timestamp: new Date(),
            options: suggestions,
          })
        );
      }
    } else if (selectedComponent?.type === "IMAGE") {
      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : null;
      const isImageSuggestionsMessage = (msg) =>
        msg.role === "assistant" &&
        msg.content === "Here are some things you can do with the image:";

      if (!lastMessage || !isImageSuggestionsMessage(lastMessage)) {
        const suggestions = ImageProcessor.getSuggestions();
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: "Here are some things you can do with the image:",
            timestamp: new Date(),
            options: suggestions,
          })
        );
      }
    }
  }, [selectedComponent?.id]);

  // Add this near the other state declarations
  const initialMessageShown = useRef(false);

  // Replace the existing welcome message useEffect with this:
  useEffect(() => {
    // Only show welcome message if it hasn't been shown and there are no messages
    if (!initialMessageShown.current && messages.length === 0) {
      initialMessageShown.current = true;
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: "👋 Welcome! Here are some things I can help you with:",
          timestamp: new Date(),
          options: getInitialSuggestions(),
        })
      );
    }
  }, []); // Empty dependency array means this runs once when component mounts

  // Modify the handleOptionSelect function to handle video categories
  const handleOptionSelect = async (option) => {
    if (option.needsInput) {
      dispatch(
        addMessage({
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
        })
      );
      setAwaitingResponse({
        type: option.inputType,
        originalCommand: `set stroke color to`,
      });
      return;
    }

    let input = "";

    if (option.selectedOption) {
      // Handle field or query option selection
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
      // Handle color theme options
      input = option.value; // Use the formatted value directly
    } else if (option.type === "category") {
      // Special handling for video URL category
      if (option.text === "Set video URL") {
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: "Paste video URL:",
            timestamp: new Date(),
            options: [
              {
                text: "Format: https://youtube.com/watch?v=...",
                type: "info",
              },
            ],
          })
        );
        return;
      }

      // Show options for other categories
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: `${option.text} options:`,
          timestamp: new Date(),
          options: option.options,
        })
      );
      return;
    } else if (option.type === "command") {
      // Special handling for chart style commands
      if (
        selectedComponent?.type === "CHART" &&
        (option.text.includes("show") || option.text.includes("hide"))
      ) {
        const words = option.text.split(" ");
        const action = words[0]; // "show" or "hide"
        const element = words[words.length - 1]; // Get the last word ("axis")
        const axis = words[words.length - 2]; // Get "x" or "y"

        // Handle axis commands specially
        if (element === "axis") {
          const formattedCommand = `${action} ${axis}-axis`;
          input = formattedCommand;
        } else {
          // For other elements (legend, grid, data points)
          const formattedCommand = `${action} ${element}`;
          input = formattedCommand;
        }
      } else {
        input = option.text;
      }
    } else if (option.type === "info") {
      // Don't do anything for info type options
      return;
    } else if (option.type === "suggestion" && option.options) {
      // Show the specific options for this suggestion
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: `Try these commands for ${option.text.toLowerCase()}:`,
          timestamp: new Date(),
          options: option.options.map((opt) => ({
            text: opt,
            type: "command",
          })),
        })
      );
      return;
    } else if (option.type === "query") {
      // Find the selected query from the queries list
      const selectedQuery = queries.find((q) => q.name === option.value);

      if (selectedQuery && selectedQuery.fields) {
        // Show the fields as options
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: `Available fields for ${selectedQuery.name}:`,
            timestamp: new Date(),
            options: selectedQuery.fields.map((field) => ({
              type: "field",
              text: field.name,
              value: field.name,
              options: ["Set as X-Axis", "Set as Y-Axis", "Add to Y-Axis"],
            })),
          })
        );
        return;
      }
    } else if (option.type === "queryOption") {
      input = `__queryOption__:${option.queryName}::${option.value}`;
    } else if (option.type === "color") {
      // Handle color option clicks
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: "Select an option for this color:",
          timestamp: new Date(),
          options: option.options,
        })
      );
      return;
    } else if (option.type === "command" && option.action === "triggerUpload") {
      // Find and click the file input for the selected component
      const fileInput = document.querySelector(
        `input[type="file"][accept="image/*"]`
      );
      if (fileInput) {
        fileInput.click();
        return;
      }
    } else {
      input = option.text;
    }

    try {
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
        selectedComponent,
        minimalState
      );

      if (commandResult) {
        dispatch(
          addMessage({
            id: Date.now().toString(),
            role: "assistant",
            content: commandResult.message,
            timestamp: new Date(),
            status: commandResult.success ? "success" : "error",
            options: commandResult.options,
          })
        );
      }
    } catch (error) {
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your selection.",
          timestamp: new Date(),
          status: "error",
        })
      );
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
