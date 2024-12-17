import { StyleCommandProcessor } from "../styleCommandProcessor";
import LLMService from "../llm/llmService";
import { updateComponent, aiAddComponent } from "../../features/editorSlice";
import { componentConfig } from "../../components/Components/componentConfig";

export class LLMProcessor {
  static async detectIntent(input) {
    const llmService = new LLMService();
    const prompt = `
      Analyze the following user input and match it to one of these intents:
      - "ADD_COMPONENT": User wants to add a new component
      - "STYLE_UPDATE": User wants to modify component styles
      
      For ADD_COMPONENT, set targetProperty to the component name.
      
      Return ONLY valid JSON in this exact format:
      {
        "type": "ADD_COMPONENT or STYLE_UPDATE",
        "targetProperty": "component name or style property",
        "value": "target value if applicable",
        "confidence": number between 0 and 1
      }

      Example for component:
      {"type": "ADD_COMPONENT", "targetProperty": "container", "value": null, "confidence": 0.9}
    `;

    try {
      const response = await llmService.sendMessage(
        prompt + "\n\nUser input: " + input
      );
      // Clean the response content to ensure it's valid JSON
      const cleanedContent = response.content
        .trim()
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "");
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      // Return a safe fallback that won't break the flow
      return {
        type: "UNKNOWN",
        targetProperty: null,
        value: null,
        confidence: 0,
      };
    }
  }

  static async processStyleUpdate(input, intent, selectedComponent, dispatch) {
    try {
      // Map LLM property names to actual style properties and their processors
      const propertyMap = {
        "background-color": {
          property: "backgroundColor",
          command: (value) => `set background color to ${value}`,
        },
        color: {
          property: "color",
          command: (value) => `set color to ${value}`,
        },
        "border-color": {
          property: "borderColor",
          command: (value) => `set border color to ${value}`,
        },
        "border-width": {
          property: "borderWidth",
          command: (value) => `set border width to ${value}`,
        },
        "border-style": {
          property: "borderStyle",
          command: (value) => `set border style to ${value}`,
        },
        "font-size": {
          property: "fontSize",
          command: (value) => `set font size to ${value}`,
        },
        padding: {
          property: "padding",
          command: (value) => `set padding to ${value}`,
        },
        margin: {
          property: "margin",
          command: (value) => `set margin to ${value}`,
        },
        width: {
          property: "width",
          command: (value) => `set width to ${value}`,
        },
        height: {
          property: "height",
          command: (value) => `set height to ${value}`,
        },
      };

      const propertyConfig = propertyMap[intent.targetProperty];
      if (!propertyConfig) {
        console.log("Unknown property:", intent.targetProperty);
        return null;
      }

      // Format the command using the property-specific formatter
      const formattedCommand = propertyConfig.command(intent.value);
      console.log("Formatted style command:", formattedCommand);

      const styleResult = StyleCommandProcessor.processStyleCommand(
        formattedCommand,
        selectedComponent
      );

      console.log("Style processor result:", styleResult);

      if (!styleResult?.style) {
        console.log("No style update generated");
        return null;
      }

      console.log("Style update to apply:", styleResult.style);

      const updatedComponent = {
        ...selectedComponent,
        style: {
          ...selectedComponent.style,
          ...styleResult.style,
        },
      };

      console.log("Updating component with:", updatedComponent);

      await dispatch(
        updateComponent({
          id: selectedComponent.id,
          updates: updatedComponent,
        })
      );

      return {
        success: true,
        message: `Updated ${propertyConfig.property} to ${intent.value}`,
        isCommandExecution: true,
      };
    } catch (error) {
      console.error("LLM style update failed:", error);
      return {
        success: false,
        message: `Failed to update style: ${error.message}`,
      };
    }
  }

  static async processAddComponent(intent, dispatch) {
    // First try to get component type from the target property
    console.log("Processing add component for intent:", intent);
    let componentType = this.getComponentTypeFromName(intent.targetProperty);
    console.log("Component type from target property:", componentType);

    // If that fails, try the value field
    if (!componentType) {
      componentType = this.getComponentTypeFromName(intent.value);
      console.log("Component type from value:", componentType);
    }

    // If still no match, try the raw input
    if (!componentType && intent.targetProperty) {
      // Try to match against component config directly
      const matchingComponent = Object.entries(componentConfig).find(
        ([_, config]) =>
          config.name.toLowerCase() === intent.targetProperty.toLowerCase()
      );
      if (matchingComponent) {
        componentType = matchingComponent[0];
        console.log("Component type from config match:", componentType);
      }
    }

    if (!componentType || !componentConfig[componentType]) {
      console.log(
        "Failed to determine component type. Available types:",
        Object.keys(componentConfig)
      );
      return {
        success: false,
        message: `Could not determine which component to add from: ${
          intent.targetProperty || "unknown"
        }`,
      };
    }

    const config = componentConfig[componentType];
    console.log("Found component config:", config);

    try {
      await dispatch(
        aiAddComponent({
          type: componentType,
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
      console.error("Error adding component:", error);
      return {
        success: false,
        message: `Failed to add ${config.name}: ${error.message}`,
      };
    }
  }

  static getComponentTypeFromName(name) {
    if (!name) return null;

    const normalizedName = name.toLowerCase();
    console.log("Normalized component name:", normalizedName);

    // Direct mapping of common names to component types
    const componentMap = {
      container: "FLEX_CONTAINER",
      "flex container": "FLEX_CONTAINER",
      flexbox: "FLEX_CONTAINER",
      text: "TEXT",
      image: "IMAGE",
      chart: "CHART",
      table: "TABLE",
      video: "VIDEO",
      whiteboard: "WHITEBOARD",
      value: "QUERY_VALUE",
      "query value": "QUERY_VALUE",
      kanban: "KANBAN",
      "kanban board": "KANBAN",
      list: "TODO",
      "todo list": "TODO",
      todo: "TODO",
      todos: "TODO",
      "task list": "TODO",
      tasks: "TODO",
      board: "KANBAN",
      taskboard: "KANBAN",
      "task board": "KANBAN",
    };

    // Try direct match first
    if (componentMap[normalizedName]) {
      console.log("Found direct match:", componentMap[normalizedName]);
      return componentMap[normalizedName];
    }

    // If no direct match, try to find a partial match
    const matchingKey = Object.keys(componentMap).find((key) => {
      const keyMatches =
        key.includes(normalizedName) || normalizedName.includes(key);
      console.log(`Checking '${key}' against '${normalizedName}':`, keyMatches);
      return keyMatches;
    });

    if (matchingKey) {
      console.log("Found partial match:", componentMap[matchingKey]);
      return componentMap[matchingKey];
    }

    // If still no match, try matching against component config names
    const configMatch = Object.entries(componentConfig).find(([_, config]) => {
      const configName = config.name.toLowerCase();
      const matches =
        configName.includes(normalizedName) ||
        normalizedName.includes(configName);
      console.log(
        `Checking config name '${configName}' against '${normalizedName}':`,
        matches
      );
      return matches;
    });

    if (configMatch) {
      console.log("Found config match:", configMatch[0]);
      return configMatch[0];
    }

    console.log("No match found for:", normalizedName);
    return null;
  }
}
