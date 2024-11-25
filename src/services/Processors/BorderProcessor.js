export class BorderProcessor {
  static getStylePatterns() {
    return {
      borderWidth: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*(?:width)?\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /border\s*width\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
      ],
      border: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
      ],
      borderRadius: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*radius\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /round(?:ed)?\s*(?:corners?)?\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
      ],
      borderStyle: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*style\s*(?:to|=|:)?\s*(solid|dashed|dotted|double|groove|ridge|inset|outset)/i,
      ],
      borderColor: [
        /(?:set|make|change)?\s*(?:the)?\s*border\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
      ]
    };
  }

  static getPropertyNames() {
    return {
      border: 'border width',
      borderWidth: 'border width',
      borderRadius: 'border radius',
      borderStyle: 'border style',
      borderColor: 'border color'
    };
  }

  static processCommand(input) {
    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        
        if (match && !matchFound) {
          matchFound = true;
          const value = match[1].toLowerCase();
          
          // Special handling for the generic "border" command
          if (property === 'border') {
            result = {
              style: {
                borderWidth: value,
                borderStyle: 'solid' // Set a default style when just "border" is specified
              }
            };
          } else {
            result = {
              style: {
                [property]: value
              }
            };
          }
        }
      }
    }

    return result;
  }
} 