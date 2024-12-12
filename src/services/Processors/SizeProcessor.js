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
        // Auto width
        /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to)?\s*auto/i,
        /automatic\s*width/i
      ],
      height: [
        // Basic patterns
        new RegExp(`(?:set|make|change)?\\s*(?:the)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`, 'i'),
        // Percentage shortcuts
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*(25|50|75|100)\s*(?:percent|%)/i,
        // Auto height - add more variations
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to)?\s*auto/i,
        /automatic\s*height/i,
        /make\s*(?:the)?\s*height\s*automatic/i,
        /set\s*(?:to)?\s*auto(?:matic)?\s*height/i
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
    
    // Add specific check for fit commands
    const fitPattern = /fit\s*(?:to)?\s*(content|vertical|horizontal)/i;
    const fitMatch = input.match(fitPattern);
    
    if (fitMatch) {
      const fitType = fitMatch[1].toLowerCase();
      console.log('Matched fit pattern:', fitType);
      
      switch (fitType) {
        case 'content':
          return {
            style: {
              width: 'fit-content',
              height: 'fit-content'
            }
          };
        case 'vertical':
          return {
            style: {
              height: 'fit-content'
            }
          };
        case 'horizontal':
          return {
            style: {
              width: 'fit-content'
            }
          };
      }
    }

    // Add specific check for auto height command
    const autoHeightPattern = /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to)?\s*auto(?:matic)?/i;
    if (autoHeightPattern.test(input)) {
      console.log('Matched auto height pattern');
      
      // Check if height is already auto
      if (currentStyle.height === 'auto') {
        // Return null to indicate no change needed
        console.log('Height is already auto, no change needed');
        return null;
      }
      
      // Store the previous height value for potential undo
      const previousHeight = currentStyle.height;
      console.log('Changing height from', previousHeight, 'to auto');
      
      return {
        style: {
          height: 'auto'
        }
      };
    }

    // Handle "make bigger/smaller" commands
    const sizeChangePattern = /(?:make|set)\s*(?:it|this)?\s*(bigger|larger|smaller)/i;
    const sizeMatch = input.match(sizeChangePattern);
    
    if (sizeMatch) {
      const isBigger = sizeMatch[1].match(/bigger|larger/i);
      const changes = {};
      
      // Helper function to calculate new size
      const calculateNewSize = (currentValue, unit, isIncrease) => {
        if (unit === '%') {
          // For percentages, use smaller increments
          const increment = 5;
          const newValue = isIncrease ? currentValue + increment : currentValue - increment;
          // Allow percentage to go from 5% to 100%
          return `${Math.min(Math.max(newValue, 5), 100)}%`;
        } else if (unit === 'px') {
          // For pixels, use larger increments and no upper limit
          const increment = 50;
          const newValue = isIncrease ? currentValue + increment : currentValue - increment;
          // Only limit the minimum pixel size
          return `${Math.max(newValue, 50)}px`;
        }
        return null;
      };

      // Process width
      if (currentStyle.width) {
        const widthMatch = currentStyle.width.match(/^([\d.]+)([%px]+|auto)$/);
        if (widthMatch) {
          const [_, value, unit] = widthMatch;
          const currentValue = parseFloat(value);
          const newSize = calculateNewSize(currentValue, unit, isBigger);
          if (newSize) changes.width = newSize;
        } else if (currentStyle.width === 'auto') {
          // Start with a reasonable default size when converting from auto
          changes.width = isBigger ? '300px' : '200px';
        }
      } else {
        // If no width is set, start with a default
        changes.width = isBigger ? '300px' : '200px';
      }
      
      // Process height
      if (currentStyle.height) {
        const heightMatch = currentStyle.height.match(/^([\d.]+)([%px]+|auto)$/);
        if (heightMatch) {
          const [_, value, unit] = heightMatch;
          const currentValue = parseFloat(value);
          const newSize = calculateNewSize(currentValue, unit, isBigger);
          if (newSize) changes.height = newSize;
        } else if (currentStyle.height === 'auto') {
          // Start with a reasonable default size when converting from auto
          changes.height = isBigger ? '300px' : '200px';
        }
      } else {
        // If no height is set, start with a default
        changes.height = isBigger ? '300px' : '200px';
      }
      
      console.log('Size changes:', changes);
      return { style: changes };
    }

    // Handle specific width/height patterns
    const stylePatterns = this.getStylePatterns();

    // Process width patterns
    for (const pattern of stylePatterns.width) {
      const match = input.match(pattern);
      if (match) {
        let value = match[1]?.toLowerCase();
        
        // Handle auto width
        if (input.includes('auto')) {
          return {
            style: {
              width: 'auto'
            }
          };
        }
        
        // Handle percentage shortcuts
        if (['25', '50', '75', '100'].includes(value)) {
          value = `${value}%`;
        }
        
        return {
          style: {
            width: value || 'auto'
          }
        };
      }
    }

    // Process height patterns
    for (const pattern of stylePatterns.height) {
      const match = input.match(pattern);
      if (match) {
        let value = match[1]?.toLowerCase();
        
        // Handle auto height
        if (input.includes('auto')) {
          return {
            style: {
              height: 'auto'
            }
          };
        }
        
        // Handle percentage shortcuts
        if (['25', '50', '75', '100'].includes(value)) {
          value = `${value}%`;
        }
        
        return {
          style: {
            height: value || 'auto'
          }
        };
      }
    }

    return null;
  }
} 