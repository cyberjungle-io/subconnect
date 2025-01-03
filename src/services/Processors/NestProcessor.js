import { FaLayerGroup } from "react-icons/fa";
import {
  componentTypes,
  componentConfig,
} from "../../components/Components/componentConfig";

export class NestProcessor {
  static getMetadata() {
    return {
      id: "NestProcessor",
      name: "Nest Processor",
      priority: 100,
      contextTypes: ["FLEX_CONTAINER"],
      patterns: [
        {
          pattern:
            /^(?:nest|add|create|insert)\s+(?:a\s+)?(\w+)(?:\s+(?:in|inside|to))?$/i,
          type: "NEST",
          priority: 100,
          property: "nest",
          examples: ["nest text", "add image", "create button inside"],
        },
      ],
    };
  }

  static processCommand(input, context) {
    const lowercaseInput = input.toLowerCase().trim();

    // Handle component type selection
    const nestPattern = /^nest\s+(\w+)$/i;
    const match = input.match(nestPattern);

    if (match) {
      const componentType = match[1].toUpperCase();

      // Special handling for FLEX_CONTAINER
      if (
        componentType === "FLEX_CONTAINER" ||
        componentType === "FLEX" ||
        componentType === "CONTAINER"
      ) {
        return {
          type: "NEST_COMPONENT",
          componentType: "FLEX_CONTAINER",
          message: `Added Flex Container as child component`,
          success: true,
        };
      }

      if (componentConfig[componentType]) {
        return {
          type: "NEST_COMPONENT",
          componentType: componentType,
          message: `Added ${componentConfig[componentType].name} as child component`,
          success: true,
        };
      }
    }

    return null;
  }

  static getSuggestions(headerClass, buttonClass) {
    return {
      text: "Nest",
      type: "category",
      icon: FaLayerGroup,
      options: Object.entries(componentTypes)
        .filter(([type]) => type !== "SAVED_COMPONENT") // Filter out saved components
        .map(([type]) => {
          const config = componentConfig[type];
          return {
            text: config.name,
            type: "command",
            command: `nest ${type}`,
            icon: config.icon,
            className: buttonClass,
          };
        }),
    };
  }
}
