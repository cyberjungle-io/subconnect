import { componentConfig } from "../components/Components/componentConfig";
import {
  aiAddComponent,
  updateComponent,
  updateColorTheme,
  updateToolbarSettings,
} from "../features/editorSlice";
import { StyleCommandProcessor } from "./styleCommandProcessor";
import LLMService from "./llm/llmService";
import { KanbanProcessor } from "./Processors/KanbanProcessor";
import { ChartProcessor } from "./Processors/ChartProcessor";
import { VideoProcessor } from "./Processors/VideoProcessor";
import { TableProcessor } from "./Processors/TableProcessor";
import { WhiteboardProcessor } from "./Processors/WhiteboardProcessor";
import { ColorThemeProcessor } from "./Processors/ColorThemeProcessor";
import { ImageProcessor } from "./Processors/ImageProcessor";
import { QueryValueProcessor } from "./Processors/QueryValueProcessor";
import { ToolbarProcessor } from "./Processors/ToolbarProcessor";
import { LLMProcessor } from "./Processors/LLMProcessor";
import { SpacingProcessor } from "./Processors/SpacingProcessor";
import { FlexContainerProcessor } from "./Processors/FlexContainerProcessor";

export class AICommandExecutor {
  // Define actionWords as a static class property
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

  // Helper function to generate variations of component names
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

  static async processCommand(
    input,
    dispatch,
    selectedComponent = null,
    state = null
  ) {
    console.log("Processing command for", selectedComponent?.type);

    // First try processing with FlexContainer if that's the selected component
    if (selectedComponent?.type === "FLEX_CONTAINER") {
      console.log("Trying FlexContainer processor first");
      const flexResult = FlexContainerProcessor.processCommand(
        input,
        selectedComponent
      );
      if (flexResult) {
        try {
          // Handle style updates
          if (flexResult.style) {
            const updatedComponent = {
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                ...flexResult.style,
              },
            };
            await dispatch(
              updateComponent({
                id: selectedComponent.id,
                updates: updatedComponent,
              })
            );
          }

          // Handle prop updates
          if (flexResult.props) {
            const updatedComponent = {
              ...selectedComponent,
              props: {
                ...selectedComponent.props,
                ...flexResult.props,
              },
            };
            await dispatch(
              updateComponent({
                id: selectedComponent.id,
                updates: updatedComponent,
              })
            );
          }

          return {
            success: true,
            message:
              flexResult.message || "Updated flex container successfully",
          };
        } catch (error) {
          console.error("Error updating flex container:", error);
          return {
            success: false,
            message: `Failed to update flex container: ${error.message}`,
          };
        }
      }
    }

    // If FlexContainer processing didn't handle it, try style processors
    const styleResult = StyleCommandProcessor.processStyleCommand(
      input,
      selectedComponent
    );
    if (styleResult) {
      console.log("Style processor result:", styleResult);

      // If we have style or props updates, apply them
      if ((styleResult.style || styleResult.props) && selectedComponent) {
        const updatedComponent = {
          ...selectedComponent,
          style: styleResult.style
            ? {
                ...selectedComponent.style,
                ...styleResult.style,
              }
            : selectedComponent.style,
          props: styleResult.props
            ? {
                ...selectedComponent.props,
                ...styleResult.props,
              }
            : selectedComponent.props,
        };

        await dispatch(
          updateComponent({
            id: selectedComponent.id,
            updates: updatedComponent,
          })
        );

        // If we have a message and options, return them for the chat
        if (styleResult.message || styleResult.options) {
          return {
            success: true,
            message: styleResult.message || "Updated style successfully",
            options: styleResult.options,
          };
        }

        return {
          success: true,
          message: "Updated style successfully",
        };
      }

      // If we only have a message and/or options (no style/props updates), return them directly
      if (styleResult.message || styleResult.options) {
        return {
          success: true,
          message: styleResult.message,
          options: styleResult.options,
        };
      }

      return styleResult;
    }

    // Clean the input first
    const cleanInput = input.replace(/\{[\s\S]*\}/g, "").trim();

    const shadowPattern = /shadow/i;
    const isRemoveShadow =
      /(remove|clear|delete|get rid of|turn off|switch off|no) .*(shadow|shadows)/i.test(
        cleanInput
      );

    // Check for shadow pattern early - MODIFIED to skip for removal commands
    if (
      input.match(shadowPattern) &&
      !input.match(/(?:inner|outer)\s*shadow/i) &&
      !isRemoveShadow // Skip the prompt if it's a removal command
    ) {
      return {
        success: true,
        message:
          "What kind of shadow would you like? You can specify:\n- Inner shadow\n- Outer shadow",
        needsMoreInfo: true,
        type: "shadow",
      };
    }

    // If it's a remove shadow command, process it directly
    if (isRemoveShadow && selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        style: {
          ...selectedComponent.style,
          boxShadow: "none",
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
        message: "Removed shadow",
        isCommandExecution: true,
      };
    }

    // Process spacing commands for any component
    const spacingResult = SpacingProcessor.processCommand(input);
    if (spacingResult && selectedComponent) {
      try {
        let updatedStyle;
        if (spacingResult.adjust) {
          // Handle incremental adjustments
          updatedStyle = spacingResult.adjust(selectedComponent.style);
        } else {
          // Handle absolute value updates (presets)
          updatedStyle = spacingResult.style;
        }

        const updatedComponent = {
          ...selectedComponent,
          style: {
            ...selectedComponent.style,
            ...updatedStyle,
          },
        };

        await dispatch(
          updateComponent({
            id: selectedComponent.id,
            updates: updatedComponent,
          })
        );

        // Generate success message in standard format
        const property = Object.keys(updatedStyle)[0];
        const value = updatedStyle[property];
        const action = input.includes("add")
          ? "Set"
          : input.includes("remove")
          ? "Set"
          : "Updated";
        return {
          success: true,
          message: `${action} ${property} to ${value}`,
          isCommandExecution: true, // This flag will trigger the checkmark style
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to update spacing: ${error.message}`,
        };
      }
    }

    // Handle Query Value commands
    if (selectedComponent?.type === "QUERY_VALUE") {
      const queryResult = await this.processQueryValueCommand(
        cleanInput,
        selectedComponent,
        dispatch,
        state
      );
      if (queryResult) return queryResult;
    }

    // Only try direct style processing if FlexContainer processing didn't handle it
    if (selectedComponent) {
      const styleResult = await this.processStyleCommand(
        cleanInput,
        selectedComponent,
        dispatch
      );
      if (styleResult) return styleResult;
    }

    // If direct processing didn't work, try LLM interpretation
    const llmResult = await this.processWithLLM(
      cleanInput,
      selectedComponent,
      dispatch
    );
    if (llmResult) return llmResult;

    // Add check for Table commands
    if (
      selectedComponent?.type === "TABLE" &&
      TableProcessor.isTableCommand(input)
    ) {
      console.log("Processing Table-specific command");
      const result = TableProcessor.processCommand(
        input,
        selectedComponent.props || {},
        state
      );

      if (result) {
        try {
          await dispatch(
            updateComponent({
              id: selectedComponent.id,
              updates: { ...selectedComponent, props: result.props },
            })
          );
          return {
            success: true,
            message: result.message || `Updated table successfully`,
          };
        } catch (error) {
          console.error("Table update failed:", error);
          return {
            success: false,
            message: `Failed to update table: ${error.message}`,
          };
        }
      }
    }

    return null;
  }

  static async processQueryValueCommand(input, component, dispatch, state) {
    if (!QueryValueProcessor.isQueryValueCommand(input)) return null;

    console.log("Processing Query Value-specific command");
    const result = QueryValueProcessor.processCommand(
      input,
      component.props || {},
      state
    );

    if (!result) return null;

    try {
      await dispatch(
        updateComponent({
          id: component.id,
          updates: { ...component, props: result.props },
        })
      );

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error("Query Value update failed:", error);
      return {
        success: false,
        message: `Failed to update Query Value: ${error.message}`,
      };
    }
  }

  static async processStyleCommand(input, component, dispatch) {
    const styleResult = StyleCommandProcessor.processStyleCommand(
      input,
      component
    );

    // Handle PROMPT type responses
    if (styleResult?.type === "PROMPT") {
      if (styleResult.followUp) {
        // Store the followUp info for next command
        this.pendingFollowUp = styleResult.followUp;
      }
      return {
        success: true,
        message: styleResult.message,
        options: styleResult.options,
        needsMoreInfo: true,
        property: styleResult.property,
      };
    }

    // Check if this is a followUp response
    if (this.pendingFollowUp) {
      const followUpType = this.pendingFollowUp.type;
      if (followUpType === "COLOR_CHANGE") {
        // Transform the input using the stored command generator
        input = this.pendingFollowUp.command(input);
        // Clear the pending followUp
        this.pendingFollowUp = null;
      }
    }

    if (!styleResult?.style) return null;

    try {
      const updatedComponent = {
        ...component,
        style: {
          ...component.style,
          ...styleResult.style,
        },
      };

      console.log("Dispatching component update:", updatedComponent);
      await dispatch(
        updateComponent({
          id: component.id,
          updates: updatedComponent,
        })
      );

      return {
        success: true,
        message: `Updated style successfully`,
      };
    } catch (error) {
      console.error("Style update failed:", error);
      return {
        success: false,
        message: `Failed to update style: ${error.message}`,
      };
    }
  }

  static async processWithLLM(input, selectedComponent, dispatch) {
    try {
      const intent = await LLMProcessor.detectIntent(input);
      console.log("Detected intent:", intent);

      if (intent.type === "STYLE_UPDATE" && selectedComponent) {
        return await LLMProcessor.processStyleUpdate(
          input,
          intent,
          selectedComponent,
          dispatch
        );
      } else if (intent.type === "ADD_COMPONENT") {
        return await LLMProcessor.processAddComponent(intent, dispatch);
      }

      return null;
    } catch (error) {
      console.error("Error processing with LLM:", error);
      return {
        success: false,
        message: `Failed to process with LLM: ${error.message}`,
      };
    }
  }

  static async processTraditionalCommand(
    input,
    dispatch,
    selectedComponent,
    state = null
  ) {
    const lowercaseInput = input.toLowerCase();

    // Check for ambiguous commands that need clarification
    const colorPattern =
      /(?:make|set|change|add)\s*(?:it|this)?\s*(?:to|the)?\s*(?:color|background)/i;
    if (
      colorPattern.test(lowercaseInput) &&
      !/#[0-9a-fA-F]{6}|(?:blue|red|green|yellow|purple|black|white|gray)/i.test(
        lowercaseInput
      )
    ) {
      return {
        success: true,
        message:
          "What color would you like to use? You can specify:\n- A color name (e.g., blue, red, green)\n- A hex color code (#RRGGBB)",
        needsMoreInfo: true,
        type: "color",
      };
    }

    // If we have a selected component, try processing with VideoProcessor first for video commands
    if (selectedComponent?.type === "VIDEO") {
      const videoResult = VideoProcessor.processCommand(
        input,
        selectedComponent.props || {}
      );
      if (videoResult) {
        try {
          await dispatch(
            updateComponent({
              id: selectedComponent.id,
              updates: {
                ...selectedComponent,
                props: {
                  ...selectedComponent.props,
                  ...videoResult.props,
                },
              },
            })
          );

          return {
            success: true,
            message: `Updated video settings successfully`,
          };
        } catch (error) {
          console.error("Video update failed:", error);
          return {
            success: false,
            message: `Failed to update video: ${error.message}`,
          };
        }
      }
    }

    // Check for size-related commands without specific values
    const sizePattern =
      /(?:make|set|change)\s*(?:it|this)?\s*(?:bigger|larger|smaller|size)/i;
    if (
      sizePattern.test(lowercaseInput) &&
      !/\d+(?:px|em|rem|%)/i.test(lowercaseInput)
    ) {
      return {
        success: true,
        message:
          "How would you like to adjust the size?\n- Specify a width/height (e.g., 200px)\n- Use relative terms (e.g., 'a little bigger', '50% larger')",
        needsMoreInfo: true,
        type: "size",
      };
    }

    // First, check if we're trying to modify a selected FLEX_CONTAINER
    if (selectedComponent?.type === "FLEX_CONTAINER") {
      console.log("Processing command for FLEX_CONTAINER");

      // Check each component type for a match
      for (const [type, config] of Object.entries(componentConfig)) {
        const nameVariations = this.getNameVariations(config.name);
        const patterns = [];

        // Use the static actionWords property
        for (const action of AICommandExecutor.actionWords) {
          for (const name of nameVariations) {
            patterns.push(
              `${action} a ${name}`,
              `${action} an ${name}`,
              `${action} ${name}`,
              `${action} some ${name}`
            );
          }
        }

        // Check if any pattern matches the input
        if (patterns.some((pattern) => lowercaseInput.includes(pattern))) {
          try {
            console.log(`Adding ${type} as child to FLEX_CONTAINER`);

            // Generate a unique ID for the child
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const uniqueId = `${timestamp}_${randomString}`;

            // Create the child component
            const childComponent = {
              id: uniqueId,
              type: type,
              name: `${config.name}_${uniqueId.substr(0, 8)}`,
              props: {
                name: `AI Created ${config.name}`,
                ...config.defaultProps,
              },
              style: {
                ...config.defaultSize,
                ...config.style,
              },
              children: [],
              acceptsChildren: config.acceptsChildren || false,
            };

            // Update the parent FLEX_CONTAINER with the new child
            const updatedComponent = {
              ...selectedComponent,
              children: [...(selectedComponent.children || []), childComponent],
            };

            console.log(
              "Updating FLEX_CONTAINER with new child:",
              updatedComponent
            );

            dispatch(
              updateComponent({
                id: selectedComponent.id,
                updates: updatedComponent,
              })
            );

            return {
              success: true,
              message: `Added a new ${config.name} to the selected container!`,
            };
          } catch (error) {
            console.error("Error adding child component:", error);
            return {
              success: false,
              message: `Failed to add child component: ${error.message}`,
            };
          }
        }
      }
    }

    // If we get here, either:
    // 1. No FLEX_CONTAINER is selected
    // 2. The command wasn't for adding a component
    // 3. The selected component isn't a FLEX_CONTAINER

    // Try processing style commands
    if (selectedComponent) {
      const styleUpdates = StyleCommandProcessor.processStyleCommand(
        lowercaseInput,
        selectedComponent
      );
      if (styleUpdates) {
        try {
          const updatedComponent = {
            ...selectedComponent,
            style: {
              ...selectedComponent.style,
              ...styleUpdates.style,
            },
          };

          console.log("Final component update:", updatedComponent);

          // Update the component, whether it's nested or not
          dispatch(
            updateComponent({
              id: selectedComponent.id,
              updates: updatedComponent,
            })
          );

          // Generate appropriate success message
          const updatedProperty = Object.keys(styleUpdates.style)[0];
          const updatedValue = styleUpdates.style[updatedProperty];
          const propertyNames = StyleCommandProcessor.getPropertyNames();

          return {
            success: true,
            message: `Updated the ${selectedComponent.type}'s ${
              propertyNames[updatedProperty] || updatedProperty
            } to ${updatedValue}`,
          };
        } catch (error) {
          console.error("Update failed:", error);
          return {
            success: false,
            message: `Failed to update component: ${error.message}`,
          };
        }
      }
    }

    // If nothing else matched, try adding a component to the canvas
    // Check each component type for a match
    for (const [type, config] of Object.entries(componentConfig)) {
      const nameVariations = this.getNameVariations(config.name);

      // Add type-based variations
      if (type === "FLEX_CONTAINER") {
        nameVariations.push(
          "flex",
          "flex container",
          "flex_container",
          "flexcontainer"
        );
      }

      // Generate natural language patterns
      const patterns = [];

      // Use the static actionWords property
      for (const action of AICommandExecutor.actionWords) {
        for (const name of nameVariations) {
          patterns.push(
            `${action} a ${name}`,
            `${action} an ${name}`,
            `${action} ${name}`,
            `${action} some ${name}`,
            `${name} ${action}`,
            `new ${name}`
          );
        }
      }

      // Additional natural patterns
      patterns.push(
        ...nameVariations.map((name) => `i want to add ${name}`),
        ...nameVariations.map((name) => `i need ${name}`),
        ...nameVariations.map((name) => `${name} please`),
        ...nameVariations.map((name) => `can i get ${name}`),
        ...nameVariations.map((name) => `${name} would be nice`)
      );

      // Check if any pattern matches the input
      if (patterns.some((pattern) => lowercaseInput.includes(pattern))) {
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

          // Generate a more natural response
          const responses = [
            `I've added a new ${config.name} to your canvas. Feel free to customize it!`,
            `Here's your new ${config.name}! You can customize it using the toolbar.`,
            `I've created a ${config.name} for you. You'll find it on your canvas.`,
            `Done! I've added a ${config.name} to your workspace.`,
            `Your new ${config.name} is ready to use!`,
          ];

          return {
            success: true,
            message: responses[Math.floor(Math.random() * responses.length)],
          };
        } catch (error) {
          return {
            success: false,
            message: `Sorry, I couldn't add the ${config.name}: ${error.message}`,
          };
        }
      }
    }

    return null;
  }
}
