export class TextProcessor {
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

  static colorKeywords = {
    'transparent': 'transparent',
    'navy': '#000080',
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

  static elementTypes = {
    'paragraph': 'p',
    'heading 1': 'h1',
    'heading 2': 'h2',
    'heading 3': 'h3',
    'heading 4': 'h4',
    'heading 5': 'h5',
    'heading 6': 'h6',
    'h1': 'h1',
    'h2': 'h2',
    'h3': 'h3',
    'h4': 'h4',
    'h5': 'h5',
    'h6': 'h6'
  };

  static getStylePatterns() {
    return {
      fontFamily: [
        /(?:set|change|make)?\s*(?:the)?\s*font\s*(?:family|type|face)?\s*(?:to|=|:)?\s*([a-zA-Z ]+)/i,
        /use\s*(?:the)?\s*([a-zA-Z ]+)\s*font/i
      ],
      fontSize: [
        /(?:set|make|change)?\s*(?:the)?\s*font\s*size\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|pt|%)?)/i,
        /make\s*(?:the)?\s*text\s*(?:size)?\s*(bigger|larger|smaller|tinier)/i
      ],
      color: [
        /(?:set|change|make)?\s*(?:the)?\s*(?:text|font)\s*color\s*(?:to|=|:)?\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
        /make\s*(?:the)?\s*text\s*(darker|lighter)/i,
        /^change\s*(?:the)?\s*text\s*color\s*to\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
        /^set\s*(?:the)?\s*text\s*color\s*to\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
        /(?:change|set|make)?\s*(?:the)?\s*text\s+(?:to\s+)?([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
        /^(?:change|set|make)?\s*(?:the)?\s*text\s+([a-zA-Z]+|#[0-9a-fA-F]{3,6})$/i
      ],
      textAlign: [
        /(?:set|make|change)?\s*(?:the)?\s*(?:text)?\s*align(?:ment)?\s*(?:to|=|:)?\s*(left|center|right)/i,
        /(left|center|right)\s*align\s*(?:the)?\s*text/i,
        /^(center|left|right)\s*align\s*(?:the)?\s*text$/i,
        /align\s*(?:the)?\s*text\s*(?:to)?\s*(left|center|right)/i
      ],
      letterSpacing: [
        /(?:set|change|adjust)?\s*(?:the)?\s*letter\s*spacing\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem)?)/i,
        /make\s*(?:the)?\s*letters\s*(closer|further\s*apart|tighter|looser)/i
      ],
      lineHeight: [
        /(?:set|change|adjust)?\s*(?:the)?\s*line\s*height\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%)?)/i,
        /(?:increase|decrease)\s*(?:the)?\s*line\s*spacing/i
      ],
      textTransform: [
        /(?:set|make|change)?\s*(?:the)?\s*text\s*(?:to|=|:)?\s*(uppercase|lowercase|capitalize)/i,
        /(capitalize|uppercase|lowercase)\s*(?:the)?\s*text/i
      ],
      wordSpacing: [
        /(?:set|change|adjust)?\s*(?:the)?\s*word\s*spacing\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem)?)/i,
        /make\s*(?:the)?\s*words\s*(closer|further\s*apart|tighter|looser)/i
      ],
      textShadow: [
        /(?:add|set|change)?\s*(?:the)?\s*text\s*shadow\s*(?:to|=|:)?\s*(\d+px\s+\d+px\s+\d+px\s+(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6}))/i,
        /^add\s*(?:a)?\s*text\s*shadow\s*(\d+px\s+\d+px\s+\d+px\s+(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6}))/i,
        /remove\s*(?:the)?\s*text\s*shadow/i
      ],
      elementType: [
        /(?:set|change|make)?\s*(?:this|it)?\s*(?:a|an)?\s*(paragraph|heading [1-6]|h[1-6])/i,
        /convert\s*(?:to|into)?\s*(?:a|an)?\s*(paragraph|heading [1-6]|h[1-6])/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      fontFamily: 'font family',
      fontSize: 'font size',
      color: 'text color',
      textAlign: 'text alignment',
      letterSpacing: 'letter spacing',
      lineHeight: 'line height',
      textTransform: 'text transform',
      wordSpacing: 'word spacing',
      textShadow: 'text shadow',
      elementType: 'element type'
    };
  }

  static processCommand(input, currentStyle = {}) {
    console.log('TextProcessor received input:', input, 'Current style:', currentStyle);
    const lowercaseInput = input.toLowerCase();

    // Process text color first (high priority)
    const colorPatterns = [
      /(?:set|change|make)?\s*(?:the)?\s*(?:text|font)\s*color\s*(?:to|=|:)?\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
      /make\s*(?:the)?\s*text\s*(darker|lighter)/i,
      /^change\s*(?:the)?\s*text\s*color\s*to\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
      /^set\s*(?:the)?\s*text\s*color\s*to\s*([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
      /(?:change|set|make)?\s*(?:the)?\s*text\s+(?:to\s+)?([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i,
      /^(?:change|set|make)?\s*(?:the)?\s*text\s+([a-zA-Z]+|#[0-9a-fA-F]{3,6})$/i
    ];

    for (const pattern of colorPatterns) {
      const colorMatch = lowercaseInput.match(pattern);
      if (colorMatch) {
        const color = colorMatch[1]?.toLowerCase();
        if (color && !color.match(/darker|lighter/)) {
          console.log('TextProcessor: Matched color command:', color);
          // If it's a predefined color keyword
          if (this.colorKeywords[color]) {
            return {
              style: {
                color: this.colorKeywords[color]
              }
            };
          }
          // If it's a hex color
          if (color.startsWith('#')) {
            return {
              style: {
                color: color
              }
            };
          }
          // For CSS named colors
          return {
            style: {
              color: color
            }
          };
        }
      }
    }

    // Process text shadow (high priority)
    const shadowPatterns = [
      /(?:add|set|change)?\s*(?:the)?\s*text\s*shadow\s*(?:to|=|:)?\s*(\d+px\s+\d+px\s+\d+px\s+(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6}))/i,
      /^add\s*(?:a)?\s*text\s*shadow\s*(\d+px\s+\d+px\s+\d+px\s+(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6}))/i,
      /remove\s*(?:the)?\s*text\s*shadow/i
    ];

    for (const pattern of shadowPatterns) {
      const shadowMatch = lowercaseInput.match(pattern);
      if (shadowMatch) {
        if (shadowMatch[1]) {
          return {
            style: {
              textShadow: shadowMatch[1]
            }
          };
        } else if (lowercaseInput.includes('remove')) {
          return {
            style: {
              textShadow: 'none'
            }
          };
        }
      }
    }

    // Process text alignment - moved up for priority
    const alignPatterns = [
      /(?:set|make|change)?\s*(?:the)?\s*(?:text)?\s*align(?:ment)?\s*(?:to|=|:)?\s*(left|center|right)/i,
      /(left|center|right)\s*align\s*(?:the)?\s*text/i,
      /^(center|left|right)\s*align\s*(?:the)?\s*text$/i,
      /align\s*(?:the)?\s*text\s*(?:to)?\s*(left|center|right)/i
    ];

    for (const pattern of alignPatterns) {
      const alignMatch = lowercaseInput.match(pattern);
      if (alignMatch) {
        const alignment = alignMatch[1].toLowerCase();
        return {
          style: {
            textAlign: alignment
          }
        };
      }
    }

    // Process font family
    const fontFamilyMatch = lowercaseInput.match(/(?:set|change|make)?\s*(?:the)?\s*font\s*(?:family|type|face)?\s*(?:to|=|:)?\s*([a-zA-Z ]+)/i);
    if (fontFamilyMatch) {
      const fontName = fontFamilyMatch[1].toLowerCase();
      if (this.fontKeywords[fontName]) {
        return {
          style: {
            fontFamily: this.fontKeywords[fontName]
          }
        };
      }
    }

    // Process font size
    const fontSizeMatch = lowercaseInput.match(/(?:set|make|change)?\s*(?:the)?\s*font\s*size\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|pt|%)?)/i);
    if (fontSizeMatch) {
      let size = fontSizeMatch[1];
      if (!size.match(/px|em|rem|pt|%$/)) {
        size += 'px';
      }
      return {
        style: {
          fontSize: size
        }
      };
    }

    // Process relative font size changes
    if (lowercaseInput.match(/make\s*(?:the)?\s*text\s*(?:size)?\s*(bigger|larger|smaller|tinier)/i)) {
      const currentSize = parseInt(currentStyle.fontSize) || 16;
      const isBigger = lowercaseInput.includes('bigger') || lowercaseInput.includes('larger');
      const newSize = isBigger ? currentSize * 1.25 : currentSize * 0.8;
      return {
        style: {
          fontSize: `${Math.round(newSize)}px`
        }
      };
    }

    // Process letter spacing
    const letterSpacingMatch = lowercaseInput.match(/(?:set|change|adjust)?\s*(?:the)?\s*letter\s*spacing\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem)?)/i);
    if (letterSpacingMatch) {
      let spacing = letterSpacingMatch[1];
      if (!spacing.match(/px|em|rem$/)) {
        spacing += 'px';
      }
      return {
        style: {
          letterSpacing: spacing
        }
      };
    }

    // Process line height and spacing
    const lineHeightMatch = lowercaseInput.match(/(?:set|change|adjust)?\s*(?:the)?\s*line\s*height\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem|%)?)/i);
    const lineSpacingMatch = lowercaseInput.match(/(?:increase|decrease)\s*(?:the)?\s*line\s*spacing/i);
    
    if (lineHeightMatch) {
      let height = lineHeightMatch[1];
      if (!height.match(/px|em|rem|%$/)) {
        height += 'px';
      }
      return {
        style: {
          lineHeight: height
        }
      };
    } else if (lineSpacingMatch) {
      // Handle relative line spacing changes
      const currentHeight = parseFloat(currentStyle.lineHeight) || 1.5;
      const isIncrease = lowercaseInput.includes('increase');
      const newHeight = isIncrease ? currentHeight + 0.25 : Math.max(1, currentHeight - 0.25);
      
      return {
        style: {
          lineHeight: newHeight.toString()
        }
      };
    }

    // Process text transform
    const transformMatch = lowercaseInput.match(/(?:set|make|change)?\s*(?:the)?\s*text\s*(?:to|=|:)?\s*(uppercase|lowercase|capitalize)/i);
    if (transformMatch) {
      return {
        style: {
          textTransform: transformMatch[1].toLowerCase()
        }
      };
    }

    // Process word spacing
    const wordSpacingMatch = lowercaseInput.match(/(?:set|change|adjust)?\s*(?:the)?\s*word\s*spacing\s*(?:to|=|:)?\s*(\d+(?:\.\d+)?(?:px|em|rem)?)/i);
    if (wordSpacingMatch) {
      let spacing = wordSpacingMatch[1];
      if (!spacing.match(/px|em|rem$/)) {
        spacing += 'px';
      }
      return {
        style: {
          wordSpacing: spacing
        }
      };
    }

    // Process element type (heading conversion)
    const elementMatch = lowercaseInput.match(/(?:set|change|make|convert)?\s*(?:this|it)?\s*(?:to|into)?\s*(?:a|an)?\s*(paragraph|heading ?[1-6]|h[1-6])/i);
    if (elementMatch) {
      const elementType = elementMatch[1].toLowerCase().replace(/\s+/g, '');
      const mappedType = this.elementTypes[elementType] || 
                        this.elementTypes[elementType.replace('heading', 'h')] || 
                        elementType;
      
      // Return both elementType for the component type and tag-specific styles
      const styles = {
        elementType: mappedType,
        tagName: mappedType
      };

      // Add default styles based on heading level
      switch (mappedType) {
        case 'h1':
          styles.fontSize = '32px';
          styles.fontWeight = 'bold';
          break;
        case 'h2':
          styles.fontSize = '24px';
          styles.fontWeight = 'bold';
          break;
        case 'h3':
          styles.fontSize = '18.72px';
          styles.fontWeight = 'bold';
          break;
        case 'h4':
          styles.fontSize = '16px';
          styles.fontWeight = 'bold';
          break;
        case 'h5':
          styles.fontSize = '13.28px';
          styles.fontWeight = 'bold';
          break;
        case 'h6':
          styles.fontSize = '10.72px';
          styles.fontWeight = 'bold';
          break;
        case 'p':
          styles.fontSize = '16px';
          styles.fontWeight = 'normal';
          break;
      }

      return {
        style: styles
      };
    }

    return null;
  }
} 