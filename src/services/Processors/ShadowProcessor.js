export class ShadowProcessor {
  static pendingCustomization = null;

  static getStylePatterns() {
    return {
      boxShadow: [
        // Basic outer shadow patterns - Added first
        /(?:can you |please |could you )?(?:add|give|create|make|set|apply)\s*(?:a|an|the)?\s*outer\s*shadow/i,
        /(?:i want|i need|i'd like|i would like)\s*(?:a|an|the)?\s*outer\s*shadow/i,

        // Natural language patterns for outer shadows with intensity
        /(?:can you |please |could you )?(?:add|give|create|make|set|apply)\s*(?:a|an|the)?\s*(?:light|soft|subtle|medium|harsh|floating|layered)\s*(?:outer\s*)?(?:box\s*)?shadow(?:\s*effect)?/i,
        /(?:i want|i need|i'd like|i would like)\s*(?:a|an|the)?\s*(?:light|soft|subtle|medium|harsh|floating|layered)\s*(?:outer\s*)?(?:box\s*)?shadow(?:\s*effect)?/i,
        
        // Natural language patterns for inner shadows
        /(?:can you |please |could you )?(?:add|give|create|make|set|apply)\s*(?:a|an|the)?\s*inner\s*shadow(?:\s*effect)?(?:\s*that\s*(?:looks|is|appears))?\s*(?:to be|to look)?\s*(subtle|medium|deep|pressed|hollow)/i,
        /(?:i want|i need|i'd like|i would like)\s*(?:a|an|the)?\s*inner\s*shadow(?:\s*effect)?(?:\s*that\s*(?:looks|is|appears))?\s*(?:to be|to look)?\s*(subtle|medium|deep|pressed|hollow)/i,
        /(?:make|set)\s*(?:it|this)?\s*(?:look|appear)?\s*(?:like\s*it[''']?s)?\s*(pressed|pushed|indented|sunken|depressed|inset)/i,

        // Combined shadow patterns
        /(?:can you |please |could you )?(?:add|give|create|make|set|apply)\s*both\s*(?:inner\s*and\s*outer\s*)?shadows(?:\s*that\s*(?:are|look))?\s*(subtle|medium)/i,
        /(?:i want|i need|i'd like|i would like)\s*both\s*(?:inner\s*and\s*outer\s*)?shadows(?:\s*that\s*(?:are|look))?\s*(subtle|medium)/i,

        // Removal patterns
        /(?:can you |please |could you )?(?:remove|clear|delete|get rid of)\s*(?:all|both|the|any)?\s*shadows?/i,
        /(?:i want|i need|i'd like|i would like)\s*(?:to\s*)?(?:remove|clear|delete|get rid of)\s*(?:all|both|the|any)?\s*shadows?/i,
        /(?:make|set)\s*(?:it|this)?\s*(?:have)?\s*no\s*shadows?/i,

        // Intensity modification patterns
        /(?:can you |please |could you )?(?:make|set)\s*(?:the|all|it)?\s*(?:shadows?\s*)?(stronger|weaker|lighter|darker|more intense|less intense|more|less)/i,
        /(?:increase|decrease)\s*(?:the)?\s*(?:shadow\s*)?(?:intensity|strength|effect|darkness)/i
      ]
    };
  }

  // Update naturalLanguageMap to include light/soft variations
  static naturalLanguageMap = {
    // Outer shadow mappings
    'light': 'subtle',
    'soft': 'subtle',
    'floating': 'floating',
    'elevated': 'floating',
    'raised': 'medium',
    'lifted': 'floating',
    'popped': 'harsh',
    'standing out': 'harsh',
    
    // Inner shadow mappings
    'pressed': 'pressed',
    'pushed': 'pressed',
    'indented': 'deep',
    'sunken': 'deep',
    'depressed': 'deep',
    'inset': 'medium',
    
    // Intensity modifiers
    'stronger': 'harsh',
    'weaker': 'subtle',
    'lighter': 'subtle',
    'darker': 'harsh',
    'more intense': 'harsh',
    'less intense': 'subtle',
    'more': 'harsh',
    'less': 'subtle',
    'increase': 'harsh',
    'decrease': 'subtle',
    'higher': 'harsh',
    'lower': 'subtle'
  };

  static getPropertyNames() {
    return {
      boxShadow: 'shadow'
    };
  }

  static getShadowPresets() {
    return {
      outer: {
        subtle: {
          x: '0px',
          y: '2px',
          blur: '4px',
          spread: '0px',
          color: '#000000',
          opacity: 0.15,
          description: 'A light, small shadow'
        },
        medium: {
          x: '0px',
          y: '4px',
          blur: '8px',
          spread: '0px',
          color: '#000000',
          opacity: 0.2,
          description: 'A balanced, medium-sized shadow'
        },
        harsh: {
          x: '4px',
          y: '4px',
          blur: '8px',
          spread: '0px',
          color: '#000000',
          opacity: 0.25,
          description: 'A stronger, more visible shadow'
        },
        floating: {
          x: '0px',
          y: '8px',
          blur: '16px',
          spread: '-2px',
          color: '#000000',
          opacity: 0.25,
          description: 'An elevated effect with negative spread'
        },
        layered: {
          x: '0px',
          y: '2px',
          blur: '4px',
          spread: '0px',
          color: '#000000',
          opacity: 0.2,
          description: 'A subtle, close shadow good for cards'
        }
      },
      inner: {
        subtle: {
          blur: '4px',
          spread: '0px',
          color: '#000000',
          opacity: 0.15,
          description: 'A light inner shadow'
        },
        medium: {
          blur: '10px',
          spread: '3px',
          color: '#000000',
          opacity: 0.25,
          description: 'A balanced inner shadow'
        },
        deep: {
          blur: '16px',
          spread: '6px',
          color: '#000000',
          opacity: 0.3,
          description: 'A pronounced inner shadow'
        },
        pressed: {
          blur: '2px',
          spread: '1px',
          color: '#000000',
          opacity: 0.3,
          description: 'A tight inner shadow for pressed states'
        },
        hollow: {
          blur: '16px',
          spread: '8px',
          color: '#000000',
          opacity: 0.15,
          description: 'A soft, spread-out inner shadow'
        }
      }
    };
  }

  static processCommand(input, currentStyle = {}) {
    console.log('ShadowProcessor received input:', input, 'Current style:', currentStyle);
    const lowercaseInput = input.toLowerCase();

    // Check if we have a pending customization and are receiving a value
    if (this.pendingCustomization) {
      const { isInner, property } = this.pendingCustomization;
      const value = input.trim();
      this.pendingCustomization = null; // Clear pending state

      // Generate the shadow string with the new value
      const currentShadow = currentStyle.boxShadow || 'none';
      const shadowParts = currentShadow.split(',').map(part => part.trim());
      
      // Find the relevant shadow (inner or outer)
      const shadowIndex = isInner ? 
        shadowParts.findIndex(part => part.includes('inset')) :
        shadowParts.findIndex(part => !part.includes('inset'));
      
      if (shadowIndex === -1) {
        // If no existing shadow of this type, create a new one
        const preset = isInner ? this.getShadowPresets().inner.medium : this.getShadowPresets().outer.medium;
        const newShadow = { ...preset };

        // Update the specified property
        switch (property) {
          case 'xOffset':
            newShadow.x = value;
            break;
          case 'yOffset':
            newShadow.y = value;
            break;
          case 'blur':
            newShadow.blur = value;
            break;
          case 'spread':
            newShadow.spread = value;
            break;
          case 'color':
            newShadow.color = value;
            break;
          case 'opacity':
            newShadow.opacity = parseFloat(value);
            break;
        }

        const shadowString = this.generateShadowString(newShadow, isInner);
        return {
          style: {
            boxShadow: shadowString
          }
        };
      }

      // Modify existing shadow
      const shadowValues = this.parseShadowString(shadowParts[shadowIndex]);
      
      // Update the specified property
      switch (property) {
        case 'xOffset':
          shadowValues.x = value;
          break;
        case 'yOffset':
          shadowValues.y = value;
          break;
        case 'blur':
          shadowValues.blur = value;
          break;
        case 'spread':
          shadowValues.spread = value;
          break;
        case 'color':
          shadowValues.color = value;
          break;
        case 'opacity':
          shadowValues.opacity = parseFloat(value);
          break;
      }

      shadowParts[shadowIndex] = this.generateShadowString(shadowValues, isInner);
      
      return {
        style: {
          boxShadow: shadowParts.join(', ')
        }
      };
    }

    // Handle customization commands
    if (lowercaseInput.includes('customize')) {
      const isInner = lowercaseInput.includes('inner');
      const isOuter = lowercaseInput.includes('outer');

      let property = null;
      let example = '';
      let range = '';

      if (lowercaseInput.includes('x-offset')) {
        property = 'xOffset';
        example = '4px';
        range = '0px to 20px';
      }
      else if (lowercaseInput.includes('y-offset')) {
        property = 'yOffset';
        example = '4px';
        range = '0px to 20px';
      }
      else if (lowercaseInput.includes('blur')) {
        property = 'blur';
        example = '8px';
        range = '0px to 30px';
      }
      else if (lowercaseInput.includes('spread')) {
        property = 'spread';
        example = '2px';
        range = '-10px to 20px';
      }
      else if (lowercaseInput.includes('color')) {
        property = 'color';
      }
      else if (lowercaseInput.includes('opacity')) {
        property = 'opacity';
        example = '0.3';
        range = '0 to 1';
      }

      if (property) {
        // Store the customization state
        this.pendingCustomization = { isInner, property };

        return {
          type: 'PROMPT',
          message: `Enter ${property} value:`,
          needsMoreInfo: true,
          property: `${isInner ? 'inner' : 'outer'}Shadow${property.charAt(0).toUpperCase() + property.slice(1)}`,
          options: property === 'color' ? [
            { text: 'Color formats accepted:', type: 'info' },
            { text: '• Color names (e.g., black, gray)', type: 'info' },
            { text: '• Hex codes (#000000)', type: 'info' },
            { text: '• RGB values (rgb(0,0,0))', type: 'info' }
          ] : [
            { text: `Example: ${example}`, type: 'info' },
            { text: `Common range: ${range}`, type: 'info' },
            { text: property === 'opacity' ? 'Enter a value between 0 and 1' : 'Enter a value in pixels (px)' , type: 'info' }
          ]
        };
      }
    }

    // Handle outer shadow presets
    for (const [presetName, preset] of Object.entries(this.getShadowPresets().outer)) {
      const pattern = new RegExp(`add\\s+${presetName}\\s+outer\\s+shadow`, 'i');
      if (pattern.test(lowercaseInput)) {
        return {
          style: {
            boxShadow: this.generateShadowString(preset)
          }
        };
      }
    }

    // Handle inner shadow presets
    for (const [presetName, preset] of Object.entries(this.getShadowPresets().inner)) {
      const pattern = new RegExp(`add\\s+${presetName}\\s+inner\\s+shadow`, 'i');
      if (pattern.test(lowercaseInput)) {
        return {
          style: {
            boxShadow: this.generateShadowString(preset, true)
          }
        };
      }
    }

    // Handle remove shadow command
    if (lowercaseInput.includes('remove shadow')) {
      return {
        style: {
          boxShadow: 'none'
        }
      };
    }

    return null;
  }

  static generateShadowString(shadow, isInner = false) {
    const { x = '0px', y = '0px', blur, spread, color, opacity } = shadow;
    const rgba = color.startsWith('rgba') ? color : `rgba(0, 0, 0, ${opacity})`;
    return isInner 
      ? `inset 0 0 ${blur} ${spread} ${rgba}`
      : `${x} ${y} ${blur} ${spread} ${rgba}`;
  }

  static parseShadowString(shadowString) {
    const parts = shadowString.trim().split(' ');
    const isInner = parts[0] === 'inset';
    const startIndex = isInner ? 1 : 0;

    return {
      x: parts[startIndex] || '0px',
      y: parts[startIndex + 1] || '0px',
      blur: parts[startIndex + 2] || '0px',
      spread: parts[startIndex + 3] || '0px',
      color: parts.slice(startIndex + 4).join(' ') || 'rgba(0, 0, 0, 0.2)'
    };
  }

  // Helper method to get current shadow style
  static getCurrentShadowStyle(currentStyle) {
    if (!currentStyle?.boxShadow || currentStyle.boxShadow === 'none') {
      return null;
    }
    return currentStyle.boxShadow;
  }

  // Helper method to determine current preset level
  static getCurrentPresetLevel(currentShadow) {
    if (!currentShadow || currentShadow === 'none') return null;
    
    // Extract opacity from current shadow
    const opacityMatch = currentShadow.match(/rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/);
    if (!opacityMatch) return 'medium';
    
    const currentOpacity = parseFloat(opacityMatch[1]);
    
    // Determine preset based on opacity
    if (currentOpacity <= 0.15) return 'subtle';
    if (currentOpacity <= 0.25) return 'medium';
    if (currentOpacity <= 0.35) return 'harsh';
    if (currentOpacity <= 0.45) return 'darker';
    return 'darkest';
  }

  // Helper method to get next intensity level
  static getNextIntensityLevel(currentPreset, intensityTerm) {
    // Define shadow intensity presets with opacity and blur/spread values
    const intensityPresets = {
      subtle: {
        opacity: 0.15,
        blur: 4,
        spread: 0,
        y: 2
      },
      medium: {
        opacity: 0.25,
        blur: 8,
        spread: 0,
        y: 4
      },
      harsh: {
        opacity: 0.35,
        blur: 12,
        spread: 2,
        y: 6
      },
      darker: {
        opacity: 0.45,
        blur: 16,
        spread: 4,
        y: 8
      },
      darkest: {
        opacity: 0.6,
        blur: 20,
        spread: 6,
        y: 10
      }
    };

    // Get current values or default to medium
    const currentValues = intensityPresets[currentPreset] || intensityPresets.medium;
    
    // Determine direction of change
    const isIncreasing = intensityTerm.includes('darker') || 
                        intensityTerm.includes('stronger') || 
                        intensityTerm.includes('more');

    // Get next preset based on direction
    const presetOrder = ['subtle', 'medium', 'harsh', 'darker', 'darkest'];
    const currentIndex = presetOrder.indexOf(currentPreset);
    const nextIndex = isIncreasing 
      ? Math.min(currentIndex + 1, presetOrder.length - 1)
      : Math.max(currentIndex - 1, 0);
    
    const nextPreset = presetOrder[nextIndex];
    const nextValues = intensityPresets[nextPreset];

    // Generate the shadow value
    return `0px ${nextValues.y}px ${nextValues.blur}px ${nextValues.spread}px rgba(0, 0, 0, ${nextValues.opacity})`;
  }
} 