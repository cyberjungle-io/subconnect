export class CommandHistoryManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  addCommand(command, result) {
    // Remove any forward history if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    this.history.push({ command, result, timestamp: new Date() });
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex >= 0) {
      const { command } = this.history[this.currentIndex];
      this.currentIndex--;
      return this.generateUndoCommand(command);
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex].command;
    }
    return null;
  }

  generateUndoCommand(command) {
    switch (command.type) {
      case 'add':
        return { type: 'delete', componentId: command.result.componentId };
      case 'delete':
        return { type: 'add', ...command.savedState };
      case 'modify':
        return { type: 'modify', componentId: command.componentId, ...command.previousState };
      default:
        return null;
    }
  }
} 