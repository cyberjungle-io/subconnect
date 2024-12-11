import { StyleCommandProcessor } from '../styleCommandProcessor';
import LLMService from '../llm/llmService';
import { updateComponent, aiAddComponent } from '../../features/editorSlice';
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
      const response = await llmService.sendMessage(prompt + "\n\nUser input: " + input);
      // Clean the response content to ensure it's valid JSON
      const cleanedContent = response.content.trim().replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      // Return a safe fallback that won't break the flow
      return {
        type: "UNKNOWN",
        targetProperty: null,
        value: null,
        confidence: 0
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

      const styleResult = StyleCommandProcessor.processStyleCommand(processedCommand, selectedComponent);
      if (!styleResult) return null;

      const updatedComponent = {
        ...selectedComponent,
        style: {
          ...selectedComponent.style,
          ...styleResult.style,
        },
      };

      await dispatch(updateComponent({
        id: selectedComponent.id,
        updates: updatedComponent,
      }));

      return {
        success: true,
        message: `Updated ${intent.targetProperty} to ${intent.value}`
      };
    } catch (error) {
      console.error("LLM style update failed:", error);
      throw error;
    }
  }

  static async processAddComponent(intent, dispatch) {
    // First try to get component type from the target property
    let componentType = this.getComponentTypeFromName(intent.targetProperty);
    
    // If that fails, try the value field
    if (!componentType) {
      componentType = this.getComponentTypeFromName(intent.value);
    }
    
    // If still no match, try the raw input
    if (!componentType && intent.targetProperty) {
      // Try to match against component config directly
      const matchingComponent = Object.entries(componentConfig).find(([_, config]) => 
        config.name.toLowerCase() === intent.targetProperty.toLowerCase()
      );
      if (matchingComponent) {
        componentType = matchingComponent[0];
      }
    }
    
    if (!componentType || !componentConfig[componentType]) {
      return {
        success: false,
        message: `Could not determine which component to add from: ${intent.targetProperty || 'unknown'}`
      };
    }

    const config = componentConfig[componentType];

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
        message: `Added a new ${config.name} to your canvas!`
      };
    } catch (error) {
      console.error("Error adding component:", error);
      return {
        success: false,
        message: `Failed to add ${config.name}: ${error.message}`
      };
    }
  }

  static getComponentTypeFromName(name) {
    if (!name) return null;
    
    const normalizedName = name.toLowerCase();
    
    // Direct mapping of common names to component types
    const componentMap = {
      'container': 'FLEX_CONTAINER',
      'flex container': 'FLEX_CONTAINER',
      'flexbox': 'FLEX_CONTAINER',
      'text': 'TEXT',
      'image': 'IMAGE',
      'chart': 'CHART',
      'table': 'TABLE',
      'video': 'VIDEO',
      'whiteboard': 'WHITEBOARD',
      'value': 'QUERY_VALUE',
      'query value': 'QUERY_VALUE',
      'kanban': 'KANBAN_BOARD',
      'kanban board': 'KANBAN_BOARD',
      'list': 'TODO_LIST',
      'todo list': 'TODO_LIST'
    };

    return componentMap[normalizedName] || null;
  }
} 