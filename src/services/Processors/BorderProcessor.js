import { ColorProcessor } from './ColorProcessor';

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
        /increase\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|higher|bigger)?/i,
        /decrease\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|lower|smaller)?/i,
        /make\s*(?:the)?\s*(?:border)?\s*radius\s*(?:a\s*(?:little|bit|tad))?\s*(?:bigger|larger|higher|smaller|lower)/i,
        /^(?:set|make|change)\s*(?:the\s*)?(?:border\s*)?radius\s*(?:to\s*)?(small|medium|large)$/i,
        /^add\s*1px\s*(?:to\s*)?(?:border\s*)?radius$/i,
        /^remove\s*1px\s*(?:from\s*)?(?:border\s*)?radius$/i,
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
        /(?:i\s*want\s*|i\s*need\s*|i\s*would\s*like\s*)(?:a|the)?\s*(?:custom|different|specific|new|another)\s*(?:border\s*)?color/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      borderWidth: 'border width',
      borderRadius: 'border radius',
      borderStyle: 'border style',
      borderColor: 'border color'
    };
  }

  static getPresets() {
    return {
      borderWidth: {
        small: '1px',
        medium: '2px',
        large: '4px'
      },
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '16px'
      }
    };
  }

  static processCommand(input, currentStyle = {}) {
    const presets = this.getPresets();
    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    // Check for custom color request first
    if (input.includes('custom') || 
        /(?:set|make|change|use|pick|choose|select|add|want|need|like)\s*(?:a|the)?\s*(?:custom|different|specific|new|another)\s*(?:border\s*)?color/i.test(input)) {
      return {
        type: 'PROMPT',
        message: 'Enter your custom border color:',
        options: [
          {
            text: 'Color formats accepted:',
            type: 'info'
          },
          {
            text: '• Color names (e.g., blue, red, green)',
            type: 'info'
          },
          {
            text: '• Hex codes (e.g., #FF0000, #00FF00)',
            type: 'info'
          },
          {
            text: '• RGB values (e.g., rgb(255, 0, 0))',
            type: 'info'
          },
          {
            text: '• RGBA values (e.g., rgba(255, 0, 0, 0.5))',
            type: 'info'
          }
        ],
        property: 'borderColor',
        followUp: {
          type: 'COLOR_CHANGE',
          command: (color) => `set border color to ${color}`
        }
      };
    }

    // Check if this is a direct color value (followUp from PROMPT)
    const directColorPattern = /^([a-z]+|#[0-9a-f]{3,6}|rgb\(\d+,\s*\d+,\s*\d+\))$/i;
    if (directColorPattern.test(input)) {
      return {
        style: {
          borderColor: input.toLowerCase()
        }
      };
    }

    // Handle basic add/remove border commands
    const addBorderMatch = input.match(/^add\s*(?:a)?\s*border$/i);
    if (addBorderMatch) {
      return {
        style: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'black'
        }
      };
    }

    const removeBorderMatch = input.match(/^remove\s*(?:the)?\s*border$/i);
    if (removeBorderMatch) {
      return {
        style: {
          borderWidth: '0px',
          borderStyle: 'none',
          borderColor: 'transparent'
        }
      };
    }

    // Handle rounded corners without specific value
    const roundedCornersMatch = input.match(/(?:make|set)?\s*(?:the)?\s*corners?\s*rounded/i);
    if (roundedCornersMatch) {
      return {
        style: {
          borderRadius: '8px'  // Default rounded corner value
        }
      };
    }

    const increasePattern = /increase\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|higher|bigger)?/i;
    const decreasePattern = /decrease\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|lower|smaller)?/i;

    if (input.match(increasePattern)) {
      const currentRadius = parseInt(currentStyle.borderRadius) || 0;
      const increment = input.includes('little') || input.includes('bit') || input.includes('tad') ? 5 : 10;
      return {
        style: {
          borderRadius: `${currentRadius + increment}px`
        }
      };
    }

    if (input.match(decreasePattern)) {
      const currentRadius = parseInt(currentStyle.borderRadius) || 0;
      const decrement = input.includes('little') || input.includes('bit') || input.includes('tad') ? 5 : 10;
      return {
        style: {
          borderRadius: `${Math.max(0, currentRadius - decrement)}px`
        }
      };
    }

    // Handle increment/decrement patterns
    if (input.match(/^add\s*1px\s*(?:to\s*)?border$/i)) {
      const currentWidth = parseInt(currentStyle.borderWidth) || 0;
      return {
        style: {
          borderWidth: `${currentWidth + 1}px`,
          borderStyle: currentStyle.borderStyle || 'solid',
          borderColor: currentStyle.borderColor || 'black'
        }
      };
    }

    if (input.match(/^remove\s*1px\s*(?:from\s*)?border$/i)) {
      const currentWidth = parseInt(currentStyle.borderWidth) || 0;
      return {
        style: {
          borderWidth: `${Math.max(0, currentWidth - 1)}px`,
          borderStyle: currentStyle.borderStyle || 'solid',
          borderColor: currentStyle.borderColor || 'black'
        }
      };
    }

    // Handle radius increment/decrement
    if (input.match(/^add\s*1px\s*(?:to\s*)?radius$/i)) {
      const currentRadius = parseInt(currentStyle.borderRadius) || 0;
      return {
        style: {
          borderRadius: `${currentRadius + 1}px`
        }
      };
    }

    if (input.match(/^remove\s*1px\s*(?:from\s*)?radius$/i)) {
      const currentRadius = parseInt(currentStyle.borderRadius) || 0;
      return {
        style: {
          borderRadius: `${Math.max(0, currentRadius - 1)}px`
        }
      };
    }

    // Handle presets
    const presetMatch = input.match(/^(?:set|make|change)\s*(?:the\s*)?(?:border\s*)?(?:width|radius)?\s*(?:to\s*)?(small|medium|large)$/i);
    if (presetMatch) {
      const size = presetMatch[1].toLowerCase();
      if (input.includes('radius')) {
        return {
          style: {
            borderRadius: presets.borderRadius[size]
          }
        };
      } else {
        return {
          style: {
            borderWidth: presets.borderWidth[size],
            borderStyle: 'solid',
            borderColor: currentStyle.borderColor || 'black'
          }
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
            if (value === 'custom') continue;
            
            // Validate color using ColorProcessor
            const colorResult = ColorProcessor.processCommand(`set color to ${value}`);
            if (colorResult && colorResult.style.color) {
              result = {
                style: {
                  [property]: colorResult.style.color
                }
              };
            }
          }
        }
      }
    }

    return result;
  }
} 