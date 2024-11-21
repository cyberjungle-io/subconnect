export class PatternValidator {
  constructor(context) {
    this.context = context;
    this.validityThreshold = 0.6;
    this.maxPatternAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  validatePatterns(patterns) {
    const now = Date.now();
    return Array.from(patterns.entries())
      .filter(([key, pattern]) => {
        const isValid = this.isPatternValid(pattern);
        const isRecent = (now - pattern.lastUsed) < this.maxPatternAge;
        const isFrequent = pattern.count >= 3;
        
        return isValid && isRecent && isFrequent;
      })
      .reduce((map, [key, pattern]) => {
        map.set(key, pattern);
        return map;
      }, new Map());
  }

  isPatternValid(pattern) {
    return pattern.examples.some(example => 
      this.context.findComponentById(example.componentId)
    );
  }
} 