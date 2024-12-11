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
    const llmService = new LLMService();
    const stylePrompt = `
      Convert this natural language request into a specific style command.
      Original request: "${input}"
      Target property: "${intent.targetProperty}"
      
      Available patterns:
      ${JSON.stringify(StyleCommandProcessor.getStylePatterns(), null, 2)}
      
      Respond with the most appropriate command that matches the patterns.
    `;

    try {
      const styleResponse = await llmService.sendMessage(stylePrompt);
      const processedCommand = styleResponse.content.trim();

      const styleResult = StyleCommandProcessor.processStyleCommand(
        processedCommand,
        selectedComponent
      );
      if (!styleResult) return null;

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
        message: `Updated ${intent.targetProperty} to ${intent.value}`,
      };
    } catch (error) {
      console.error("LLM style update failed:", error);
      throw error;
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
      console.log("Failed to determine component type. Available types:", Object.keys(componentConfig));
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
      "todo": "TODO",
      "todos": "TODO",
      "task list": "TODO",
      "tasks": "TODO",
      "board": "KANBAN",
      "taskboard": "KANBAN",
      "task board": "KANBAN",
    };

    // Try direct match first
    if (componentMap[normalizedName]) {
      console.log("Found direct match:", componentMap[normalizedName]);
      return componentMap[normalizedName];
    }

    // If no direct match, try to find a partial match
    const matchingKey = Object.keys(componentMap).find(key => {
      const keyMatches = key.includes(normalizedName) || normalizedName.includes(key);
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
      const matches = configName.includes(normalizedName) || normalizedName.includes(configName);
      console.log(`Checking config name '${configName}' against '${normalizedName}':`, matches);
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
