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
        // Auto size
        /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to)?\s*auto/i,
        /automatic\s*width/i
      ],
      height: [
        // Basic patterns
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
        // Percentage shortcuts
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*(25|50|75|100)\s*(?:percent|%)/i,
        // Fit content
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*fit\s*content/i,
        // Auto size
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to)?\s*auto/i,
        /automatic\s*height/i
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
      ],
      // Combined width and height patterns for presets
      presets: [
        /(?:make|create|set)?\s*(?:it|this)?\s*(?:a)?\s*square/i,
        /(?:make|create|set)?\s*(?:it|this)?\s*(?:a)?\s*banner/i
      ],
      // Fit options
      fit: [
        /fit\s*(?:to)?\s*vertical(?:ly)?/i,
        /fit\s*(?:to)?\s*horizontal(?:ly)?/i,
        /fit\s*(?:to)?\s*content/i
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

    // Check for presets first
    if (input.match(stylePatterns.presets[0])) { // Square
      return {
        style: {
          width: '200px',
          height: '200px'
        }
      };
    }

    if (input.match(stylePatterns.presets[1])) { // Banner
      return {
        style: {
          width: '100%',
          height: '150px'
        }
      };
    }

    // Check for fit options
    for (const pattern of stylePatterns.fit) {
      const match = input.match(pattern);
      if (match) {
        if (input.includes('vertical')) {
          return {
            style: {
              height: 'fit-content'
            }
          };
        }
        if (input.includes('horizontal')) {
          return {
            style: {
              width: 'fit-content'
            }
          };
        }
        if (input.includes('content')) {
          return {
            style: {
              width: 'fit-content',
              height: 'fit-content'
            }
          };
        }
      }
    }

    // Process regular size patterns
    for (const [property, patterns] of Object.entries(stylePatterns)) {
      if (property !== 'presets' && property !== 'fit') {
        for (const pattern of patterns) {
          const match = input.match(pattern);
          
          if (match) {
            let value = match[1]?.toLowerCase();

            // Handle auto
            if (input.includes('auto')) {
              value = 'auto';
            }

            // Handle percentage shortcuts
            if (['25', '50', '75', '100'].includes(value)) {
              value = `${value}%`;
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
    }

    return null;
  }
} 