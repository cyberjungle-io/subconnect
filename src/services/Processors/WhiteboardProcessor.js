export class WhiteboardProcessor {
  static getStylePatterns() {
    return {
      strokeColor: [
        /(?:change|set|make)\s+(?:the\s+)?(?:stroke|pen|drawing)\s+(?:color\s+)?(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
      ]
    };
  }

  static getPropertyNames() {
    return {
      strokeColor: 'stroke color'
    };
  }

  static getSuggestions() {
    return [
      {
        text: "Drawing Settings",
        type: "category",
        options: [
          { text: "change stroke color to black", type: "command" },
          { text: "set stroke color to #FF0000", type: "command" },
          { text: "make stroke color blue", type: "command" }
        ]
      },
      {
        text: "Size and Layout",
        type: "category",
        options: [
          { text: "make it bigger", type: "command" },
          { text: "set width to 800px", type: "command" },
          { text: "change height to 600px", type: "command" }
        ]
      },
      {
        text: "Appearance",
        type: "category",
        options: [
          { text: "change background color to white", type: "command" },
          { text: "make corners rounded", type: "command" },
          { text: "add border", type: "command" }
        ]
      }
    ];
  }

  static processCommand(input, currentProps = {}) {
    const lowercaseInput = input.toLowerCase();

    // Stroke color
    const strokeColorMatch = lowercaseInput.match(/(?:change|set|make)\s+(?:the\s+)?(?:stroke|pen|drawing)\s+(?:color\s+)?(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i);
    if (strokeColorMatch) {
      const color = strokeColorMatch[1];
      return {
        props: {
          ...currentProps,
          strokeColor: color
        },
        whiteboardState: {
          strokeColor: color
        },
        message: `Updated stroke color to ${color}`
      };
    }

    // Let other processors handle generic styling
    return null;
  }
} 