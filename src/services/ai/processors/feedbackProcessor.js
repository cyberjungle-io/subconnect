export class FeedbackProcessor {
  constructor(context) {
    this.context = context;
    this.feedbackPatterns = {
      correction: /no,?\s*(I|that's)\s*(meant|wanted|mean)/i,
      confirmation: /yes,?\s*(that's|is)\s*(correct|right|what I wanted)/i,
      clarification: /what|which|how|can you|could you/i
    };
  }

  processFeedback(message, lastCommand) {
    // Check if message is feedback about previous command
    for (const [type, pattern] of Object.entries(this.feedbackPatterns)) {
      if (pattern.test(message)) {
        return this.handleFeedback(type, message, lastCommand);
      }
    }
    return null;
  }

  handleFeedback(type, message, lastCommand) {
    switch (type) {
      case 'correction':
        return this.handleCorrection(message, lastCommand);
      case 'confirmation':
        return this.handleConfirmation(message, lastCommand);
      case 'clarification':
        return this.handleClarification(message, lastCommand);
      default:
        return null;
    }
  }

  handleCorrection(message, lastCommand) {
    // Generate corrective command based on feedback
    const correctedCommand = {
      ...lastCommand,
      isCorrection: true
    };

    // Update command based on correction message
    if (/meant\s+(.+?)\s+instead/i.test(message)) {
      const correction = message.match(/meant\s+(.+?)\s+instead/i)[1];
      return this.generateCorrectedCommand(correction, lastCommand);
    }

    return correctedCommand;
  }

  handleConfirmation(message, lastCommand) {
    // Store successful command pattern
    this.context.addToHistory({
      ...lastCommand,
      wasSuccessful: true
    });
    return null;
  }

  handleClarification(message, lastCommand) {
    // Generate clarification response
    return {
      type: 'clarification',
      originalCommand: lastCommand,
      clarificationOptions: this.generateClarificationOptions(message, lastCommand)
    };
  }

  generateClarificationOptions(message, lastCommand) {
    const options = [];
    
    if (/which component/i.test(message)) {
      options.push({
        type: 'componentList',
        components: this.context.findComponentsByType(lastCommand.componentType)
      });
    }

    if (/what (style|property)/i.test(message)) {
      options.push({
        type: 'propertyList',
        properties: Object.keys(lastCommand.style || {})
          .concat(Object.keys(lastCommand.props || {}))
      });
    }

    return options;
  }
} 