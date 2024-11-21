export class LearningEngine {
  constructor(context) {
    this.context = context;
    this.patterns = new Map();
    this.userPreferences = new Map();
    this.commandSequences = [];
  }

  getRelevantPatterns(intent) {
    // Filter patterns based on intent and return relevant ones
    return Array.from(this.patterns.entries())
      .filter(([_, pattern]) => this.isPatternRelevant(pattern, intent))
      .reduce((map, [key, pattern]) => {
        map.set(key, pattern);
        return map;
      }, new Map());
  }

  isPatternRelevant(pattern, intent) {
    // Check if pattern matches the current intent
    if (!pattern || !intent) return false;

    const matchesType = pattern.type === intent.primary;
    const matchesComponent = !intent.componentType || 
      pattern.componentType === intent.componentType;
    const isRecent = Date.now() - pattern.lastUsed < (30 * 24 * 60 * 60 * 1000); // 30 days

    return matchesType && matchesComponent && isRecent;
  }

  learnFromCommand(command, result) {
    // Learn from successful commands
    this.updatePatterns(command);
    this.updatePreferences(command);
    this.updateSequences(command);
    
    return {
      patterns: this.analyzePatterns(),
      preferences: this.analyzePreferences(),
      sequences: this.analyzeSequences()
    };
  }

  updatePatterns(command) {
    const pattern = {
      type: command.type,
      componentType: command.componentType,
      stylePatterns: this.extractStylePatterns(command.style),
      propPatterns: this.extractPropPatterns(command.props),
      context: this.extractContextPatterns(command),
      lastUsed: Date.now()
    };

    const key = this.generatePatternKey(pattern);
    const existing = this.patterns.get(key) || { count: 0, examples: [] };
    
    this.patterns.set(key, {
      ...pattern,
      count: existing.count + 1,
      examples: [...existing.examples, command].slice(-5)
    });
  }

  generatePatternKey(pattern) {
    return `${pattern.type}_${pattern.componentType}`;
  }

  extractStylePatterns(style) {
    return style ? { ...style } : {};
  }

  extractPropPatterns(props) {
    return props ? { ...props } : {};
  }

  extractContextPatterns(command) {
    return {
      parentType: command.parentId ? 
        this.context.findComponentById(command.parentId)?.type : null,
      hasChildren: command.children?.length > 0,
      position: command.position
    };
  }

  analyzePatterns() {
    return Array.from(this.patterns.entries())
      .map(([key, pattern]) => ({
        key,
        frequency: pattern.count,
        lastUsed: pattern.lastUsed,
        confidence: this.calculatePatternConfidence(pattern)
      }));
  }

  calculatePatternConfidence(pattern) {
    const recency = Math.min(
      (Date.now() - pattern.lastUsed) / (30 * 24 * 60 * 60 * 1000), // 30 days
      1
    );
    const frequency = Math.min(pattern.count / 10, 1); // Max 10 occurrences
    
    return (recency * 0.4) + (frequency * 0.6);
  }

  analyzePreferences() {
    return Array.from(this.userPreferences.entries())
      .map(([key, value]) => ({
        key,
        value,
        frequency: this.calculatePreferenceFrequency(key)
      }));
  }

  analyzeSequences() {
    return this.commandSequences.map(sequence => ({
      commands: sequence,
      frequency: this.calculateSequenceFrequency(sequence)
    }));
  }

  calculatePreferenceFrequency(key) {
    const preference = this.userPreferences.get(key);
    return preference ? preference.count / this.getTotalCommands() : 0;
  }

  calculateSequenceFrequency(sequence) {
    return sequence.count / this.getTotalSequences();
  }

  getTotalCommands() {
    return Array.from(this.patterns.values())
      .reduce((total, pattern) => total + pattern.count, 0);
  }

  getTotalSequences() {
    return this.commandSequences.length;
  }
} 