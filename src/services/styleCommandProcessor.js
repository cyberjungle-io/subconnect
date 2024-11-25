export class StyleCommandProcessor {
  static getStylePatterns() {
    return {
      backgroundColor: [
        /background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
      ],
      borderRadius: [
        /border\s*radius\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /round(?:ed)?\s*(?:corners?)?\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
      ],
      borderWidth: [
        /border\s*width\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
        /(?:make|set)\s*(?:the)?\s*border\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))\s*(?:thick|wide|width)?/i,
      ],
      borderStyle: [
        /border\s*style\s*(?:to|=|:)?\s*(solid|dashed|dotted|double|groove|ridge|inset|outset)/i,
        /(?:make|set)\s*(?:the)?\s*border\s*(?:to|=|:)?\s*(solid|dashed|dotted|double|groove|ridge|inset|outset)/i,
      ],
      borderColor: [
        /border\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
      ]
    };
  }

  static getPropertyNames() {
    return {
      backgroundColor: 'background color',
      borderRadius: 'border radius',
      width: 'width',
      height: 'height',
      borderWidth: 'border width',
      borderStyle: 'border style',
      borderColor: 'border color'
    };
  }

  static processStyleCommand(input, component) {
    console.log('Processing style command:', input);

    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      console.log(`Testing property: ${property}`);
      
      for (const pattern of patterns) {
        console.log(`  Testing pattern: ${pattern}`);
        const match = input.match(pattern);
        console.log(`  Match result:`, match);
        
        if (match && !matchFound) {
          matchFound = true;
          const value = match[1].toLowerCase();
          console.log(`  Found match for ${property}: ${value}`);
          
          result = {
            style: {
              [property]: value
            }
          };
        }
      }
    }

    console.log('Final result:', result);
    return result;
  }
} 