import { ColorProcessor } from "./ColorProcessor";
import { FaBorderStyle, FaPalette, FaPlus, FaTimes } from "react-icons/fa";

// Add isLightColor utility function
const isLightColor = (color) => {
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    return true; // Default to dark text for named colors
  }

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export class BorderProcessor {
  static getStylePatterns() {
    return {
      borderWidth: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*(?:width)?\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /border\s*width\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /^add\s*1px\s*(?:to\s*)?(?:border|border\s*width)$/i,
        /^remove\s*1px\s*(?:from\s*)?(?:border|border\s*width)$/i,
        /^(?:set|make|change)\s*(?:the\s*)?border\s*(?:width\s*)?(?:to\s*)?(small|medium|large)$/i,
      ],
      border: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /^add\s*(?:a)?\s*border$/i,
        /^remove\s*(?:the)?\s*border$/i,
      ],
      borderRadius: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*radius\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /(?:make|set)?\s*(?:the)?\s*corners?\s*rounded(?:\s*to\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh)))?/i,
        /round(?:ed)?\s*(?:corners?)?\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))?/i,
        /^add\s*1px\s*(?:to\s*)?(?:border\s*)?radius$/i,
        /^remove\s*1px\s*(?:from\s*)?(?:border\s*)?radius$/i,
        /^(?:set|make|change)\s*(?:the\s*)?(?:border\s*)?radius\s*(?:to\s*)?(small|medium|large)$/i,
      ],
      borderStyle: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*style\s*(?:to|=|:)?\s*(solid|dashed|dotted|double|groove|ridge|inset|outset)/i,
      ],
      borderColor: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:set|make|change)?\s*(?:the)?\s*border\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:color|make|set)\s*(?:the)?\s*border\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /border\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:set|make|change|use|pick|choose|select|add)\s*(?:a|the)?\s*(?:custom|different|specific|new|another)\s*(?:border\s*)?color/i,
        /(?:i\s*want\s*|i\s*need\s*|i\s*would\s*like\s*)(?:a|the)?\s*(?:custom|different|specific|new|another)\s*(?:border\s*)?color/i,
      ],
    };
  }

  static getPropertyNames() {
    return {
      borderWidth: "border width",
      borderRadius: "border radius",
      borderStyle: "border style",
      borderColor: "border color",
    };
  }

  static getPresets() {
    return {
      borderWidth: {
        small: "1px",
        medium: "2px",
        large: "4px",
      },
      borderRadius: {
        small: "4px",
        medium: "8px",
        large: "16px",
      },
    };
  }

  static getMetadata() {
    return {
      id: "BorderProcessor",
      name: "Border Processor",
      priority: 80,
      contextTypes: ["ALL"],
      patterns: [
        {
          pattern: /border\s*(width|style|color|radius)?/i,
          type: "STYLE",
          priority: 80,
          examples: [
            "add border",
            "set border width to 2px",
            "add 1px to radius",
          ],
        },
        {
          pattern: /^add\s*1px\s*(?:to\s*)?(?:border|radius)$/i,
          type: "STYLE",
          priority: 100,
          examples: ["add 1px to border", "add 1px to radius"],
        },
        {
          pattern: /^remove\s*1px\s*(?:from\s*)?(?:border|radius)$/i,
          type: "STYLE",
          priority: 100,
          examples: ["remove 1px from border", "remove 1px from radius"],
        },
      ],
    };
  }

  static processCommand(input, currentStyle = {}) {
    const presets = this.getPresets();
    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    // Extract current border values - Fix parsing logic
    let currentBorderWidth = 0;
    let currentBorderRadius = 0;

    if (currentStyle?.borderWidth) {
      const borderWidths = currentStyle.borderWidth.split(" ");
      currentBorderWidth = parseInt(borderWidths[0]) || 0;
    } else if (currentStyle?.style?.borderWidth) {
      const borderWidths = currentStyle.style.borderWidth.split(" ");
      currentBorderWidth = parseInt(borderWidths[0]) || 0;
    }

    if (currentStyle?.borderRadius) {
      const borderRadii = currentStyle.borderRadius.split(" ");
      currentBorderRadius = parseInt(borderRadii[0]) || 0;
    } else if (currentStyle?.style?.borderRadius) {
      const borderRadii = currentStyle.style.borderRadius.split(" ");
      currentBorderRadius = parseInt(borderRadii[0]) || 0;
    }

    const currentBorderStyle =
      currentStyle?.borderStyle || currentStyle?.style?.borderStyle || "solid";
    const currentBorderColor =
      currentStyle?.borderColor || currentStyle?.style?.borderColor || "black";

    console.log("Current border values:", {
      width: currentBorderWidth,
      radius: currentBorderRadius,
      style: currentBorderStyle,
      color: currentBorderColor,
      rawStyle: currentStyle,
    });

    // Check for custom color request first
    if (
      input.includes("custom") ||
      /(?:set|make|change|use|pick|choose|select|add|want|need|like)\s*(?:a|the)?\s*(?:custom|different|specific|new|another)\s*(?:border\s*)?color/i.test(
        input
      )
    ) {
      return {
        type: "PROMPT",
        message: "Enter your custom border color:",
        options: [
          {
            text: "Color formats accepted:",
            type: "info",
          },
          {
            text: "• Color names (e.g., blue, red, green)",
            type: "info",
          },
          {
            text: "• Hex codes (e.g., #FF0000, #00FF00)",
            type: "info",
          },
          {
            text: "• RGB values (e.g., rgb(255, 0, 0))",
            type: "info",
          },
          {
            text: "• RGBA values (e.g., rgba(255, 0, 0, 0.5))",
            type: "info",
          },
        ],
        property: "borderColor",
        followUp: {
          type: "COLOR_CHANGE",
          command: (color) => `set border color to ${color}`,
        },
      };
    }

    // Check if this is a direct color value (followUp from PROMPT)
    const directColorPattern =
      /^([a-z]+|#[0-9a-f]{3,6}|rgb\(\d+,\s*\d+,\s*\d+\))$/i;
    if (directColorPattern.test(input)) {
      return {
        style: {
          borderColor: input.toLowerCase(),
        },
      };
    }

    // Handle basic add/remove border commands
    const addBorderMatch = input.match(/^add\s*(?:a)?\s*border$/i);
    if (addBorderMatch) {
      return {
        style: {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "black",
        },
      };
    }

    const removeBorderMatch = input.match(/^remove\s*(?:the)?\s*border$/i);
    if (removeBorderMatch) {
      return {
        style: {
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
        },
      };
    }

    // Handle rounded corners without specific value
    const roundedCornersMatch = input.match(
      /(?:make|set)?\s*(?:the)?\s*corners?\s*rounded/i
    );
    if (roundedCornersMatch) {
      return {
        style: {
          borderRadius: "8px", // Default rounded corner value
        },
      };
    }

    const increasePattern =
      /increase\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|higher|bigger)?/i;
    const decreasePattern =
      /decrease\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|lower|smaller)?/i;

    if (input.match(increasePattern)) {
      const currentRadius = parseInt(currentStyle.borderRadius) || 0;
      const increment =
        input.includes("little") ||
        input.includes("bit") ||
        input.includes("tad")
          ? 5
          : 10;
      return {
        style: {
          borderRadius: `${currentRadius + increment}px`,
        },
      };
    }

    if (input.match(decreasePattern)) {
      const currentRadius = parseInt(currentStyle.borderRadius) || 0;
      const decrement =
        input.includes("little") ||
        input.includes("bit") ||
        input.includes("tad")
          ? 5
          : 10;
      return {
        style: {
          borderRadius: `${Math.max(0, currentRadius - decrement)}px`,
        },
      };
    }

    // Handle increment/decrement patterns
    if (input.match(/^add\s*1px\s*(?:to\s*)?border$/i)) {
      console.log("Adding 1px to border width:", currentBorderWidth);
      const newWidth = currentBorderWidth + 1;
      console.log("New border width will be:", newWidth);

      return {
        style: {
          borderWidth: `${newWidth}px`,
          borderStyle: currentBorderStyle,
          borderColor: currentBorderColor,
        },
      };
    }

    if (input.match(/^remove\s*1px\s*(?:from\s*)?border$/i)) {
      const newWidth = Math.max(0, currentBorderWidth - 1);
      console.log(
        "Removing 1px from border width:",
        currentBorderWidth,
        "->",
        newWidth
      );

      return {
        style: {
          borderWidth: `${newWidth}px`,
          borderStyle: currentBorderStyle,
          borderColor: currentBorderColor,
        },
      };
    }

    // Handle radius increment/decrement with pattern matching
    const radiusAddMatch = input.match(
      /^add\s*1px\s*(?:to\s*)?(?:border\s*)?radius$/i
    );
    if (radiusAddMatch) {
      console.log("Adding 1px to border radius:", currentBorderRadius);
      const newRadius = currentBorderRadius + 1;
      console.log("New border radius will be:", newRadius);

      return {
        style: {
          borderRadius: `${newRadius}px`,
        },
        message: `Updated border radius to ${newRadius}px`,
        property: "borderRadius",
      };
    }

    const radiusRemoveMatch = input.match(
      /^remove\s*1px\s*(?:from\s*)?(?:border\s*)?radius$/i
    );
    if (radiusRemoveMatch) {
      const newRadius = Math.max(0, currentBorderRadius - 1);
      console.log(
        "Removing 1px from border radius:",
        currentBorderRadius,
        "->",
        newRadius
      );

      return {
        style: {
          borderRadius: `${newRadius}px`,
        },
        message: `Updated border radius to ${newRadius}px`,
        property: "borderRadius",
      };
    }

    // Handle presets
    const presetMatch = input.match(
      /^(?:set|make|change)\s*(?:the\s*)?(?:border\s*)?(?:width|radius)?\s*(?:to\s*)?(small|medium|large)$/i
    );
    if (presetMatch) {
      console.log("Matched preset pattern:", presetMatch[0]);
      console.log("Current border properties:", {
        width: currentBorderWidth,
        style: currentBorderStyle,
        color: currentBorderColor,
        radius: currentBorderRadius
      });

      const size = presetMatch[1].toLowerCase();
      if (input.includes('radius')) {
        console.log("Applying radius preset:", presets.borderRadius[size]);
        return {
          style: {
            borderRadius: presets.borderRadius[size]
          },
          message: `Set border radius to ${size} (${presets.borderRadius[size]})`,
          property: 'borderRadius'
        };
      } else {
        console.log("Applying width preset:", presets.borderWidth[size]);
        console.log("Preserving existing border properties:", {
          style: currentBorderStyle,
          color: currentBorderColor
        });
        
        return {
          style: {
            borderWidth: presets.borderWidth[size],
            borderStyle: currentBorderStyle || 'solid',
            borderColor: currentBorderColor || 'black'
          },
          message: `Set border width to ${size} (${presets.borderWidth[size]})`,
          property: 'borderWidth'
        };
      }
    }

    // Process specific color commands
    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);

        if (match && !matchFound) {
          matchFound = true;
          const value = match[1]?.toLowerCase();

          if (value) {
            // Don't process if the value is 'custom'
            if (value === "custom") continue;

            // Validate color using ColorProcessor
            const colorResult = ColorProcessor.processCommand(
              `set color to ${value}`
            );
            if (colorResult && colorResult.style.color) {
              result = {
                style: {
                  [property]: colorResult.style.color,
                },
              };
            }
          }
        }
      }
    }

    return result;
  }

  static getSuggestions(headerClass, buttonClass) {
    return {
      text: "Border",
      type: "category",
      icon: FaBorderStyle,
      options: [
        {
          text: "Border Width",
          type: "info",
          icon: FaBorderStyle,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-col gap-1",
          options: [
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "small",
                  command: "set border width to small",
                  type: "command",
                  icon: FaBorderStyle,
                  className: buttonClass,
                },
                {
                  text: "medium",
                  command: "set border width to medium",
                  type: "command",
                  icon: FaBorderStyle,
                  className: buttonClass,
                },
                {
                  text: "large",
                  command: "set border width to large",
                  type: "command",
                  icon: FaBorderStyle,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "add 1px",
                  command: "add 1px to border",
                  type: "command",
                  icon: FaPlus,
                  className: buttonClass,
                },
                {
                  text: "remove 1px",
                  command: "remove 1px from border",
                  type: "command",
                  icon: FaTimes,
                  className: buttonClass,
                },
                {
                  text: "remove border",
                  command: "remove border",
                  type: "command",
                  icon: FaTimes,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
        {
          text: "Border Radius",
          type: "info",
          icon: FaBorderStyle,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-col gap-1",
          options: [
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "small",
                  command: "set border radius to small",
                  type: "command",
                  icon: FaBorderStyle,
                  className: buttonClass,
                },
                {
                  text: "medium",
                  command: "set border radius to medium",
                  type: "command",
                  icon: FaBorderStyle,
                  className: buttonClass,
                },
                {
                  text: "large",
                  command: "set border radius to large",
                  type: "command",
                  icon: FaBorderStyle,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "add 1px",
                  command: "add 1px to radius",
                  type: "command",
                  icon: FaPlus,
                  className: buttonClass,
                },
                {
                  text: "remove 1px",
                  command: "remove 1px from radius",
                  type: "command",
                  icon: FaTimes,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
        {
          text: "Border Color",
          type: "info",
          icon: FaPalette,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-col gap-1",
          options: [
            {
              type: "wrapper",
              className: "flex flex-wrap gap-1",
              options: (state) => {
                const colorTheme = state?.colorTheme || [];

                // Create array of theme colors
                const themeButtons =
                  colorTheme.length === 0
                    ? [
                        {
                          text: "black",
                          command: "set border color to black",
                          type: "command",
                          icon: FaPalette,
                          className: buttonClass,
                          style: {
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            minWidth: "60px",
                            textAlign: "center",
                          },
                        },
                        {
                          text: "gray",
                          command: "set border color to gray",
                          type: "command",
                          icon: FaPalette,
                          className: buttonClass,
                          style: {
                            backgroundColor: "#808080",
                            color: "#ffffff",
                            minWidth: "60px",
                            textAlign: "center",
                          },
                        },
                        {
                          text: "blue",
                          command: "set border color to blue",
                          type: "command",
                          icon: FaPalette,
                          className: buttonClass,
                          style: {
                            backgroundColor: "#0000ff",
                            color: "#ffffff",
                            minWidth: "60px",
                            textAlign: "center",
                          },
                        },
                      ]
                    : colorTheme.map((color) => ({
                        text: color.name,
                        command: `set border color to ${color.value}`,
                        type: "command",
                        icon: FaPalette,
                        className: `${buttonClass} relative`,
                        style: {
                          backgroundColor: color.value,
                          color: isLightColor(color.value)
                            ? "#000000"
                            : "#ffffff",
                          minWidth: "60px",
                          textAlign: "center",
                        },
                      }));

                // Add custom color button
                return [
                  ...themeButtons,
                  {
                    text: "custom",
                    command: "set border color to custom",
                    type: "command",
                    icon: FaPalette,
                    className: buttonClass,
                    style: {
                      minWidth: "60px",
                      textAlign: "center",
                    },
                  },
                ];
              },
            },
          ],
        },
      ],
    };
  }
}
