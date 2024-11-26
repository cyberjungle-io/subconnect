export class SpacingProcessor {
  static getStylePatterns() {
    return {
      padding: [
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)(?:\s+(?:all|around))?/i,
        /padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding\s*(?:on\s+)?(?:the\s+)?(top|bottom|left|right)\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*(top|bottom|left|right)\s*padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:all)?\s*(?:the)?\s*padding/i,
        /(?:make|set)\s*(?:the)?\s*padding\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*padding/i
      ],
      margin: [
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)(?:\s+(?:all|around))?/i,
        /margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin\s*(?:on\s+)?(?:the\s+)?(top|bottom|left|right)\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*(top|bottom|left|right)\s*margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:all)?\s*(?:the)?\s*margin/i,
        /(?:make|set)\s*(?:the)?\s*margin\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*margin/i
      ],
      gap: [
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*gap\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /gap\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*gap(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:the)?\s*gap/i,
        /(?:make|set)\s*(?:the)?\s*gap\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*gap/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      padding: 'padding',
      margin: 'margin',
      gap: 'gap'
    };
  }

  static processCommand(input) {
    console.log('SpacingProcessor received input:', input);
    
    // Handle removal commands first
    if (input.match(/remove\s*(?:all)?\s*(?:the)?\s*padding/i) || input.match(/no\s*padding/i)) {
      return { style: { padding: '0px' } };
    }
    if (input.match(/remove\s*(?:all)?\s*(?:the)?\s*margin/i) || input.match(/no\s*margin/i)) {
      return { style: { margin: '0px' } };
    }
    if (input.match(/remove\s*(?:the)?\s*gap/i) || input.match(/no\s*gap/i)) {
      return { style: { gap: '0px' } };
    }

    // Handle preset sizes
    const presetSizes = {
      small: '8px',
      medium: '16px',
      large: '24px'
    };

    for (const [property, patterns] of Object.entries(this.getStylePatterns())) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        
        if (match) {
          let value = match[1]?.toLowerCase();
          
          // Handle preset sizes
          if (value in presetSizes) {
            return {
              style: {
                [property]: presetSizes[value]
              }
            };
          }

          // Add 'px' if no unit is specified
          if (!value.match(/\d+(?:px|em|rem|%|vw|vh)?$/)) {
            value += 'px';
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

    console.log('SpacingProcessor result:', null);
    return null;
  }
} 