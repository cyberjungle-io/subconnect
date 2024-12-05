import { componentConfig } from "../components/Components/componentConfig";
import { aiAddComponent, updateComponent } from "../features/editorSlice";
import { StyleCommandProcessor } from "./styleCommandProcessor";
import LLMService from "./llm/llmService";
import { KanbanProcessor } from "./Processors/KanbanProcessor";
import { ChartProcessor } from "./Processors/ChartProcessor";

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

  static async processCommand(input, dispatch, selectedComponent = null, state = null) {
    console.log("Processing command:", input);
    console.log("Selected component:", selectedComponent);

    // Add check for Chart commands first
    if (
      selectedComponent?.type === "CHART" &&
      ChartProcessor.isChartCommand(input)
    ) {
      console.log("Processing Chart-specific command");
      const result = ChartProcessor.processCommand(
        input,
        selectedComponent.props,
        state
      );

      if (result) {
        // If it's just a query info command, return the message without updating the component
        if (result.message && !result.props) {
          return {
            success: true,
            message: result.message
          };
        }

        try {
          await dispatch(
            updateComponent({
              id: selectedComponent.id,
              updates: { ...selectedComponent, props: result.props },
            })
          );
          return {
            success: true,
            message: result.message || `Updated chart successfully`,
          };
        } catch (error) {
          console.error("Chart update failed:", error);
          return {
            success: false,
            message: `Failed to update chart: ${error.message}`,
          };
        }
      }
    }

    // Check if this is a Kanban-specific command for a selected Kanban component
    if (
      selectedComponent?.type === "KANBAN" &&
      KanbanProcessor.isKanbanCommand(input)
    ) {
      console.log("Processing Kanban-specific command");
      const result = KanbanProcessor.processCommand(
        input,
        selectedComponent.props
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
            message: `Updated Kanban board successfully`,
          };
        } catch (error) {
          console.error("Kanban update failed:", error);
          return {
            success: false,
            message: `Failed to update Kanban board: ${error.message}`,
          };
        }
      }
    }

    // Check if this is a follow-up response
    const followUpMatch = input.match(/\(([\w]+):\s*(.+)\)$/);
    if (followUpMatch) {
      const [_, type, value] = followUpMatch;
      console.log("Processing follow-up response:", type, value);

      // Handle shadow follow-up
      if (type === "shadow") {
        const shadowType = value.toLowerCase();
        const newInput = `add ${shadowType} shadow`;
        console.log("Converted to shadow command:", newInput);

        if (!selectedComponent) {
          return {
            success: true,
            message:
              "Where would you like to apply this shadow?\n- The canvas\n- A specific component (please select one first)",
            needsMoreInfo: true,
            type: "target",
          };
        }

        // Process the shadow command
        const styleResult = StyleCommandProcessor.processStyleCommand(
          newInput,
          selectedComponent
        );
        if (styleResult && styleResult.style) {
          try {
            const updatedComponent = {
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                ...styleResult.style,
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
              message: `Added ${shadowType} shadow successfully`,
            };
          } catch (error) {
            return {
              success: false,
              message: `Failed to add shadow: ${error.message}`,
            };
          }
        }
      }

      // Handle target follow-up
      if (type === "target" && value.toLowerCase() === "canvas") {
        // Process the original command for the canvas
        const originalCommand = input.split("(")[0].trim();
        return await this.processCommand(originalCommand, dispatch, null);
      }
    }

    // Check if it's a shadow command without specifying inner/outer
    const shadowPattern =
      /(?:add|make|create|give|set|apply)\s*(?:a|an|the)?\s*shadow/i;
    if (
      input.match(shadowPattern) &&
      !input.match(/(?:inner|outer)\s*shadow/i)
    ) {
      return {
        success: true,
        message:
          "What kind of shadow would you like? You can specify:\n- Inner shadow\n- Outer shadow",
        needsMoreInfo: true,
        type: "shadow",
      };
    }

    // If no component is selected and command seems to be a style modification
    if (!selectedComponent) {
      const stylePatterns = [
        /(?:make|set|change|update|modify|adjust)/i,
        /(?:color|background|border|shadow|radius|size|width|height|margin|padding)/i,
        /(?:bigger|smaller|larger|shorter|taller|wider|narrower)/i,
        /(?:align|center|position|move|place)/i,
      ];

      if (stylePatterns.some((pattern) => pattern.test(input))) {
        return {
          success: true,
          message:
            "Where would you like to apply this change?\n- The canvas\n- A specific component (please select one first)",
          needsMoreInfo: true,
          type: "target",
        };
      }
    }

    // Continue with existing logic for processing the command
    if (selectedComponent) {
      // Clean the input - remove any JSON or explanatory text
      const cleanInput = input.replace(/\{[\s\S]*\}/g, "").trim();
      console.log("Cleaned input:", cleanInput);

      // Try processing style commands directly first
      const styleResult = StyleCommandProcessor.processStyleCommand(
        cleanInput,
        selectedComponent
      );
      console.log("Style processing result:", styleResult);

      if (styleResult && styleResult.style) {
        try {
          const updatedComponent = {
            ...selectedComponent,
            style: {
              ...selectedComponent.style,
              ...styleResult.style,
            },
          };

          console.log("Dispatching component update:", updatedComponent);

          // Ensure we're actually dispatching the update
          await dispatch(
            updateComponent({
              id: selectedComponent.id,
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
    }

    // Only proceed to LLM if style processing didn't work
    const llmService = new LLMService();

    // If direct style processing didn't work, try LLM interpretation
    const intentPrompt = `
      Analyze the following user input and match it to one of these command types:
      1. Add Component: User wants to add/create a new component
      2. Style Update: User wants to modify the style of an existing component
      3. Unknown: Command doesn't match known patterns

      Consider these style patterns:
      ${JSON.stringify(StyleCommandProcessor.getPropertyNames(), null, 2)}

      User input: "${input}"
      
      Respond in JSON format:
      {
        "type": "ADD_COMPONENT | STYLE_UPDATE | UNKNOWN",
        "targetProperty": "style property name if applicable",
        "value": "suggested value if applicable",
        "confidence": "number between 0 and 1"
      }
    `;

    try {
      const intentResponse = await llmService.sendMessage(intentPrompt);
      const intent = JSON.parse(intentResponse.content);
      console.log("Detected intent:", intent);

      if (intent.type === "STYLE_UPDATE" && selectedComponent) {
        // If it's a style update, construct a more precise command
        const stylePrompt = `
          Convert this natural language request into a specific style command.
          Original request: "${input}"
          Target property: "${intent.targetProperty}"
          
          Available patterns:
          ${JSON.stringify(StyleCommandProcessor.getStylePatterns(), null, 2)}
          
          Respond with the most appropriate command that matches the patterns.
        `;

        const styleResponse = await llmService.sendMessage(stylePrompt);
        const processedCommand = styleResponse.content.trim();

        // Try processing the constructed command
        const styleResult = StyleCommandProcessor.processStyleCommand(
          processedCommand,
          selectedComponent
        );
        if (styleResult) {
          try {
            const updatedComponent = {
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                ...styleResult.style,
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
            const updatedProperty = Object.keys(styleResult.style)[0];
            const updatedValue = styleResult.style[updatedProperty];
            const propertyNames = StyleCommandProcessor.getPropertyNames();

            return {
              success: true,
              message: `Updated ${intent.targetProperty} to ${intent.value}`,
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

      // If it's an add component request or the style update failed, continue with existing logic
      return await this.processTraditionalCommand(
        input,
        dispatch,
        selectedComponent
      );
    } catch (error) {
      console.error("Error processing command with LLM:", error);
      // Fallback to traditional processing
      return await this.processTraditionalCommand(
        input,
        dispatch,
        selectedComponent
      );
    }
  }

  static async processTraditionalCommand(input, dispatch, selectedComponent) {
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
