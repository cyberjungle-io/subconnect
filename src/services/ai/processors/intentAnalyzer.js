export class IntentAnalyzer {
  constructor(context) {
    this.context = context;
    this.intentPatterns = new Map();
  }

  analyzeIntent(message, command = {}) {
    try {
      const intent = {
        primary: this.extractPrimaryIntent(message),
        modifiers: this.extractModifiers(message),
        context: this.extractContextualIntent(command),
        confidence: this.calculateIntentConfidence(message)
      };

      this.updateIntentPatterns(intent);
      return intent;
    } catch (error) {
      console.error('Error analyzing intent:', error);
      return {
        primary: 'unknown',
        modifiers: [],
        context: {},
        confidence: 0
      };
    }
  }

  extractPrimaryIntent(message) {
    const intents = {
      creation: /create|add|new|insert/i,
      modification: /change|modify|update|adjust/i,
      deletion: /delete|remove|eliminate/i,
      styling: /style|color|size|appearance/i,
      layout: /arrange|move|position|align/i
    };

    return Object.entries(intents)
      .find(([_, pattern]) => pattern.test(message))?.[0] || 'unknown';
  }

  extractModifiers(message) {
    const modifierPatterns = {
      size: /(small|medium|large|tiny|huge)/i,
      color: /(red|blue|green|yellow|black|white)/i,
      position: /(top|bottom|left|right|center)/i,
      style: /(bold|italic|underline)/i,
      quantity: /(\d+)/,
      urgency: /(urgent|important|critical)/i
    };

    return Object.entries(modifierPatterns)
      .reduce((acc, [type, pattern]) => {
        const match = message.match(pattern);
        if (match) {
          acc.push({ type, value: match[1].toLowerCase() });
        }
        return acc;
      }, []);
  }

  extractContextualIntent(command) {
    return {
      selectedComponents: this.context.selectedIds,
      recentCommands: this.context.history.slice(-3),
      currentLayout: this.analyzeCurrentLayout(),
      componentType: command.componentType || null
    };
  }

  calculateIntentConfidence(message) {
    const matches = this.findPatternMatches(message);
    return matches.confidence || 0.5; // Default confidence
  }

  findPatternMatches(message) {
    let confidence = 0;
    const matches = [];

    // Check against stored patterns
    this.intentPatterns.forEach((pattern, key) => {
      if (pattern.regex.test(message)) {
        matches.push({ pattern: key, score: pattern.weight });
        confidence += pattern.weight;
      }
    });

    return {
      matches,
      confidence: Math.min(confidence, 1) // Normalize to max 1
    };
  }

  updateIntentPatterns(intent) {
    // Update pattern weights based on successful intents
    const key = `${intent.primary}_${intent.modifiers.map(m => m.type).join('_')}`;
    const existing = this.intentPatterns.get(key) || { weight: 0.5, count: 0 };
    
    this.intentPatterns.set(key, {
      ...existing,
      count: existing.count + 1,
      weight: Math.min(existing.weight + 0.1, 1),
      lastUsed: Date.now()
    });
  }

  analyzeCurrentLayout() {
    // Analyze the current component structure
    return {
      depth: this.calculateLayoutDepth(this.context.components),
      componentCount: this.countComponents(this.context.components),
      lastModified: Date.now()
    };
  }

  calculateLayoutDepth(components, depth = 0) {
    if (!components || !components.length) return depth;
    const childDepths = components
      .map(comp => this.calculateLayoutDepth(comp.children, depth + 1));
    return Math.max(depth, ...childDepths);
  }

  countComponents(components) {
    if (!components) return 0;
    return components.reduce((count, comp) => 
      count + 1 + this.countComponents(comp.children), 0);
  }
} 