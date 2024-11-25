export class SizeProcessor {
  static getStylePatterns() {
    const units = '(?:px|em|rem|%|vw|vh)';
    const number = '\\d+(?:\\.\\d+)?';
    
    return {
      width: [
        // Basic patterns
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*width\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
        // Percentage shortcuts
        /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to|=|:)?\s*(25|50|75|100)\s*(?:percent|%)/i,
        // Fit content
        /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to|=|:)?\s*fit\s*content/i,
      ],
      height: [
        // Basic patterns
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
        // Percentage shortcuts
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*(25|50|75|100)\s*(?:percent|%)/i,
        // Fit content
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*fit\s*content/i,
      ],
      // Min/Max patterns
      minWidth: [
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*min(?:imum)?\\s*width\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
      ],
      maxWidth: [
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*max(?:imum)?\\s*width\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
      ],
      minHeight: [
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*min(?:imum)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
      ],
      maxHeight: [
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*max(?:imum)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
      ]
    };
  }

  static getPropertyNames() {
    return {
      width: 'width',
      height: 'height',
      minWidth: 'minimum width',
      maxWidth: 'maximum width',
      minHeight: 'minimum height',
      maxHeight: 'maximum height'
    };
  }

  static processCommand(input) {
    console.log('SizeProcessor received input:', input);

    const stylePatterns = this.getStylePatterns();
    let result = null;

    // Process each property pattern
    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        
        if (match) {
          let value = match[1]?.toLowerCase();

          // Handle percentage shortcuts
          if (['25', '50', '75', '100'].includes(value)) {
            value = `${value}%`;
          }

          // Handle fit-content
          if (input.includes('fit content')) {
            value = 'fit-content';
          }

          console.log(`Matched pattern for ${property}:`, value);
          return {
            style: {
              [property]: value
            }
          };
        }
      }
    }

    console.log('SizeProcessor result:', result);
    return result;
  }
} 