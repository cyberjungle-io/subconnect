export class BasicTextProcessor {
  static fontKeywords = {
    'arial': 'Arial, sans-serif',
    'helvetica': 'Helvetica, Arial, sans-serif',
    'georgia': 'Georgia, serif',
    'times': '"Times New Roman", Times, serif',
    'times new roman': '"Times New Roman", Times, serif',
    'courier': '"Courier New", Courier, monospace',
    'verdana': 'Verdana, Geneva, sans-serif',
    'trebuchet': '"Trebuchet MS", Helvetica, sans-serif',
    'arial black': '"Arial Black", Gadget, sans-serif',
    'palatino': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    'lucida': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'tahoma': 'Tahoma, Geneva, sans-serif',
    'gill sans': '"Gill Sans", "Gill Sans MT", sans-serif',
    'impact': 'Impact, Charcoal, sans-serif',
    'century gothic': '"Century Gothic", sans-serif'
  };

  static getStylePatterns() {
    return {
      fontFamily: [
        /(?:set|change|make)?\s*(?:the)?\s*title\s*font\s*(?:to|=|:)?\s*([a-zA-Z ]+)/i,
        /(?:set|change|make)?\s*(?:the)?\s*label\s*font\s*(?:to|=|:)?\s*([a-zA-Z ]+)/i
      ],
      fontSize: [
        /(?:set|make|change)?\s*(?:the)?\s*title\s*size\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|pt|%)?)/i,
        /(?:set|make|change)?\s*(?:the)?\s*label\s*size\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|pt|%)?)/i,
        /make\s*(?:the)?\s*title\s*(bigger|larger|smaller|tinier)/i,
        /make\s*(?:the)?\s*label\s*(bigger|larger|smaller|tinier)/i
      ],
      fontWeight: [
        /make\s*(?:the)?\s*title\s*(bold|normal|lighter|bolder)/i,
        /make\s*(?:the)?\s*label\s*(bold|normal|lighter|bolder)/i,
        /(?:set|change)?\s*(?:the)?\s*title\s*(?:to|=|:)?\s*(bold|normal|lighter|bolder)/i,
        /(?:set|change)?\s*(?:the)?\s*label\s*(?:to|=|:)?\s*(bold|normal|lighter|bolder)/i
      ],
      fontStyle: [
        /make\s*(?:the)?\s*title\s*(italic|normal)/i,
        /make\s*(?:the)?\s*label\s*(italic|normal)/i,
        /(?:set|change)?\s*(?:the)?\s*title\s*style\s*(?:to|=|:)?\s*(italic|normal)/i,
        /(?:set|change)?\s*(?:the)?\s*label\s*style\s*(?:to|=|:)?\s*(italic|normal)/i
      ],
      textDecoration: [
        /(?:add|remove)\s*(?:an?)?\s*underline\s*(?:to|from)\s*(?:the)?\s*(title|label)/i,
        /make\s*(?:the)?\s*(title|label)\s*(underlined|normal)/i
      ],
      color: [
        /(?:set|change|make)?\s*(?:the)?\s*title\s*color\s*(?:to|=|:)?\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
        /(?:set|change|make)?\s*(?:the)?\s*label\s*color\s*(?:to|=|:)?\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i
      ],
      textAlign: [
        /(?:align|make)\s*(?:the)?\s*title\s*(left|center|right)/i,
        /(?:align|make)\s*(?:the)?\s*label\s*(left|center|right)/i,
        /(?:set|change)?\s*(?:the)?\s*title\s*alignment\s*(?:to|=|:)?\s*(left|center|right)/i,
        /(?:set|change)?\s*(?:the)?\s*label\s*alignment\s*(?:to|=|:)?\s*(left|center|right)/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      fontFamily: 'font family',
      fontSize: 'font size',
      fontWeight: 'font weight',
      fontStyle: 'font style',
      textDecoration: 'text decoration',
      color: 'text color',
      textAlign: 'text alignment'
    };
  }

  static processCommand(input, currentStyle = {}) {
    const lowercaseInput = input.toLowerCase();
    const patterns = this.getStylePatterns();

    // Check if the command is targeting a title or label
    if (!lowercaseInput.includes('title') && !lowercaseInput.includes('label')) {
      return null;
    }

    // Process font family
    for (const pattern of patterns.fontFamily) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const fontName = match[1].toLowerCase();
        if (this.fontKeywords[fontName]) {
          return {
            style: {
              fontFamily: this.fontKeywords[fontName]
            }
          };
        }
      }
    }

    // Process font size
    for (const pattern of patterns.fontSize) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        if (match[1]?.match(/bigger|larger|smaller|tinier/i)) {
          const currentSize = parseInt(currentStyle.fontSize) || 16;
          const isBigger = match[1].match(/bigger|larger/i);
          const newSize = isBigger ? currentSize * 1.25 : currentSize * 0.8;
          return {
            style: {
              fontSize: `${Math.round(newSize)}px`
            }
          };
        } else if (match[1]) {
          let size = match[1];
          if (!size.match(/px|em|rem|pt|%$/)) {
            size += 'px';
          }
          return {
            style: {
              fontSize: size
            }
          };
        }
      }
    }

    // Process font weight
    for (const pattern of patterns.fontWeight) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        return {
          style: {
            fontWeight: match[1]
          }
        };
      }
    }

    // Process font style
    for (const pattern of patterns.fontStyle) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        return {
          style: {
            fontStyle: match[1]
          }
        };
      }
    }

    // Process text decoration
    for (const pattern of patterns.textDecoration) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const isUnderline = lowercaseInput.includes('underline');
        return {
          style: {
            textDecoration: isUnderline ? 'underline' : 'none'
          }
        };
      }
    }

    // Process color
    for (const pattern of patterns.color) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const color = match[1];
        return {
          style: {
            color: color.startsWith('#') ? color : color
          }
        };
      }
    }

    // Process text alignment
    for (const pattern of patterns.textAlign) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        return {
          style: {
            textAlign: match[1]
          }
        };
      }
    }

    return null;
  }
} 