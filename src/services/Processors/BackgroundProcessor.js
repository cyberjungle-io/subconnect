export class BackgroundProcessor {
  static getStylePatterns() {
    return {
      backgroundColor: [
        /(?:set|make|change)?\s*(?:the)?\s*background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /(?:make|set)?\s*(?:the)?\s*background\s*transparent/i,
        /remove\s*(?:the)?\s*background\s*color/i
      ],
      backgroundImage: [
        /(?:set|make|change)?\s*(?:the)?\s*background\s*image\s*(?:to|=|:)?\s*(url\([^)]+\))/i,
        /remove\s*(?:the)?\s*background\s*image/i,
        /clear\s*(?:the)?\s*background\s*image/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      backgroundColor: 'background color',
      backgroundImage: 'background image'
    };
  }

  static processCommand(input) {
    console.log('BackgroundProcessor received input:', input);
    
    // Handle special case for removing/transparent background color FIRST
    if (input.match(/remove\s*(?:the)?\s*background\s*color/i) || 
        input.match(/(?:make|set)?\s*(?:the)?\s*background\s*transparent/i)) {
      console.log('Matched remove background color pattern');
      return {
        style: {
          backgroundColor: 'transparent'
        }
      };
    }

    // Handle special case for removing background image
    if (input.match(/remove\s*(?:the)?\s*background\s*image/i) || 
        input.match(/clear\s*(?:the)?\s*background\s*image/i)) {
      console.log('Matched remove background image pattern');
      return {
        style: {
          backgroundImage: ''
        }
      };
    }

    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        
        if (match && !matchFound) {
          matchFound = true;
          const value = match[1]?.toLowerCase();
          
          // Skip if this is a removal command (handled above)
          if (pattern.toString().includes('remove')) continue;
          
          console.log(`Matched pattern for ${property}:`, value);
          result = {
            style: {
              [property]: value
            }
          };
        }
      }
    }

    console.log('BackgroundProcessor result:', result);
    return result;
  }
} 