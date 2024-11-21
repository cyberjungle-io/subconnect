import { parseNaturalLanguage } from './languageProcessor';
import { generateCommand } from './commandGenerator';
import { executeCommand } from '../../../utils/aiCommandExecutor';

export class CommandChainProcessor {
  constructor(context) {
    this.context = context;
    this.commands = [];
  }

  parseChainedCommands(message) {
    // Split on common conjunctions and command separators
    const commandStrings = message.split(/(?:,\s*(?:and|then)?\s+|\s+and\s+|\s+then\s+)/i)
      .filter(cmd => cmd.trim().length > 0);

    return commandStrings.map(cmdStr => {
      const parsedLanguage = parseNaturalLanguage(cmdStr);
      return generateCommand(cmdStr, parsedLanguage, this.context);
    });
  }

  async executeChain(commands) {
    const results = [];
    let lastResult = null;

    for (const command of commands) {
      // Update command based on previous result
      if (lastResult?.componentId) {
        command.parentId = command.parentId || lastResult.componentId;
      }

      const result = await executeCommand(command, this.context);
      results.push(result);
      lastResult = result;
    }

    return results;
  }

  processConditionalCommands(message) {
    const conditionalPatterns = {
      if: /if\s+([^,]+),\s+then\s+(.+)/i,
      unless: /unless\s+([^,]+),\s+(.+)/i,
      when: /when\s+([^,]+),\s+(.+)/i
    };

    for (const [type, pattern] of Object.entries(conditionalPatterns)) {
      const match = message.match(pattern);
      if (match) {
        const [_, condition, action] = match;
        return this.evaluateCondition(condition, action);
      }
    }

    return null;
  }

  evaluateCondition(condition, action) {
    // Check component existence
    if (/exists?/.test(condition)) {
      const componentName = condition.match(/([a-zA-Z\s]+)\s+exists?/i)[1];
      const exists = this.context.findComponentByName(componentName);
      if (exists) {
        return this.parseChainedCommands(action);
      }
    }

    // Check component state
    if (/is\s+(empty|full|visible|hidden)/.test(condition)) {
      // Implement state checking logic
    }

    return null;
  }
} 