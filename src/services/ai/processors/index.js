import { validateCommand } from '../validators/validators.js';
import { executeCommand } from '../../../utils/aiCommandExecutor';
import { componentTypes, componentConfig } from '../../../components/Components/componentConfig';
import { getStore } from '../../../utils/storeAccess';
import { generateCommandFeedback, generateErrorFeedback } from '../../../utils/aiCommandFeedback';
import { parseNaturalLanguage } from './languageProcessor';
import { CommandContext } from './contextProcessor';
import { inferProperties } from './propertyInference';
import { validateComponentRelationships } from '../validators/validators.js';
import { CommandChainProcessor } from './commandChainProcessor';
import { CommandHistoryManager } from './historyManager';
import { ContextAnalyzer } from './contextAnalyzer';
import { FeedbackProcessor } from './feedbackProcessor';
import { 
  generateClarificationResponse, 
  generateChainedCommandFeedback 
} from './feedbackGenerator';
import { LayoutManager } from './layoutManager';
import { StyleInferenceEngine } from './styleInference';
import { ComponentSuggestionEngine } from './componentSuggestion';
import { ErrorRecoveryHandler } from './errorRecovery';
import { ThemeManager } from './themeManager';
import { AccessibilityAnalyzer } from './accessibilityAnalyzer';
import { PerformanceOptimizer } from './performanceOptimizer';
import { FeedbackLoop } from './feedbackLoop';
import { LearningEngine } from './learningEngine';
import { UserPreferenceAnalyzer } from './userPreferenceAnalyzer';
import { SequencePredictor } from './sequencePredictor';
import { CommandComposer } from './commandComposer';
import { RealtimeSuggestionEngine } from './realtimeSuggestionEngine';

// Add these functions before processAICommand

const determineCommandType = (message) => {
  const patterns = {
    add: /\b(add|create|insert|new)\b/i,
    modify: /\b(change|modify|update|set|make)\b/i,
    delete: /\b(delete|remove|eliminate)\b/i,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(message)) {
      console.log(`Found command type: ${type} for message: ${message}`);
      return type;
    }
  }

  // Default to 'add' for component creation
  return 'add';
};

const findContainerByName = (containerName, context) => {
  const findContainer = (components) => {
    for (const component of components) {
      // Check if this component matches the name
      if (component.props?.name?.toLowerCase() === containerName.toLowerCase() ||
          component.type.toLowerCase().includes(containerName.toLowerCase())) {
        return component.id;
      }
      
      // Check children if this component has them
      if (component.children) {
        const found = findContainer(component.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findContainer(context.components);
};

// Add a command tracking Set at the top of the file
const processedCommands = new Set();

export const processAICommand = async (message) => {
  try {
    console.log('Processing command:', message);
    
    // Generate a unique command ID based on message and timestamp
    const commandId = `${message}_${Date.now()}`;
    
    // Check if this command was already processed recently
    if (processedCommands.has(commandId)) {
      console.log('Duplicate command detected, skipping:', commandId);
      return null;
    }
    
    // Add to processed commands
    processedCommands.add(commandId);
    
    // Clear old commands (older than 1 second)
    const now = Date.now();
    processedCommands.forEach(cmd => {
      const [, timestamp] = cmd.split('_');
      if (now - Number(timestamp) > 1000) {
        processedCommands.delete(cmd);
      }
    });

    const context = new CommandContext();
    const parsedLanguage = parseNaturalLanguage(message);
    
    let command = generateCommand(message, parsedLanguage, context);
    console.log('Generated command:', command);

    // Validate command
    validateCommand(command, context);
    
    // Execute command
    const result = await executeCommand(command);
    console.log('Command execution result:', result);

    if (!result) {
      throw new Error('Failed to execute command');
    }

    return {
      message: generateCommandFeedback(command, result),
      commands: [result]
    };
  } catch (error) {
    console.error('Error in processAICommand:', error);
    throw new Error(`Failed to add component: ${error.message}`);
  }
};

const generateCommand = (message, parsedLanguage, context) => {
  const type = determineCommandType(message);
  const componentType = extractComponentType(message);

  if (!type) {
    throw new Error('Unable to determine command type');
  }

  // Ensure we're not creating duplicate commands
  return {
    type: type.toLowerCase(),
    componentType: componentType || 'FLEX_CONTAINER',
    componentId: null,
    style: {},
    props: {
      name: `${componentType || 'FLEX_CONTAINER'}_${Date.now()}`
    },
    parentId: null,
    layout: {
      direction: 'row',
      gap: '8px'
    },
    position: {}
  };
};

const extractComponentType = (message) => {
  // Convert message to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();
  
  // Look for component type mentions
  const componentMatches = Object.keys(componentTypes)
    .find(type => lowerMessage.includes(type.toLowerCase()));
    
  return componentMatches || null;
}; 