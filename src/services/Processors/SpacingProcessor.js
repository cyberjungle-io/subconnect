export class SpacingProcessor {
  static getStylePatterns() {
    return {
      padding: [
        /add\s*(?:some)?\s*padding/i,
        /give\s*(?:it)?\s*(?:some)?\s*padding/i,
        /increase\s*(?:the)?\s*padding/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)(?:\s+(?:all|around))?/i,
        /padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding\s*(?:on\s+)?(?:the\s+)?(top|bottom|left|right)\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*(top|bottom|left|right)\s*padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:all)?\s*(?:the)?\s*padding/i,
        /(?:make|set)\s*(?:the)?\s*padding\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*padding/i,
        /(?:set|make|use|apply)?\s*(?:the)?\s*(?:padding\s+)?(small|medium|large)\s*padding/i
      ],
      margin: [
        /add\s*(?:some)?\s*margin/i,
        /give\s*(?:it)?\s*(?:some)?\s*margin/i,
        /increase\s*(?:the)?\s*margin/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)(?:\s+(?:all|around))?/i,
        /margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin\s*(?:on\s+)?(?:the\s+)?(top|bottom|left|right)\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*(top|bottom|left|right)\s*margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:all)?\s*(?:the)?\s*margin/i,
        /(?:make|set)\s*(?:the)?\s*margin\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*margin/i,
        /(?:set|make|use|apply)?\s*(?:the)?\s*(?:margin\s+)?(small|medium|large)\s*margin/i
      ],
      gap: [
        /add\s*(?:a)?\s*gap\s*(?:between\s*items)?/i,
        /give\s*(?:it)?\s*(?:a)?\s*gap/i,
        /increase\s*(?:the)?\s*gap/i,
        /add\s*spacing\s*between\s*items/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*gap\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /gap\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*gap(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:the)?\s*gap/i,
        /(?:make|set)\s*(?:the)?\s*gap\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*gap/i,
        /(?:set|make|use|apply)?\s*(?:the)?\s*(?:gap\s+)?(small|medium|large)\s*gap/i
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
    
    const presetSizes = {
      small: '8px',
      medium: '16px',
      large: '24px'
    };

    // Helper function to increment/decrement spacing
    const adjustSpacing = (currentValue, increment) => {
      const current = parseInt(currentValue) || 0;
      return `${Math.max(0, current + increment)}px`;
    };

    // Get the active section from the UI context
    const getActiveSection = () => {
      const sections = document.querySelectorAll('[class*="text-gray-600"]');
      let activeSection = 'padding'; // default
      
      const clickedButton = document.activeElement;
      if (clickedButton) {
        let currentElement = clickedButton;
        while (currentElement) {
          let prevSibling = currentElement.previousElementSibling;
          while (prevSibling) {
            const text = prevSibling.textContent.toLowerCase();
            if (text === 'padding' || text === 'margin' || text === 'gap') {
              activeSection = text;
              break;
            }
            prevSibling = prevSibling.previousElementSibling;
          }
          if (activeSection !== 'padding') break;
          currentElement = currentElement.parentElement;
        }
      }
      console.log('Active section:', activeSection);
      return activeSection;
    };

    // Handle add/remove 5px commands
    if (input.match(/^add\s*5px$/i)) {
      const activeSection = getActiveSection();
      console.log(`Adding 5px to ${activeSection}`);
      return { 
        style: { [activeSection]: null },
        adjust: (currentStyle) => ({
          [activeSection]: adjustSpacing(currentStyle[activeSection], 5)
        })
      };
    }

    if (input.match(/^remove\s*5px$/i)) {
      const activeSection = getActiveSection();
      console.log(`Removing 5px from ${activeSection}`);
      return { 
        style: { [activeSection]: null },
        adjust: (currentStyle) => ({
          [activeSection]: adjustSpacing(currentStyle[activeSection], -5)
        })
      };
    }

    // Handle preset sizes (small, medium, large)
    const sizeWords = ['small', 'medium', 'large'];
    if (sizeWords.includes(input.toLowerCase())) {
      const activeSection = getActiveSection();
      return {
        style: {
          [activeSection]: presetSizes[input.toLowerCase()]
        }
      };
    }

    // Process other patterns
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
          if (value && !value.match(/\d+(?:px|em|rem|%|vw|vh)?$/)) {
            value += 'px';
          }

          if (value) {
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

    console.log('SpacingProcessor result:', null);
    return null;
  }
} 