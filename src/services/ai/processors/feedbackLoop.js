export class FeedbackLoop {
  constructor(context) {
    this.context = context;
    this.successfulPatterns = new Map();
    this.rejectedSuggestions = new Map();
  }

  recordCommandSuccess(command, result) {
    const pattern = this.extractPattern(command);
    this.successfulPatterns.set(pattern, {
      count: (this.successfulPatterns.get(pattern)?.count || 0) + 1,
      lastUsed: Date.now(),
      examples: [...(this.successfulPatterns.get(pattern)?.examples || []), command].slice(-5)
    });
  }

  recordSuggestionRejection(suggestion) {
    const key = this.getSuggestionKey(suggestion);
    this.rejectedSuggestions.set(key, {
      count: (this.rejectedSuggestions.get(key)?.count || 0) + 1,
      lastRejected: Date.now()
    });
  }

  shouldSuggest(suggestion) {
    const key = this.getSuggestionKey(suggestion);
    const rejectionData = this.rejectedSuggestions.get(key);
    return !rejectionData || rejectionData.count < 3;
  }

  extractPattern(command) {
    return JSON.stringify({
      type: command.type,
      componentType: command.componentType,
      styleKeys: Object.keys(command.style),
      propKeys: Object.keys(command.props)
    });
  }

  getSuggestionKey(suggestion) {
    return JSON.stringify({
      type: suggestion.type,
      componentType: suggestion.componentType,
      description: suggestion.description
    });
  }
} 