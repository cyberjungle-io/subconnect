export class SvgProcessor {
  static svgPatterns = [
    /(?:change|set|make)\s+(?:the\s+)?svg\s+(?:fill\s+)?color\s+(?:to\s+)?([a-zA-Z]+|#[0-9a-fA-F]{6})/i,
    /(?:change|set|make)\s+(?:the\s+)?svg\s+(?:stroke|outline|border)\s+(?:color\s+)?(?:to\s+)?([a-zA-Z]+|#[0-9a-fA-F]{6})/i,
    /(?:rotate|turn)\s+(?:the\s+)?svg\s+(?:by\s+)?(-?\d+)\s*(?:deg(?:rees)?)?/i,
    /(?:scale|resize)\s+(?:the\s+)?svg\s+(?:to\s+)?(\d*\.?\d+)/i,
    /(?:set|change|make)\s+(?:the\s+)?svg\s+(?:size|width|height)\s+(?:to\s+)?(\d+)(?:px)?/i
  ];

  static isSvgCommand(input) {
    return this.svgPatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static getSuggestions() {
    return [
      {
        text: "SVG Colors",
        type: "category",
        options: [
          { text: "change svg color to blue", type: "command" },
          { text: "set svg stroke color to red", type: "command" },
          { text: "make svg color #FF5500", type: "command" }
        ]
      },
      {
        text: "SVG Transform",
        type: "category",
        options: [
          { text: "rotate svg 45 degrees", type: "command" },
          { text: "scale svg to 1.5", type: "command" },
          { text: "set svg size to 100px", type: "command" }
        ]
      }
    ];
  }

  static processCommand(input, currentProps = {}) {
    const lowercaseInput = input.toLowerCase();

    // Handle fill color
    const fillMatch = lowercaseInput.match(/(?:change|set|make)\s+(?:the\s+)?svg\s+(?:fill\s+)?color\s+(?:to\s+)?([a-zA-Z]+|#[0-9a-fA-F]{6})/i);
    if (fillMatch) {
      const color = fillMatch[1];
      return {
        props: { 
          ...currentProps,
          isSvg: true,
          style: { ...currentProps.style, fill: color }
        },
        message: `Changed SVG fill color to ${color}`
      };
    }

    // Handle stroke color
    const strokeMatch = lowercaseInput.match(/(?:change|set|make)\s+(?:the\s+)?svg\s+(?:stroke|outline|border)\s+(?:color\s+)?(?:to\s+)?([a-zA-Z]+|#[0-9a-fA-F]{6})/i);
    if (strokeMatch) {
      const color = strokeMatch[1];
      return {
        props: {
          ...currentProps,
          isSvg: true,
          style: { ...currentProps.style, stroke: color }
        },
        message: `Changed SVG stroke color to ${color}`
      };
    }

    // Handle rotation
    const rotateMatch = lowercaseInput.match(/(?:rotate|turn)\s+(?:the\s+)?svg\s+(?:by\s+)?(-?\d+)\s*(?:deg(?:rees)?)?/i);
    if (rotateMatch) {
      const rotation = parseInt(rotateMatch[1]);
      return {
        props: {
          ...currentProps,
          isSvg: true,
          style: { ...currentProps.style, rotation }
        },
        message: `Rotated SVG by ${rotation} degrees`
      };
    }

    // Handle scaling
    const scaleMatch = lowercaseInput.match(/(?:scale|resize)\s+(?:the\s+)?svg\s+(?:to\s+)?(\d*\.?\d+)/i);
    if (scaleMatch) {
      const scale = parseFloat(scaleMatch[1]);
      return {
        props: {
          ...currentProps,
          isSvg: true,
          style: { ...currentProps.style, scale }
        },
        message: `Scaled SVG to ${scale}x`
      };
    }

    // Handle size
    const sizeMatch = lowercaseInput.match(/(?:set|change|make)\s+(?:the\s+)?svg\s+(?:size|width|height)\s+(?:to\s+)?(\d+)(?:px)?/i);
    if (sizeMatch) {
      const size = parseInt(sizeMatch[1]);
      return {
        props: {
          ...currentProps,
          isSvg: true,
          style: { ...currentProps.style, width: `${size}px`, height: `${size}px` }
        },
        message: `Set SVG size to ${size}px`
      };
    }

    return null;
  }
} 