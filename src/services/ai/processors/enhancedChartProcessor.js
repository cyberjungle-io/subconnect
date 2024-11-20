import { chartPatterns } from '../services/ai/processors/chartPatternMatcher';
import { processNaturalLanguage } from '../../../utils/nlpUtils';

export class EnhancedChartProcessor {
  constructor() {
    this.context = {
      lastCommand: null,
      commandHistory: [],
      activeModifications: new Set()
    };
  }

  processCommand(command, currentConfig) {
    // Store command in history
    this.context.commandHistory.push({
      command,
      timestamp: Date.now()
    });

    // Process command with context awareness
    const result = this.processWithContext(command, currentConfig);

    // Update context
    this.context.lastCommand = command;
    
    return result;
  }

  processWithContext(command, currentConfig) {
    // Analyze command intent
    const intent = this.analyzeIntent(command);
    
    // Process based on intent
    switch (intent.type) {
      case 'MODIFY_CHART_TYPE':
        return this.processChartTypeModification(intent, currentConfig);
      
      case 'MODIFY_DATA':
        return this.processDataModification(intent, currentConfig);
      
      case 'MODIFY_STYLE':
        return this.processStyleModification(intent, currentConfig);
      
      case 'MODIFY_AXES':
        return this.processAxesModification(intent, currentConfig);
      
      case 'COMPOUND_MODIFICATION':
        return this.processCompoundModification(intent, currentConfig);
      
      default:
        return null;
    }
  }

  analyzeIntent(command) {
    // Use NLP to determine command intent
    const nlpResult = processNaturalLanguage(command);
    
    // Use chartPatterns to enhance intent recognition
    const matchedPattern = Object.entries(chartPatterns).find(([category, patterns]) => 
      patterns.some(pattern => this.matchesPattern(command, pattern))
    );
    
    return {
      type: matchedPattern ? matchedPattern[0].toUpperCase() : nlpResult.intentType,
      parameters: nlpResult.parameters,
      confidence: nlpResult.confidence
    };
  }

  matchesPattern(command, pattern) {
    // Convert pattern to regex by replacing {placeholder} with .*
    const regexPattern = pattern.replace(/\{[^}]+\}/g, '.*');
    return new RegExp(regexPattern, 'i').test(command);
  }

  suggestImprovements(config) {
    const suggestions = [];

    // Analyze current configuration
    if (!config.title) {
      suggestions.push({
        type: 'MISSING_TITLE',
        message: 'Consider adding a title to improve chart clarity',
        example: 'set title to "Sales Overview"'
      });
    }

    if (!config.showLegend && config.dataKeys?.length > 1) {
      suggestions.push({
        type: 'MISSING_LEGEND',
        message: 'Multiple data series detected. Consider adding a legend',
        example: 'show legend at bottom'
      });
    }

    // Add more sophisticated suggestions based on data analysis
    if (config.data?.length > 0) {
      const dataAnalysis = this.analyzeData(config.data);
      suggestions.push(...this.generateDataBasedSuggestions(dataAnalysis));
    }

    return suggestions;
  }

  analyzeData(data) {
    // Implement sophisticated data analysis
    // Return insights about the data structure and patterns
  }

  generateDataBasedSuggestions(analysis) {
    // Generate intelligent suggestions based on data analysis
  }
} 