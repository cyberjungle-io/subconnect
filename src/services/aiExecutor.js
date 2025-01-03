import { v4 as uuidv4 } from "uuid";
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

        // Handle NEST_COMPONENT type results
        if (result.type === "NEST_COMPONENT" && selectedComponent) {
          const config = componentConfig[result.componentType];
          if (!config) {
            throw new Error(`Invalid component type: ${result.componentType}`);
          }

          // Generate unique ID and timestamp for the new component
          const timestamp = Date.now();
          const uniqueId = `${timestamp}_${uuidv4().split("-")[0]}`;
          const componentName = `${result.componentType}_${timestamp}`.slice(
            0,
            20
          );

          // Create the new component as a child with unique ID
          const newComponent = {
            id: uniqueId,
            type: result.componentType,
            name: componentName,
            acceptsChildren: config.acceptsChildren || false,
            children: [],
            content: config.defaultContent || "",
            position: { x: 20, y: 20 },
            props: {
              name: `AI Created ${config.name}`,
              ...config.defaultProps,
              id: uniqueId,
              isDraggingDisabled: false,
              name: componentName,
              depth: (selectedComponent.props?.depth || 0) + 1,
            },
            style: {
              ...config.defaultSize,
              ...config.style,
              padding: "0px",
              margin: "0px",
              gap: "0px",
              left: 0,
              top: 0,
            },
          };

          // Update the parent component with the new child
          await dispatch(
            updateComponent({
              id: selectedComponent.id,
              updates: {
                children: [...(selectedComponent.children || []), newComponent],
              },
            })
          );

          return {
            success: true,
            message:
              result.message || `Added ${config.name} as child component`,
            type: "COMMAND_EXECUTED",
          };
        }

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
      return {
        success: false,
        message: `Error: ${error.message}`,
        error: error,
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
