import { componentConfig } from "../components/Components/componentConfig";
import {
  aiAddComponent,
  updateComponent,
  updateColorTheme,
  updateToolbarSettings,
} from "../features/editorSlice";
import { useProcessorRegistry } from "./ProcessorRegistryContext";
import LLMService from "./llm/llmService";

export class AICommandExecutor {
  static actionWords = [
    "add",
    "create",
    "insert",
    "place",
    "put",
    "make",
    "generate",
    "give me",
    "i want",
    "i need",
    "can you add",
    "could you add",
    "please add",
    "would you add",
    "i'd like",
  ];

  static async processCommand(
    input,
    dispatch,
    selectedComponent = null,
    state = null
  ) {
    console.log("Processing command for", selectedComponent?.type);

    try {
      // Create command context
      const context = {
        componentType: selectedComponent?.type,
        state: state,
        style: selectedComponent?.style,
        props: selectedComponent?.props,
      };

      // Get processor registry instance
      const registry = window.processorRegistry;
      if (!registry) {
        throw new Error("Processor Registry not initialized");
      }

      // Process command through registry
      const result = await registry.processCommand(input, context);

      if (result) {
        console.log("Processor result:", result);

        // Handle style/props updates
        if (result.style || result.props) {
          const updatedComponent = {
            ...selectedComponent,
            style: {
              ...selectedComponent?.style,
              ...result.style,
            },
            props: {
              ...selectedComponent?.props,
              ...result.props,
            },
          };

          await dispatch(
            updateComponent({
              id: selectedComponent.id,
              updates: updatedComponent,
            })
          );

          return {
            success: true,
            message: result.message || `Updated component properties`,
            type: "COMMAND_EXECUTED",
          };
        }

        // Handle other result types
        if (result.type === "PROMPT") {
          return {
            success: true,
            message: result.message,
            options: result.options,
            type: result.type,
            property: result.property,
            context: result.context,
          };
        }

        return result;
      }

      // If no processor matched, try component creation
      const componentResult = await this.tryComponentCreation(input, dispatch);
      if (componentResult) {
        return componentResult;
      }

      return {
        success: false,
        message:
          "I'm not sure how to handle that command. Could you try rephrasing it?",
      };
    } catch (error) {
      console.error("AICommandExecutor error:", error);
      // Determine if this is a recoverable error
      const isRecoverable = !(
        error instanceof TypeError || error instanceof ReferenceError
      );

      return {
        success: false,
        message: isRecoverable
          ? `I encountered an issue: ${error.message}. Please try again.`
          : "Sorry, I'm having technical difficulties. Please try again later.",
        error: error,
        recoverable: isRecoverable,
      };
    }
  }

  static async tryComponentCreation(input, dispatch) {
    const lowercaseInput = input.toLowerCase();

    for (const [type, config] of Object.entries(componentConfig)) {
      const nameVariations = this.getNameVariations(config.name);
      const matchesComponent = this.actionWords.some((action) =>
        nameVariations.some((name) =>
          lowercaseInput.includes(`${action} ${name}`)
        )
      );

      if (matchesComponent) {
        try {
          await dispatch(
            aiAddComponent({
              type: type,
              position: { x: 20, y: 20 },
              props: {
                name: `AI Created ${config.name}`,
                ...config.defaultProps,
              },
              style: {
                ...config.defaultSize,
                ...config.style,
              },
            })
          );

          return {
            success: true,
            message: `Added a new ${config.name} to your canvas!`,
          };
        } catch (error) {
          console.error("Component creation error:", error);
          return {
            success: false,
            message: `Failed to add ${config.name}: ${error.message}`,
          };
        }
      }
    }

    return null;
  }

  // Existing helper methods remain unchanged
  static getNameVariations(componentName) {
    const baseName = componentName.toLowerCase();
    const withoutSpaces = baseName.replace(/\s+/g, "");
    return [
      baseName,
      withoutSpaces,
      // Common variations
      baseName.replace("container", "box"),
      baseName.replace("component", ""),
      // Handle specific cases
      baseName === "todo list" ? "todos" : null,
      baseName === "kanban board" ? "kanban" : null,
      baseName === "flex container" ? "flexbox" : null,
      baseName === "flex_container" ? "flexbox" : null,
      baseName === "flexcontainer" ? "flexbox" : null,
      baseName === "query value" ? "query" : null,
    ].filter(Boolean); // Remove null values
  }
}
