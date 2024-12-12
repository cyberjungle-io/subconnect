import { store } from "../../store/store";
import { addMessage } from "../../features/aiChatSlice";
import { format } from "date-fns";

class ChatMessageService {
  static createMessage(content, role = "assistant", options = null) {
    return {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date().toISOString(),
      options,
    };
  }

  static addNotification(content) {
    const message = {
      id: Date.now().toString(),
      content,
      role: "assistant",
      timestamp: new Date().toISOString(),
      isNotification: true,
    };
    store.dispatch(addMessage(message));
    return message;
  }

  static isCommandExecution(content) {
    return content?.match(/^(Set |Added |Updated |Selected |Created |Opened )/);
  }

  static isComponentSuggestions(message) {
    return (
      message.role === "assistant" &&
      message.content.startsWith("Here are some things you can do with")
    );
  }

  static isRecent(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    return now.getTime() - messageTime.getTime() < 60000; // Less than 1 minute ago
  }

  static formatTimestamp(timestamp) {
    return format(new Date(timestamp), "HH:mm");
  }
}

export default ChatMessageService;
