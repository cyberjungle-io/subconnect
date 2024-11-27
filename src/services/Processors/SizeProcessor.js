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
        /automatic\s*height/i,
        
        // New patterns for relative changes
        new RegExp(`(?:increase|add|increment|raise)\\s*(?:the)?\\s*height\\s*(?:by)?\\s*(${number})\\s*${units}`, 'i'),
        new RegExp(`(?:decrease|subtract|reduce|lower)\\s*(?:the)?\\s*height\\s*(?:by)?\\s*(${number})\\s*${units}`, 'i'),
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

  static processCommand(input, currentStyle = {}) {
    console.log('SizeProcessor received input:', input);
    console.log('Current style:', currentStyle);
    const stylePatterns = this.getStylePatterns();

    // Process height patterns specifically for relative changes first
    const relativeHeightPattern = new RegExp(`(?:increase|add|increment|raise|decrease|subtract|reduce|lower)\\s*(?:the)?\\s*height\\s*(?:by)?\\s*(\\d+)\\s*(?:px|em|rem|%|vw|vh)`, 'i');
    const relativeMatch = input.match(relativeHeightPattern);
    
    if (relativeMatch) {
      console.log('Matched relative height change:', relativeMatch);
      const changeAmount = parseInt(relativeMatch[1]);
      const currentHeight = currentStyle.height || '0px';
      console.log('Current height:', currentHeight);
      
      // Extract current numeric value and unit
      const currentMatch = currentHeight.match(/^(\d+)([a-z%]+)$/i);
      if (!currentMatch) {
        console.log('Could not parse current height:', currentHeight);
        return null;
      }
      
      const currentValue = parseInt(currentMatch[1]);
      const unit = currentMatch[2];
      console.log('Current value:', currentValue, 'Unit:', unit);
      
      // Determine if increasing or decreasing
      const isIncreasing = /(?:increase|add|increment|raise)/i.test(input);
      const newValue = isIncreasing ? currentValue + changeAmount : currentValue - changeAmount;
      console.log('New value:', newValue);
      
      return {
        style: {
          height: `${newValue}${unit}`
        }
      };
    }

    // Process regular height patterns
    for (const pattern of stylePatterns.height) {
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

        console.log('Matched height pattern, value:', value);
        return {
          style: {
            height: value
          }
        };
      }
    }

    return null;
  }
} 