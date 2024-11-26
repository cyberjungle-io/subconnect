export class ShadowProcessor {
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
        subtle: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
        medium: '0px 4px 8px 0px rgba(0, 0, 0, 0.25)',
        harsh: '0px 6px 12px 0px rgba(0, 0, 0, 0.35)',
        darker: '0px 8px 16px 0px rgba(0, 0, 0, 0.45)',
        darkest: '0px 10px 20px 0px rgba(0, 0, 0, 0.6)'
      },
      inner: {
        subtle: 'inset 0 0 4px 0px rgba(0, 0, 0, 0.15)',
        medium: 'inset 0 0 10px 3px rgba(0, 0, 0, 0.25)',
        deep: 'inset 0 0 16px 6px rgba(0, 0, 0, 0.35)',
        pressed: 'inset 0 0 2px 1px rgba(0, 0, 0, 0.3)',
        hollow: 'inset 0 0 16px 8px rgba(0, 0, 0, 0.15)'
      }
    };
  }

  static processCommand(input, currentStyle = {}) {
    console.log('ShadowProcessor received input:', input, 'Current style:', currentStyle);
    const lowercaseInput = input.toLowerCase();

    // Handle intensity modifications
    const intensityMatch = lowercaseInput.match(/(?:make|set)\s*(?:it|the shadow|the outer shadow)?\s*(darker|lighter|stronger|weaker)/i);
    if (intensityMatch) {
      const currentShadow = this.getCurrentShadowStyle(currentStyle);
      if (!currentShadow) {
        // If no shadow exists, add a medium outer shadow first
        return {
          style: {
            boxShadow: this.getShadowPresets().outer.medium
          }
        };
      }

      const isInnerShadow = currentShadow.includes('inset');
      const currentPreset = this.getCurrentPresetLevel(currentShadow);
      const intensityTerm = intensityMatch[1];

      // Get the next shadow value based on intensity
      const nextShadow = this.getNextIntensityLevel(currentPreset, intensityTerm);
      
      return {
        style: {
          boxShadow: isInnerShadow ? `inset ${nextShadow}` : nextShadow
        }
      };
    }

    // Handle outer shadow commands
    if (lowercaseInput.includes('outer shadow') || 
        (lowercaseInput.includes('shadow') && !lowercaseInput.includes('inner'))) {
      return {
        style: {
          boxShadow: this.getShadowPresets().outer.medium
        }
      };
    }

    // Rest of the existing processCommand code...
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