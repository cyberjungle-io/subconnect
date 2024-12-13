export class ColorProcessor {
  static getStylePatterns() {
    return {
      color: [
        // Basic color commands
        /(?:set|make|change)\s*(?:the)?\s*(?:text)?\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+|\d{1,3}(?:\s*,\s*\d{1,3}){2})/i,
        /(?:make|set|change)\s*(?:it|this)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+|\d{1,3}(?:\s*,\s*\d{1,3}){2})/i,
        
        // RGB format
        /(?:set|make|change)\s*(?:the)?\s*color\s*(?:to|=|:)?\s*rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i,
        
        // RGBA format with opacity
        /(?:set|make|change)\s*(?:the)?\s*color\s*(?:to|=|:)?\s*rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)/i,
        
        // HSL format
        /(?:set|make|change)\s*(?:the)?\s*color\s*(?:to|=|:)?\s*hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/i,
        
        // Opacity adjustments
        /(?:set|make|change)\s*(?:the)?\s*opacity\s*(?:to|=|:)?\s*(0|1|0?\.\d+)/i,
        /make\s*(?:it|this)?\s*(?:more|less)\s*transparent/i,
        
        // Relative adjustments
        /(?:make|set)\s*(?:it|this)?\s*(lighter|darker)/i,
        /(?:increase|decrease)\s*(?:the)?\s*brightness/i
      ],
      backgroundColor: [
        // Background color variations
        /(?:set|make|change)\s*(?:the)?\s*background\s*(?:color)?\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+|\d{1,3}(?:\s*,\s*\d{1,3}){2})/i,
        /(?:set|make|change)\s*(?:the)?\s*bg\s*(?:color)?\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+|\d{1,3}(?:\s*,\s*\d{1,3}){2})/i,
        
        // RGB background
        /(?:set|make|change)\s*(?:the)?\s*background\s*(?:to|=|:)?\s*rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i,
        
        // RGBA background
        /(?:set|make|change)\s*(?:the)?\s*background\s*(?:to|=|:)?\s*rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      color: 'text color',
      backgroundColor: 'background color'
    };
  }

  static adjustColor(color, adjustment) {
    // Convert color to RGB if it's in another format
    let rgb = this.parseColor(color);
    if (!rgb) return null;

    const { r, g, b, a } = rgb;

    switch (adjustment) {
      case 'lighter':
        return `rgba(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 20, 255)}, ${a})`;
      case 'darker':
        return `rgba(${Math.max(r - 20, 0)}, ${Math.max(g - 20, 0)}, ${Math.max(b - 20, 0)}, ${a})`;
      case 'more transparent':
        return `rgba(${r}, ${g}, ${b}, ${Math.max(a - 0.2, 0)})`;
      case 'less transparent':
        return `rgba(${r}, ${g}, ${b}, ${Math.min(a + 0.2, 1)})`;
      default:
        return null;
    }
  }

  static parseColor(color) {
    if (!color) return null;

    // Handle hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return { r, g, b, a: 1 };
    }

    // Handle rgb/rgba
    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
      };
    }

    // Handle named colors using a temporary canvas
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    const namedColor = ctx.fillStyle;
    
    if (namedColor.startsWith('#')) {
      return this.parseColor(namedColor);
    }

    return null;
  }

  static processCommand(input, currentStyle = {}) {
    console.log('ColorProcessor received input:', input);
    
    const patterns = this.getStylePatterns();
    
    // Handle relative adjustments first
    const adjustmentMatch = input.match(/(?:make|set)\s*(?:it|this)?\s*(lighter|darker|more transparent|less transparent)/i);
    if (adjustmentMatch) {
      const adjustment = adjustmentMatch[1].toLowerCase();
      const propertyToAdjust = input.includes('background') ? 'backgroundColor' : 'color';
      const currentColor = currentStyle[propertyToAdjust];
      
      if (!currentColor) {
        return null;
      }

      const adjustedColor = this.adjustColor(currentColor, adjustment);
      if (adjustedColor) {
        return {
          style: {
            [propertyToAdjust]: adjustedColor
          }
        };
      }
    }

    // Process other patterns
    for (const [property, propertyPatterns] of Object.entries(patterns)) {
      for (const pattern of propertyPatterns) {
        const match = input.match(pattern);
        if (!match) continue;

        // Handle RGB/RGBA format
        if (match[1] && match[2] && match[3]) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          const a = match[4] ? parseFloat(match[4]) : 1;
          
          if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) continue;
          
          return {
            style: {
              [property]: `rgba(${r}, ${g}, ${b}, ${a})`
            }
          };
        }

        // Handle opacity-only changes
        if (pattern.source.includes('opacity') && match[1]) {
          const opacity = parseFloat(match[1]);
          const currentColor = this.parseColor(currentStyle[property]);
          
          if (currentColor && !isNaN(opacity)) {
            return {
              style: {
                [property]: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${opacity})`
              }
            };
          }
        }

        // Handle direct color values (hex, named colors)
        if (match[1]) {
          const color = match[1].toLowerCase();
          // Validate hex color
          if (color.startsWith('#') && !/^#[0-9a-f]{6}$/i.test(color)) continue;
          
          return {
            style: {
              [property]: color
            }
          };
        }
      }
    }

    return null;
  }
} 