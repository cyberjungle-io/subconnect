import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, changeProvider } from "../../features/aiChatSlice";
import { FaTimes, FaChevronLeft, FaChevronRight, FaCog, FaPlus } from "react-icons/fa";
import { LLMProviders } from "../llm/llmService";
import { AICommandExecutor } from "../aiExecutor";
import { TableProcessor } from "../Processors/TableProcessor";
import { WhiteboardProcessor } from "../Processors/WhiteboardProcessor";
import { ImageProcessor } from "../Processors/ImageProcessor";
import { componentConfig } from "../../components/Components/componentConfig";
import ChatTabs from "./ChatTabs";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ChatMessageService from "../chatMessageService";
import { useComponentSelection } from "../../hooks/useComponentSelection";
import useChatState from "../../hooks/useChatState";
import { FlexContainerProcessor } from '../Processors/FlexContainerProcessor';
import { StyleCommandProcessor } from "../styleCommandProcessor";

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

const ScrollableTabList = ({ children }) => {
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef(null);

  const checkScroll = useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(checkScroll, 0);

    const handleResize = () => {
      clearTimeout(timeoutId);
      setTimeout(checkScroll, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkScroll, children]);

  const scroll = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const handleWheel = (e) => {
    if (tabsRef.current) {
      // Prevent both default behavior and propagation
      e.preventDefault();
      e.stopPropagation();

      // Calculate scroll amount based on deltaY (vertical scroll)
      // or deltaX (horizontal scroll) with a multiplier for smoother scrolling
      const scrollMultiplier = 2;
      const scrollAmount = (e.deltaY || e.deltaX) * scrollMultiplier;

      // Apply the scroll
      tabsRef.current.scrollLeft += scrollAmount;

      // Check scroll position
      requestAnimationFrame(checkScroll);
    }
  };

  useEffect(() => {
    if (!tabsRef.current) return;

    const observer = new MutationObserver(checkScroll);
    observer.observe(tabsRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Add wheel event listener to the tabs container
    const tabsElement = tabsRef.current;
    tabsElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      observer.disconnect();
      tabsElement.removeEventListener("wheel", handleWheel);
    };
  }, [checkScroll]);

  return (
    <div
      className="relative flex items-center w-full"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {showArrows && canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 h-full px-1 bg-gradient-to-r from-white to-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all"
        >
          <FaChevronLeft className="text-gray-500" />
        </button>
      )}

      <div
        ref={tabsRef}
        className="flex overflow-x-auto scrollbar-hide w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={checkScroll}
      >
        <div className="flex min-w-min">{children}</div>
      </div>

      {showArrows && canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 h-full px-1 bg-gradient-to-l from-white to-transparent hover:bg-gradient-to-l hover:from-gray-50 hover:to-transparent transition-all"
        >
          <FaChevronRight className="text-gray-500" />
        </button>
      )}
    </div>
  );
};

const AIChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.w3s?.queries?.list);
  const {
    input,
    setInput,
    isAddingComponent,
    setIsAddingComponent,
    componentChats,
    setComponentChats,
    activeChat,
    setActiveChat,
    replacedMessageIds,
    messages,
    isLoading,
    isVisible,
    handleSubmit,
    createNewGeneralChat,
  } = useChatState();

  const selectedIds = useSelector((state) => state.editor.selectedIds);
  const components = useSelector((state) => state.editor.components);
  const mode = useSelector((state) => state.editor.mode);

  // Add the awaitingResponse state
  const [awaitingResponse, setAwaitingResponse] = useState(null);

  // Keep useComponentSelection for component-specific logic
  const { selectedComponent, hasSelection } = useComponentSelection();

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

  // Add these refs near the top of the component with other state declarations
  const initializationRef = useRef(false);
  const componentMessageRef = useRef(false);

  // Move the ref declaration outside of the effect
  const lastHandledComponentRef = useRef(null);

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
        const contextMap = {
          "Border": "border",
          "Background": "background",
          "Text": "text"
        };
        
        if (contextMap[option.text]) {
          StyleCommandProcessor.setContext(contextMap[option.text]);
        }
        
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

  // Modify the component selection effect
  useEffect(() => {
    // Skip if chat window is not visible
    if (!isVisible) {
      initializationRef.current = false;
      return;
    }

    // Handle initial welcome message only once
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
      return;
    }

    // Handle component selection
    if (selectedComponent) {
      const chatId = `${selectedComponent.type}_${selectedComponent.id}`;
      
      // Only proceed if this is a new component selection
      if (lastHandledComponentRef.current !== selectedComponent.id) {
        lastHandledComponentRef.current = selectedComponent.id;
        
        // Add selection notification only once per component
        if (!componentMessageRef.current) {
          ChatMessageService.addNotification(`Component selected: ${selectedComponent.type}`);
          componentMessageRef.current = true;
        }

        // Check for existing chat
        const existingChat = componentChats.find(chat => chat.componentId === selectedComponent.id);

        if (existingChat) {
          // Switch to existing chat if not already active
          if (activeChat !== existingChat.id) {
            setActiveChat(existingChat.id);
          }
        } else {
          // Create new component chat
          const initialMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: `Here are some things you can do with the ${selectedComponent.type.toLowerCase()}:`,
            timestamp: new Date(),
            options: getComponentSpecificOptions(selectedComponent),
          };

          setComponentChats(prev => [
            ...prev,
            {
              id: chatId,
              componentId: selectedComponent.id,
              type: selectedComponent.type,
              name: selectedComponent.type,
              messages: [initialMessage],
            },
          ]);
          setActiveChat(chatId);
        }
      }
    } else {
      // Reset refs when no component is selected
      componentMessageRef.current = false;
      lastHandledComponentRef.current = null;
      
      // Switch back to main chat if needed
      if (activeChat !== "main") {
        setActiveChat("main");
      }
    }

    // Cleanup function
    return () => {
      if (!isVisible) {
        initializationRef.current = false;
      }
    };
  }, [
    isVisible, 
    selectedComponent, 
    dispatch, 
    messages.length, 
    componentChats, 
    activeChat
  ]); // Add all dependencies

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

  // Remove the duplicate openComponentChat declaration and use this one
  const openComponentChat = useCallback(() => {
    if (selectedComponent) {
      const existingChat = componentChats.find(
        (chat) => chat.componentId === selectedComponent.id
      );

      if (existingChat) {
        setActiveChat(existingChat.id);
        return;
      }

      const newChat = {
        id: `component-${selectedComponent.id}`,
        componentId: selectedComponent.id,
        name: selectedComponent.type,
        messages: [],
      };

      setComponentChats((prev) => [...prev, newChat]);
      setActiveChat(newChat.id);
    }
  }, [selectedComponent, componentChats, setActiveChat, setComponentChats]);

  // Add this helper function to get component-specific options
  const getComponentSpecificOptions = (component) => {
    switch (component.type) {
      case "CHART":
        return getChartSuggestions();
      case "TABLE":
        return TableProcessor.getSuggestionsWithState({
          w3s: { queries: { list: queries } },
        });
      case "VIDEO":
        return getVideoSuggestions();
      case "WHITEBOARD":
        return WhiteboardProcessor.getSuggestions();
      case "IMAGE":
        return ImageProcessor.getSuggestions();
      case "FLEX_CONTAINER":
        return FlexContainerProcessor.getSuggestions();
      default:
        return [];
    }
  };

  const [showSettings, setShowSettings] = useState(false);

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
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold text-gray-700">
              AI Assistant
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => createNewGeneralChat()}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                title="New Chat"
              >
                <FaPlus className="text-gray-500" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                title="Settings"
              >
                <FaCog className="text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="p-4 border-b border-blue-100 bg-white">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Settings</h4>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">AI Provider</label>
                <select
                  value={currentProvider}
                  onChange={handleProviderChange}
                  className="text-sm p-2 rounded border border-blue-200 w-full"
                >
                  {Object.values(LLMProviders).map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <ChatTabs
          activeChat={activeChat}
          componentChats={componentChats}
          mode={mode}
          setActiveChat={setActiveChat}
          setComponentChats={setComponentChats}
          dispatch={dispatch}
        />
      </div>

      <MessageList
        messages={messages}
        activeChat={activeChat}
        componentChats={componentChats}
        isAddingComponent={isAddingComponent}
        handleOptionSelect={handleOptionSelect}
        openComponentChat={openComponentChat}
        selectedComponent={selectedComponent}
        replacedMessageIds={replacedMessageIds}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        inputPlaceholder={inputPlaceholder}
      />
    </div>
  );
};

export default AIChatWindow;
