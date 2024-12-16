export class BackgroundProcessor {
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
      backgroundColor: [
        // Add pattern to catch the initial command
        /^(?:change|set|modify)\s+(?:the\s+)?background\s+color$/i,
        
        // Exact color changes
        /(?:set|make|change)?\s*(?:the)?\s*background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        
        // Relative changes
        /make\s*(?:the)?\s*background\s*(?:color)?\s*(darker|lighter|bit darker|bit lighter|much darker|much lighter)/i,
        
        // Opacity changes
        /make\s*(?:the)?\s*background\s*(?:more|less)\s*(?:transparent|opaque)/i,
        /(?:increase|decrease)\s*(?:the)?\s*background\s*opacity/i,
        
        // Special cases
        /(?:make|set)?\s*(?:the)?\s*background\s*transparent/i,
        /remove\s*(?:the)?\s*background\s*color/i
      ],
      backgroundImage: [
        /(?:set|make|change)?\s*(?:the)?\s*background\s*image\s*(?:to|=|:)?\s*(url\([^)]+\))/i,
        /remove\s*(?:the)?\s*background\s*image/i,
        /clear\s*(?:the)?\s*background\s*image/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      backgroundColor: 'background color',
      backgroundImage: 'background image'
    };
  }

  static processCommand(input, currentStyle = {}) {
    console.log('BackgroundProcessor received input:', input, 'Current style:', currentStyle);
    const lowercaseInput = input.toLowerCase();
    
    // Check for initial background color change command
    if (/^(?:change|set|modify)\s+(?:the\s+)?background\s+color$/i.test(input)) {
      return {
        type: 'PROMPT',
        message: 'What color would you like to use? You can specify:',
        options: [
          {
            text: 'Color names (e.g., blue, red, green)',
            type: 'info'
          },
          {
            text: 'Hex codes (#FF0000)',
            type: 'info'
          },
          {
            text: 'RGB values (rgb(255, 0, 0))',
            type: 'info'
          },
          {
            text: 'HSL values (hsl(0, 100%, 50%))',
            type: 'info'
          },
          {
            text: 'RGBA with opacity (rgba(255, 0, 0, 0.5))',
            type: 'info'
          }
        ],
        property: 'backgroundColor'
      };
    }

    // Handle opacity/transparency changes FIRST
    const opacityPatterns = [
      /(?:make|set)\s*(?:the|it|background)?\s*(?:a\s*)?(?:little|bit|more|less|much)?\s*(?:more|less)\s*(transparent|opaque)/i,
      /(?:increase|decrease)\s*(?:the)?\s*(?:background)?\s*opacity/i,
      /(?:make|set)\s*(?:the|it|background)?\s*opacity\s*(?:a\s*)?(?:little|bit)?\s*(higher|lower)/i
    ];

    for (const pattern of opacityPatterns) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        console.log('Matched opacity change:', match);
        
        // Get current background color and convert to RGB if it's hex
        let currentColor = currentStyle?.backgroundColor || '#0000ff';
        let currentOpacity = 1;
        let r, g, b;
        
        console.log('Current color:', currentColor);
        
        // Handle different color formats
        if (currentColor.startsWith('#')) {
          // Convert hex to RGB
          const hex = currentColor.replace('#', '');
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        } else if (currentColor.startsWith('rgba')) {
          // Extract values from rgba
          const values = currentColor.match(/[\d.]+/g).map(Number);
          r = values[0];
          g = values[1];
          b = values[2];
          currentOpacity = values[3];
        } else if (currentColor.startsWith('rgb')) {
          // Extract values from rgb
          const values = currentColor.match(/\d+/g).map(Number);
          r = values[0];
          g = values[1];
          b = values[2];
        }
        
        console.log('Parsed RGB values:', r, g, b, 'Current opacity:', currentOpacity);
        
        // Determine opacity adjustment
        let opacityChange = 0.2; // Default change amount
        
        // Handle different types of opacity changes
        if (lowercaseInput.includes('little') || lowercaseInput.includes('bit')) {
          opacityChange *= 0.5; // Smaller change for "a little" modifiers
        } else if (lowercaseInput.includes('much')) {
          opacityChange *= 1.5; // Larger change for "much" modifier
        }
        
        // Determine direction of change
        if (lowercaseInput.includes('more transparent') || 
            lowercaseInput.includes('decrease opacity') || 
            lowercaseInput.includes('opacity lower')) {
          opacityChange *= -1;
        }
        
        // Calculate new opacity
        const newOpacity = Math.max(0, Math.min(1, currentOpacity + opacityChange));
        console.log('Adjusting opacity from', currentOpacity, 'to', newOpacity);
        
        // Create new rgba color
        const newColor = `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
        console.log('New color:', newColor);
        
        return {
          style: {
            backgroundColor: newColor
          }
        };
      }
    }

    // Handle exact color changes with intensity modifiers
    const colorPattern = /(?:set|make|change)?\s*(?:the|it|background)?\s*(?:color)?\s*(?:to)?\s*(?:a\s*)?(light|dark)?\s*(blue|red|green|black|white|yellow|purple|gray|grey|#[0-9a-fA-F]{3,6}|sky|navy|forest|crimson|gold|silver)/i;
    const colorMatch = lowercaseInput.match(colorPattern);
    
    if (colorMatch) {
      const intensity = colorMatch[1] || '';
      const baseColor = colorMatch[2].toLowerCase();
      const colorKey = intensity ? `${intensity} ${baseColor}` : baseColor;
      
      console.log('Matched color:', colorKey);
      
      // Check if we have a predefined color
      if (this.colorKeywords[colorKey]) {
        console.log('Using predefined color:', this.colorKeywords[colorKey]);
        return {
          style: {
            backgroundColor: this.colorKeywords[colorKey]
          }
        };
      }
      
      // If it's a hex color, use it directly
      if (baseColor.startsWith('#')) {
        return {
          style: {
            backgroundColor: baseColor
          }
        };
      }
      
      // For any other color names, use CSS named colors
      return {
        style: {
          backgroundColor: baseColor
        }
      };
    }

    return null;
  }

  static adjustColorBrightness(color, factor) {
    console.log('Adjusting brightness for color:', color, 'with factor:', factor);
    
    // Convert color to RGB if it's a hex color
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else {
      // Handle named colors by mapping them to hex first
      const tempElement = document.createElement('div');
      tempElement.style.color = color;
      document.body.appendChild(tempElement);
      const computedColor = getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);
      
      const rgb = computedColor.match(/\d+/g).map(Number);
      [r, g, b] = rgb;
    }

    console.log('Original RGB:', r, g, b);

    // Convert to HSL for better brightness control
    const [h, s, l] = this.rgbToHsl(r, g, b);
    console.log('Original HSL:', h, s, l);

    // Adjust lightness instead of raw RGB values
    const newL = Math.max(0, Math.min(1, l + factor));
    console.log('New lightness:', newL);

    // Convert back to RGB
    const [newR, newG, newB] = this.hslToRgb(h, s, newL);
    console.log('New RGB:', newR, newG, newB);

    // Convert to hex
    const newColor = `#${Math.round(newR).toString(16).padStart(2, '0')}${
      Math.round(newG).toString(16).padStart(2, '0')}${
      Math.round(newB).toString(16).padStart(2, '0')}`;
    console.log('New color:', newColor);
    
    return newColor;
  }

  // Helper function to convert RGB to HSL
  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0; break;
      }

      h /= 6;
    }

    return [h, s, l];
  }

  // Helper function to convert HSL to RGB
  static hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
  }
} 