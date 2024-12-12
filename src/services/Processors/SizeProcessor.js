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
    
    // Handle "make bigger/smaller" commands
    const sizeChangePattern = /(?:make|set)\s*(?:it|this)?\s*(bigger|larger|smaller)/i;
    const sizeMatch = input.match(sizeChangePattern);
    
    if (sizeMatch) {
      const isBigger = sizeMatch[1].match(/bigger|larger/i);
      const changes = {};
      
      // Process width
      if (currentStyle.width) {
        const widthMatch = currentStyle.width.match(/^([\d.]+)([%px]+|auto)$/);
        if (widthMatch) {
          const [_, value, unit] = widthMatch;
          if (unit === '%') {
            const currentValue = parseFloat(value);
            const newValue = isBigger ? currentValue + 10 : currentValue - 10;
            changes.width = `${Math.min(Math.max(newValue, 10), 100)}%`;
          } else if (unit === 'px') {
            const currentValue = parseFloat(value);
            const newValue = isBigger ? currentValue + 20 : currentValue - 20;
            changes.width = `${Math.max(newValue, 20)}px`;
          }
        } else if (currentStyle.width === 'auto') {
          changes.width = isBigger ? '200px' : '100px';
        }
      } else {
        changes.width = isBigger ? '200px' : '100px';
      }
      
      // Process height
      if (currentStyle.height) {
        const heightMatch = currentStyle.height.match(/^([\d.]+)([%px]+|auto)$/);
        if (heightMatch) {
          const [_, value, unit] = heightMatch;
          if (unit === '%') {
            const currentValue = parseFloat(value);
            const newValue = isBigger ? currentValue + 10 : currentValue - 10;
            changes.height = `${Math.min(Math.max(newValue, 10), 100)}%`;
          } else if (unit === 'px') {
            const currentValue = parseFloat(value);
            const newValue = isBigger ? currentValue + 20 : currentValue - 20;
            changes.height = `${Math.max(newValue, 20)}px`;
          }
        } else if (currentStyle.height === 'auto') {
          changes.height = isBigger ? '200px' : '100px';
        }
      } else {
        changes.height = isBigger ? '200px' : '100px';
      }
      
      return { style: changes };
    }

    // Handle specific width/height patterns
    const stylePatterns = this.getStylePatterns();

    // Process width patterns
    for (const pattern of stylePatterns.width) {
      const match = input.match(pattern);
      if (match) {
        let value = match[1]?.toLowerCase();
        
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