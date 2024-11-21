import { LearningEngine } from './learningEngine';
import { UserPreferenceAnalyzer } from './userPreferenceAnalyzer';
import { SequencePredictor } from './sequencePredictor';
import { parseNaturalLanguage } from './languageProcessor';
import { PatternMatcher } from './patternMatcher';
import { IntentAnalyzer } from './intentAnalyzer';
import { LearningPersistence } from './learningPersistence';
import { PatternValidator } from './patternValidator';
import { ConfidenceScorer } from './confidenceScorer';

export class CommandComposer {
  constructor(context) {
    this.context = context;
    this.learningEngine = new LearningEngine(context);
    this.preferenceAnalyzer = new UserPreferenceAnalyzer(context);
    this.sequencePredictor = new SequencePredictor(context);
    this.patternMatcher = new PatternMatcher();
    this.intentAnalyzer = new IntentAnalyzer(context);
    this.learningPersistence = new LearningPersistence();
    this.patternValidator = new PatternValidator(context);
    this.confidenceScorer = new ConfidenceScorer();
    
    this.initializeLearningData();
  }

  async initializeLearningData() {
    const savedData = await this.learningPersistence.loadLearningData();
    if (savedData) {
      this.learningEngine.loadPatterns(savedData.patterns);
      this.preferenceAnalyzer.loadPreferences(savedData.preferences);
      this.sequencePredictor.loadSequences(savedData.sequences);
    }
  }

  async composeCommand(message) {
    const intent = await this.intentAnalyzer.analyzeIntent(message);
    
    const validatedPatterns = this.patternValidator.validatePatterns(
      this.learningEngine.getRelevantPatterns(intent)
    );
    
    const patterns = Array.from(validatedPatterns.values())
      .filter(pattern => 
        this.patternMatcher.calculatePatternSimilarity(pattern, intent) > 
        this.patternMatcher.similarityThreshold
      );
    
    const preferences = this.preferenceAnalyzer.getPreferences(intent.componentType);
    const sequence = this.sequencePredictor.predictNextActions(intent);

    const enhancedCommand = this.generateEnhancedCommand(
      intent, patterns, preferences, sequence
    );
    
    enhancedCommand.confidence = this.confidenceScorer.calculateConfidence(
      enhancedCommand,
      this.context
    );

    return enhancedCommand;
  }

  generateBaseCommand(message, parsedLanguage) {
    const { matches } = parsedLanguage;
    const targetComponent = this.context.getTargetComponent();

    let command = {
      type: this.determineCommandType(message),
      componentType: null,
      componentId: targetComponent?.id,
      style: {},
      props: {},
      parentId: null,
      layout: {},
      position: {}
    };

    // Extract layout information
    if (matches.layout?.direction) {
      command.layout.direction = matches.layout.direction[1];
    }

    // Extract style information
    if (matches.style?.colors) {
      command.style.backgroundColor = matches.style.colors[0];
    }

    // Extract positioning information
    if (matches.position?.inside) {
      const containerName = matches.position.inside[1];
      command.parentId = this.findContainerByName(containerName);
    }

    return command;
  }

  determineCommandType(message) {
    const patterns = {
      add: /add|create|insert|new/i,
      modify: /change|modify|update|set|make/i,
      delete: /delete|remove|eliminate/i,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(message)) {
        return type;
      }
    }

    return 'modify';
  }

  findContainerByName(containerName) {
    const findContainer = (components) => {
      for (const component of components) {
        if (component.props?.name?.toLowerCase() === containerName.toLowerCase() ||
            component.type.toLowerCase().includes(containerName.toLowerCase())) {
          return component.id;
        }
        
        if (component.children) {
          const found = findContainer(component.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findContainer(this.context.components);
  }

  generateEnhancedCommand(intent, patterns, preferences, sequence) {
    return {
      ...intent,
      style: this.mergeStyles(intent.style, preferences.styles),
      props: this.mergeProps(intent.props, preferences.props),
      layout: this.enhanceLayout(intent.layout, patterns.layout),
      predictions: sequence.map(seq => ({
        command: seq.command,
        confidence: seq.confidence
      }))
    };
  }

  mergeStyles(intentStyles, preferredStyles) {
    return {
      ...preferredStyles,  // Base styles from preferences
      ...intentStyles      // Explicit styles from intent take precedence
    };
  }

  mergeProps(intentProps, preferredProps) {
    return {
      ...preferredProps,   // Base props from preferences
      ...intentProps       // Explicit props from intent take precedence
    };
  }

  enhanceLayout(intentLayout, patternLayout) {
    return {
      ...patternLayout,    // Layout patterns from learning
      ...intentLayout      // Explicit layout from intent takes precedence
    };
  }
} 