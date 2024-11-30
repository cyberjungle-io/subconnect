export class ButtonProcessor {
  static colorKeywords = {
    // Common color aliases
    'transparent': 'transparent',
    'clear': 'transparent',
    'invisible': 'transparent',
    'navy': '#000080',
    'sky': '#87CEEB',
    'forest': '#228B22',
    'crimson': '#DC143C',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    // Basic colors
    'blue': '#0000ff',
    'light blue': '#add8e6',
    'dark blue': '#00008b',
    'green': '#008000',
    'light green': '#90ee90',
    'dark green': '#006400',
    'red': '#ff0000',
    'light red': '#ffcccb',
    'dark red': '#8b0000',
    'yellow': '#ffff00',
    'purple': '#800080',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'grey': '#808080'
  };

  static getStylePatterns() {
    return {
      hoverBackgroundColor: [
        // Exact color changes
        /(?:set|make|change)?\s*(?:the)?\s*hover\s*(?:background)?\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /when\s*(?:I|user)?\s*hover\s*(?:make|set|change)?\s*(?:the)?\s*(?:background)?\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        // Natural language patterns
        /(?:i want|i need|please make)?\s*(?:the)?\s*button\s*(?:to)?\s*(?:turn|change|become)\s*(blue|red|green|black|white|yellow|purple|gray|transparent)\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i,
        /(?:can you|could you)?\s*make\s*(?:the)?\s*button\s*(blue|red|green|black|white|yellow|purple|gray|transparent)\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i,
        // Intensity modifiers
        /(?:set|make|change)?\s*(?:the)?\s*hover\s*(?:color)?\s*(?:to)?\s*(?:a\s*)?(light|dark)?\s*(blue|red|green|black|white|yellow|purple|gray|grey|#[0-9a-fA-F]{3,6}|sky|navy|forest|crimson|gold|silver)/i
      ],
      hoverColor: [
        // Text color changes
        /(?:set|make|change)?\s*(?:the)?\s*hover\s*text\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
        // Natural language patterns
        /(?:i want|i need|please make)?\s*(?:the)?\s*text\s*(?:to)?\s*(?:turn|change|become)\s*(blue|red|green|black|white|yellow|purple|gray)\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i,
        /(?:can you|could you)?\s*make\s*(?:the)?\s*text\s*(blue|red|green|black|white|yellow|purple|gray)\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i
      ],
      hoverScale: [
        // Scale changes
        /(?:set|make|change)?\s*(?:the)?\s*hover\s*scale\s*(?:to|=|:)?\s*(0?\.[0-9]+|1\.?[0-9]*)/i,
        // Natural language patterns
        /(?:i want|i need|please make)?\s*(?:the)?\s*button\s*(?:to)?\s*(grow|shrink|expand|contract|get bigger|get smaller)\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i,
        /(?:can you|could you)?\s*make\s*(?:the)?\s*button\s*(bigger|smaller|larger|tinier)\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i,
        // Relative size changes
        /(?:make|set)?\s*(?:the)?\s*button\s*(grow|shrink)\s*(?:a\s*)?(?:little|lot|bit|tad|bunch|ton)?\s*(?:when|on|while)?\s*(?:I|we|user)?\s*hover/i
      ],
      cursor: [
        // Cursor style changes
        /(?:set|make|change)?\s*(?:the)?\s*cursor\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        // Natural language patterns
        /(?:i want|i need|please make)?\s*(?:the)?\s*(?:cursor|mouse)\s*(?:to)?\s*(?:look|appear|show|become)\s*(?:like)?\s*(?:a|an)?\s*(pointer|hand|arrow|grabber|text cursor|copy symbol)/i,
        /(?:can you|could you)?\s*change\s*(?:the)?\s*(?:cursor|mouse)\s*(?:to|into)\s*(?:a|an)?\s*(pointer|hand|arrow|grabber|text cursor|copy symbol)/i
      ],
      transitionDuration: [
        // Duration changes
        /(?:set|make|change)?\s*(?:the)?\s*transition\s*(?:duration|speed|time)?\s*(?:to|=|:)?\s*(\d+)(?:\s*ms)?/i,
        // Natural language patterns
        /(?:i want|i need|please make)?\s*(?:the)?\s*(?:hover)?\s*(?:effect|animation|transition)\s*(?:to)?\s*(?:take|last|be)\s*(\d+)(?:\s*ms)?/i,
        /(?:can you|could you)?\s*make\s*(?:the)?\s*(?:hover)?\s*(?:effect|animation|transition)\s*(faster|slower|quicker|longer|shorter)/i,
        // Relative speed changes
        /(?:make|set)?\s*(?:the)?\s*(?:hover)?\s*(?:effect|animation|transition)\s*(faster|slower)\s*(?:by)?\s*(?:a\s*)?(?:little|lot|bit|tad|bunch|ton)?/i
      ],
      enablePageNavigation: [
        // Basic patterns
        /(?:enable|activate|turn\s*on)\s*(?:the)?\s*(?:page)?\s*navigation/i,
        /(?:disable|deactivate|turn\s*off)\s*(?:the)?\s*(?:page)?\s*navigation/i,
        // Natural language patterns
        /(?:i want|i need|please)?\s*(?:make|set)?\s*(?:the)?\s*button\s*(?:to)?\s*(?:navigate|link|go)\s*to\s*(?:a|another)?\s*page/i,
        /(?:can you|could you)?\s*make\s*(?:the)?\s*button\s*(?:clickable|navigable|link to a page)/i,
        /(?:let|make)?\s*(?:this|the)?\s*button\s*(?:be)?\s*(?:a)?\s*(?:link|navigation button)/i
      ],
      targetPageId: [
        // Basic patterns
        /(?:set|make|change)?\s*(?:the)?\s*target\s*page\s*(?:to|=|:)?\s*["']?([^"']+)["']?/i,
        // Natural language patterns
        /(?:i want|i need|please)?\s*(?:make|set)?\s*(?:the)?\s*button\s*(?:to)?\s*(?:go|link|navigate)\s*to\s*(?:the)?\s*["']?([^"']+)["']?\s*page/i,
        /(?:when|if)\s*clicked\s*(?:go|navigate|take\s*me)?\s*to\s*(?:the)?\s*["']?([^"']+)["']?\s*page/i,
        /(?:can you|could you)?\s*make\s*(?:this|the)?\s*button\s*(?:go|link|navigate)\s*to\s*(?:the)?\s*["']?([^"']+)["']?\s*page/i
      ]
    };
  }

  static processCommand(input) {
    console.log('ButtonProcessor received input:', input);
    const lowercaseInput = input.toLowerCase();

    // Handle navigation enable/disable
    const navigationPattern = /(?:enable|activate|turn\s*on|disable|deactivate|turn\s*off)\s*(?:the)?\s*(?:page)?\s*navigation/i;
    const navigationMatch = lowercaseInput.match(navigationPattern);
    if (navigationMatch) {
      const isEnable = /(enable|activate|turn\s*on)/i.test(navigationMatch[0]);
      return {
        style: {
          enablePageNavigation: isEnable,
          ...(isEnable ? {} : { targetPageId: '' }) // Clear targetPageId if disabling
        }
      };
    }

    // Handle natural language navigation requests
    const naturalNavPattern = /(?:i want|i need|please|can you|could you)?\s*(?:make|set)?\s*(?:this|the)?\s*button\s*(?:to)?\s*(?:be)?\s*(?:a)?\s*(?:link|navigation button)/i;
    if (naturalNavPattern.test(lowercaseInput)) {
      return {
        style: {
          enablePageNavigation: true
        }
      };
    }

    // Handle relative speed changes for transitions
    const speedPattern = /(?:make|set)?\s*(?:the)?\s*(?:hover)?\s*(?:effect|animation|transition)\s*(faster|slower)\s*(?:by)?\s*(?:a\s*)?(little|lot|bit|tad|bunch|ton)?/i;
    const speedMatch = lowercaseInput.match(speedPattern);
    if (speedMatch) {
      const direction = speedMatch[1];
      const intensity = speedMatch[2] || 'normal';
      
      // Base change amount in milliseconds
      let changeAmount = 100;
      
      // Adjust based on intensity
      if (['little', 'bit', 'tad'].includes(intensity)) {
        changeAmount = 50;
      } else if (['lot', 'bunch', 'ton'].includes(intensity)) {
        changeAmount = 200;
      }
      
      // Determine if we're increasing or decreasing
      const multiplier = direction === 'slower' ? 1 : -1;
      
      return {
        style: {
          transitionDuration: `${Math.max(0, 200 + (changeAmount * multiplier))}`,
          transition: `all ${Math.max(0, 200 + (changeAmount * multiplier))}ms ease-in-out`
        }
      };
    }

    // Handle relative size changes for hover scale
    const scalePattern = /(?:make|set)?\s*(?:the)?\s*button\s*(grow|shrink)\s*(?:a\s*)?(little|lot|bit|tad|bunch|ton)?/i;
    const scaleMatch = lowercaseInput.match(scalePattern);
    if (scaleMatch) {
      const direction = scaleMatch[1];
      const intensity = scaleMatch[2] || 'normal';
      
      // Base scale change
      let scaleChange = 0.1;
      
      // Adjust based on intensity
      if (['little', 'bit', 'tad'].includes(intensity)) {
        scaleChange = 0.05;
      } else if (['lot', 'bunch', 'ton'].includes(intensity)) {
        scaleChange = 0.2;
      }
      
      // Determine if we're increasing or decreasing
      const multiplier = direction === 'grow' ? 1 : -1;
      
      return {
        style: {
          hoverScale: Math.max(0.5, Math.min(1.5, 1 + (scaleChange * multiplier)))
        }
      };
    }

    // Handle color changes with intensity modifiers
    const colorPattern = /(?:set|make|change)?\s*(?:the)?\s*hover\s*(?:color)?\s*(?:to)?\s*(?:a\s*)?(light|dark)?\s*(blue|red|green|black|white|yellow|purple|gray|grey|#[0-9a-fA-F]{3,6}|sky|navy|forest|crimson|gold|silver)/i;
    const colorMatch = lowercaseInput.match(colorPattern);
    if (colorMatch) {
      const intensity = colorMatch[1] || '';
      const baseColor = colorMatch[2].toLowerCase();
      const colorKey = intensity ? `${intensity} ${baseColor}` : baseColor;
      
      if (this.colorKeywords[colorKey]) {
        return {
          style: {
            hoverBackgroundColor: this.colorKeywords[colorKey]
          }
        };
      }
    }

    // Process other patterns including targetPageId
    const stylePatterns = this.getStylePatterns();
    let result = { style: {} };

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        
        if (match) {
          let value = match[1]?.toLowerCase();

          // Handle special cases
          if (property === 'transitionDuration') {
            value = parseInt(value);
            result.style.transition = `all ${value}ms ease-in-out`;
          }

          // Handle target page ID
          if (property === 'targetPageId') {
            result.style.enablePageNavigation = true; // Auto-enable navigation when setting target
            result.style.targetPageId = value;
          }

          // Map natural language cursor terms to CSS values
          if (property === 'cursor') {
            const cursorMap = {
              'hand': 'pointer',
              'arrow': 'default',
              'grabber': 'grab',
              'text cursor': 'text',
              'copy symbol': 'copy'
            };
            value = cursorMap[value] || value;
          }

          if (value !== undefined) {
            result.style[property] = value;
          }
        }
      }
    }

    return Object.keys(result.style).length > 0 ? result : null;
  }

  static getPropertyNames() {
    return {
      hoverBackgroundColor: 'hover background color',
      hoverColor: 'hover text color',
      hoverScale: 'hover scale',
      cursor: 'cursor style',
      transitionDuration: 'transition duration',
      enablePageNavigation: 'page navigation',
      targetPageId: 'target page'
    };
  }
} 