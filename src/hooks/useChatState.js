import { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../features/aiChatSlice";
import { AICommandExecutor } from "../services/aiExecutor";
import ChatMessageService from "../services/Chat/chatMessageService";
import { useComponentSelection } from "./useComponentSelection";

function useChatState() {
  const dispatch = useDispatch();
  const { selectedComponent } = useComponentSelection();
  const [input, setInput] = useState("");
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [componentChats, setComponentChats] = useState([]);
  const [activeChat, setActiveChat] = useState("main");
  const [replacedMessageIds] = useState(new Set());

  const messages = useSelector((state) => state.aiChat.messages);
  const isLoading = useSelector((state) => state.aiChat.isLoading);
  const isVisible = useSelector((state) => state.aiChat.isVisible);
  const queries = useSelector((state) => state.w3s?.queries?.list);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = ChatMessageService.createMessage(input, "user");

    if (activeChat === "main") {
      dispatch(addMessage(userMessage));
    } else {
      setComponentChats((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: [...(chat.messages || []), userMessage],
            };
          }
          return chat;
        })
      );
    }

    setInput("");
    setIsAddingComponent(true);

    try {
      const commandResult = await AICommandExecutor.processCommand(
        input,
        dispatch,
        activeChat !== "main" &&
          !componentChats.find((c) => c.id === activeChat)?.type === "general"
          ? selectedComponent
          : null,
        { w3s: { queries: { list: queries } } }
      );

      const responseMessage = ChatMessageService.createMessage(
        commandResult?.message || "I'll help you with that.",
        "assistant",
        commandResult?.options
      );

      if (activeChat === "main") {
        dispatch(addMessage(responseMessage));
      } else {
        setComponentChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...(chat.messages || []), responseMessage],
              };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.error("Error processing command:", error);
      const errorMessage = ChatMessageService.createMessage(
        "Sorry, I encountered an error processing your request.",
        "assistant"
      );

      if (activeChat === "main") {
        dispatch(addMessage(errorMessage));
      } else {
        setComponentChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...(chat.messages || []), errorMessage],
              };
            }
            return chat;
          })
        );
      }
    } finally {
      setIsAddingComponent(false);
    }
  };

  const createNewGeneralChat = useCallback(() => {
    const chatNumber =
      componentChats.filter((chat) => chat.type === "general").length + 1;
    const newChatId = `general-${Date.now()}`;
    const newChat = {
      id: newChatId,
      name: `Chat ${chatNumber}`,
      type: "general",
      messages: [],
    };

    setComponentChats((prev) => [...prev, newChat]);
    setTimeout(() => setActiveChat(newChatId), 0);
  }, [componentChats]);

  return {
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
  };
}

export default useChatState;
