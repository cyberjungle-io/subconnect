import { BorderProcessor } from './Processors/BorderProcessor';

export class StyleCommandProcessor {
  static getStylePatterns() {
    return {
      backgroundColor: [
        /background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
      ],
      width: [
        /width\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
      ],
      height: [
        /height\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh))/i,
      ]
    };
  }

  static getPropertyNames() {
    return {
      backgroundColor: 'background color',
      width: 'width',
      height: 'height',
      ...BorderProcessor.getPropertyNames()
    };
  }

  static processStyleCommand(input, component) {
    console.log('Processing style command:', input);

    // First try border processor
    const borderResult = BorderProcessor.processCommand(input);
    if (borderResult) {
      return borderResult;
    }

    // If no border match, continue with other style patterns
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