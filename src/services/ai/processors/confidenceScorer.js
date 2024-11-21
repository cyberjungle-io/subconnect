export class ConfidenceScorer {
  constructor() {
    this.weights = {
      patternMatch: 0.3,
      userPreference: 0.2,
      contextMatch: 0.2,
      sequenceMatch: 0.2,
      recentUsage: 0.1
    };
  }

  calculateConfidence(prediction, context) {
    return {
      patternMatch: this.scorePatternMatch(prediction),
      userPreference: this.scoreUserPreference(prediction),
      contextMatch: this.scoreContextMatch(prediction, context),
      sequenceMatch: this.scoreSequenceMatch(prediction),
      recentUsage: this.scoreRecentUsage(prediction),
      overall: this.calculateOverallScore(prediction, context)
    };
  }

  scorePatternMatch(prediction) {
    if (!prediction) return 0;
    // Score based on how well the prediction matches known patterns
    return prediction.frequency ? Math.min(prediction.frequency / 10, 1) : 0.5;
  }

  scoreUserPreference(prediction) {
    if (!prediction) return 0;
    // Score based on user's historical preferences
    return prediction.userPreference ? prediction.userPreference : 0.5;
  }

  scoreContextMatch(prediction, context) {
    if (!prediction || !context) return 0;
    // Score based on current context match
    return prediction.context ? 0.7 : 0.3;
  }

  scoreSequenceMatch(prediction) {
    if (!prediction) return 0;
    // Score based on command sequence patterns
    return prediction.sequence ? prediction.sequence.confidence : 0.5;
  }

  scoreRecentUsage(prediction) {
    if (!prediction || !prediction.lastUsed) return 0;
    // Score based on how recently the pattern was used
    const daysSinceLastUse = (Date.now() - prediction.lastUsed) / (24 * 60 * 60 * 1000);
    return Math.max(0, 1 - (daysSinceLastUse / 30)); // Decay over 30 days
  }

  calculateOverallScore(prediction, context) {
    if (!prediction) return 0;
    
    return Object.entries(this.weights)
      .reduce((score, [key, weight]) => {
        const methodName = `score${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        return score + (this[methodName](prediction, context) * weight);
      }, 0);
  }
} 