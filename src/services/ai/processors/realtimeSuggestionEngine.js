import { LearningEngine } from './learningEngine';
import { ConfidenceScorer } from './confidenceScorer';
import { IntentAnalyzer } from './intentAnalyzer';

export class RealtimeSuggestionEngine {
  constructor(context) {
    this.context = context;
    this.learningEngine = new LearningEngine(context);
    this.confidenceScorer = new ConfidenceScorer();
    this.intentAnalyzer = new IntentAnalyzer(context);
    this.minConfidence = 0.6;
    this.maxSuggestions = 3;
  }

  generateRealtimeSuggestions(partialCommand) {
    try {
      const suggestions = [];
      
      // Get command completion suggestions
      suggestions.push(...this.getCommandCompletions(partialCommand));
      
      // Get next action suggestions
      suggestions.push(...this.getNextActionSuggestions(partialCommand));
      
      // Filter and sort by confidence
      return suggestions
        .filter(suggestion => suggestion.confidence > this.minConfidence)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, this.maxSuggestions);
    } catch (error) {
      console.error('Error generating realtime suggestions:', error);
      return [];
    }
  }

  getCommandCompletions(partial) {
    const patterns = this.learningEngine.patterns;
    return Array.from(patterns.values())
      .filter(pattern => this.matchesPartialCommand(pattern, partial))
      .map(pattern => ({
        type: 'completion',
        command: this.generateCompletion(pattern, partial),
        confidence: this.confidenceScorer.calculateConfidence(pattern, this.context)
      }));
  }

  getNextActionSuggestions(partial) {
    const intent = this.intentAnalyzer.analyzeIntent(partial);
    return this.context.sequencePredictor
      .predictNextActions(intent)
      .map(prediction => ({
        type: 'nextAction',
        command: prediction.command,
        confidence: prediction.confidence,
        context: prediction.context
      }));
  }

  matchesPartialCommand(pattern, partial) {
    if (typeof partial === 'string') {
      return pattern.type?.toLowerCase().includes(partial.toLowerCase()) ||
             pattern.componentType?.toLowerCase().includes(partial.toLowerCase());
    }
    return pattern.type?.startsWith(partial.type) ||
           pattern.componentType?.toLowerCase().includes(partial.toLowerCase());
  }

  generateCompletion(pattern, partial) {
    return {
      ...pattern.examples[pattern.examples.length - 1],
      partial: true,
      originalPattern: pattern
    };
  }
} 