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
        /increase\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|higher|bigger)?/i,
        /decrease\s*(?:the)?\s*(?:border)?\s*radius(?:\s*a\s*(?:little|bit|tad))?\s*(?:more|lower|smaller)?/i,
        /make\s*(?:the)?\s*(?:border)?\s*radius\s*(?:a\s*(?:little|bit|tad))?\s*(?:bigger|larger|higher|smaller|lower)/i
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

  static processCommand(input, currentStyle = {}) {
    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

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

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        
        if (match && !matchFound) {
          matchFound = true;
          const value = match[1]?.toLowerCase();
          
          if (value) {
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