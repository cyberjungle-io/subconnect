export class ShadowProcessor {
  static getStylePatterns() {
    return {
      boxShadow: [
        // Outer shadow patterns - more variations
        /(?:add|set|make|apply|give|create)\s*(?:a|an)?\s*(?:outer\s*)?(?:box\s*)?shadow\s*(?:that\s*is|that's|to|=|:)?\s*(subtle|medium|harsh|floating|layered)/i,
        /(?:make|set)\s*(?:it|this)?\s*(?:have\s*)?(?:a|an)?\s*(subtle|medium|harsh|floating|layered)\s*(?:outer\s*)?shadow/i,
        /(?:add|give|create)\s*(?:a|an)?\s*(subtle|medium|harsh|floating|layered)\s*(?:outer\s*)?shadow/i,
        /(?:remove|clear)\s*(?:the)?\s*(?:outer\s*)?shadow/i,
        
        // Inner shadow patterns
        /(?:add|set|make|apply|give|create)\s*(?:a|an)?\s*inner\s*shadow\s*(?:that\s*is|that's|to|=|:)?\s*(subtle|medium|deep|pressed|hollow)/i,
        /(?:make|set)\s*(?:it|this)?\s*(?:have\s*)?(?:a|an)?\s*(subtle|medium|deep|pressed|hollow)\s*inner\s*shadow/i,
        /(?:add|give|create)\s*(?:a|an)?\s*(subtle|medium|deep|pressed|hollow)\s*inner\s*shadow/i,
        /(?:remove|clear)\s*(?:the)?\s*inner\s*shadow/i,
        
        // Combined patterns
        /(?:add|set|make|apply)\s*both\s*shadows\s*(?:to|=|:)?\s*(subtle|medium)/i,
        /(?:remove|clear)\s*(?:all|both)\s*shadows/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      boxShadow: 'shadow'
    };
  }

  static getShadowPresets() {
    return {
      outer: {
        subtle: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
        medium: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)',
        harsh: '4px 4px 8px 0px rgba(0, 0, 0, 0.25)',
        floating: '0px 8px 16px -2px rgba(0, 0, 0, 0.25)',
        layered: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)'
      },
      inner: {
        subtle: 'inset 0 0 4px 0px rgba(0, 0, 0, 0.15)',
        medium: 'inset 0 0 10px 3px rgba(0, 0, 0, 0.25)',
        deep: 'inset 0 0 16px 6px rgba(0, 0, 0, 0.3)',
        pressed: 'inset 0 0 2px 1px rgba(0, 0, 0, 0.3)',
        hollow: 'inset 0 0 16px 8px rgba(0, 0, 0, 0.15)'
      }
    };
  }

  static processCommand(input) {
    console.log('ShadowProcessor received input:', input);
    const presets = this.getShadowPresets();
    const lowercaseInput = input.toLowerCase();
    
    // Handle removal commands first
    if (lowercaseInput.match(/(?:remove|clear)\s*(?:all|both)\s*shadows/i)) {
      return {
        style: {
          boxShadow: 'none'
        }
      };
    }

    // Simple pattern matching for "add a subtle shadow" type commands
    const simpleMatch = lowercaseInput.match(/(?:add|set|make|apply|give|create)\s+(?:a\s+)?(\w+)\s+(?:outer\s+)?shadow/i);
    if (simpleMatch) {
      const presetName = simpleMatch[1].toLowerCase();
      if (presets.outer[presetName]) {
        console.log(`Matched simple outer shadow pattern: ${presetName}`);
        return {
          style: {
            boxShadow: presets.outer[presetName]
          }
        };
      }
    }

    // Inner shadow pattern
    const innerMatch = lowercaseInput.match(/(?:add|set|make|apply|give|create)\s+(?:a\s+)?(\w+)\s+inner\s+shadow/i);
    if (innerMatch) {
      const presetName = innerMatch[1].toLowerCase();
      if (presets.inner[presetName]) {
        console.log(`Matched inner shadow pattern: ${presetName}`);
        return {
          style: {
            boxShadow: presets.inner[presetName]
          }
        };
      }
    }

    // Handle removal of specific shadow types
    if (lowercaseInput.match(/(?:remove|clear)\s*(?:the)?\s*(?:outer\s*)?shadow/i)) {
      return {
        style: {
          boxShadow: 'none'
        }
      };
    }

    if (lowercaseInput.match(/(?:remove|clear)\s*(?:the)?\s*inner\s*shadow/i)) {
      return {
        style: {
          boxShadow: 'none'
        }
      };
    }

    // Handle combined shadows
    const combinedMatch = lowercaseInput.match(/(?:add|set|make|apply)\s*both\s*shadows\s*(?:to|=|:)?\s*(subtle|medium)/i);
    if (combinedMatch) {
      const preset = combinedMatch[1].toLowerCase();
      return {
        style: {
          boxShadow: `${presets.outer[preset]}, ${presets.inner[preset]}`
        }
      };
    }

    return null;
  }
} 