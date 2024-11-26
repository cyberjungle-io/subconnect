export class ButtonProcessor {
  static getStylePatterns() {
    return {
      // Hover effects
      hoverBackgroundColor: [
        /(?:set|make|change|update)?\s*(?:the)?\s*hover\s*(?:background)?\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /when\s*(?:I|user)?\s*hover\s*(?:make|set|change)?\s*(?:the)?\s*(?:background)?\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /(?:make|set)?\s*(?:the)?\s*button\s*(?:turn|change\s*to)\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})\s*on\s*hover/i
      ],
      hoverColor: [
        /(?:set|make|change|update)?\s*(?:the)?\s*hover\s*text\s*color\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
        /when\s*(?:I|user)?\s*hover\s*(?:make|set|change)?\s*(?:the)?\s*text\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
        /(?:make|set)?\s*(?:the)?\s*text\s*(?:turn|change\s*to)\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})\s*on\s*hover/i
      ],
      hoverScale: [
        /(?:set|make|change|update)?\s*(?:the)?\s*hover\s*scale\s*(?:to|=|:)?\s*(0?\.[0-9]+|1\.?[0-9]*)/i,
        /(?:make|set)?\s*(?:the)?\s*button\s*(grow|shrink)\s*(?:to|by)?\s*(0?\.[0-9]+|1\.?[0-9]*)?/i,
        /(?:make|set)?\s*(?:the)?\s*button\s*(bigger|smaller)\s*on\s*hover/i,
        /when\s*(?:I|user)?\s*hover\s*(?:make|set)?\s*(?:the)?\s*(?:button|size)?\s*(grow|shrink)\s*(?:to|by)?\s*(0?\.[0-9]+|1\.?[0-9]*)?/i
      ],
      cursor: [
        /(?:set|make|change|update)?\s*(?:the)?\s*cursor\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        /(?:make|set)?\s*(?:the)?\s*mouse\s*(?:cursor|pointer)\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        /change\s*(?:the)?\s*mouse\s*(?:to|into)\s*(?:a|an)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i
      ],
      transitionDuration: [
        /(?:set|make|change|update)?\s*(?:the)?\s*transition\s*(?:duration|speed|time)?\s*(?:to|=|:)?\s*(\d+)(?:\s*ms)?/i,
        /(?:make|set)?\s*(?:the)?\s*(?:hover)?\s*animation\s*(?:last|take)\s*(\d+)(?:\s*ms)?/i,
        /(?:make|set)?\s*(?:the)?\s*hover\s*effect\s*(?:last|take)\s*(\d+)(?:\s*ms)?/i,
        /speed\s*(?:up|down)\s*(?:the)?\s*(?:hover)?\s*(?:effect|animation)\s*to\s*(\d+)(?:\s*ms)?/i
      ],
      enablePageNavigation: [
        /(?:enable|activate|turn\s*on)\s*(?:the)?\s*(?:page)?\s*navigation/i,
        /(?:disable|deactivate|turn\s*off)\s*(?:the)?\s*(?:page)?\s*navigation/i,
        /(?:make|set)?\s*(?:the)?\s*button\s*(?:to)?\s*(?:navigate|link)\s*to\s*(?:a|another)?\s*page/i,
        /(?:let|make)?\s*(?:the)?\s*button\s*(?:be)?\s*(?:clickable|navigable)/i
      ],
      targetPageId: [
        /(?:set|make|change|update)?\s*(?:the)?\s*target\s*page\s*(?:to|=|:)?\s*["']?([^"']+)["']?/i,
        /(?:make|set)?\s*(?:the)?\s*button\s*(?:to)?\s*(?:go|link|navigate)\s*to\s*(?:the)?\s*["']?([^"']+)["']?\s*page/i,
        /(?:when|if)\s*clicked\s*(?:go|navigate|take\s*me)?\s*to\s*(?:the)?\s*["']?([^"']+)["']?\s*page/i
      ]
    };
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

  static processCommand(input) {
    console.log('ButtonProcessor received input:', input);

    const stylePatterns = this.getStylePatterns();
    let result = { style: {} };

    // Handle enable/disable navigation separately
    if (input.match(/enable\s*(?:page)?\s*navigation/i)) {
      result.style.enablePageNavigation = true;
      return result;
    }
    if (input.match(/disable\s*(?:page)?\s*navigation/i)) {
      result.style.enablePageNavigation = false;
      result.style.targetPageId = '';
      return result;
    }

    // Process other patterns
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

          if (value !== undefined) {
            result.style[property] = value;
          }
        }
      }
    }

    return Object.keys(result.style).length > 0 ? result : null;
  }
} 