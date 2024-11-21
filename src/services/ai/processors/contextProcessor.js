import { getStore } from '../../../utils/storeAccess';
import { IntentAnalyzer } from './intentAnalyzer';
import { SequencePredictor } from './sequencePredictor';

export class CommandContext {
  constructor() {
    const store = getStore();
    this.state = store.getState();
    this.selectedIds = this.state.editor.selectedIds;
    this.components = this.state.editor.components;
    this.history = [];
    
    // Initialize analyzers and predictors
    this.intentAnalyzer = new IntentAnalyzer(this);
    this.sequencePredictor = new SequencePredictor(this);
  }

  getTargetComponent() {
    if (!this.selectedIds.length) return null;
    return this.findComponentById(this.components, this.selectedIds[this.selectedIds.length - 1]);
  }

  findComponentById(components, id) {
    for (const component of components) {
      if (component.id === id) return component;
      if (component.children) {
        const found = this.findComponentById(component.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  findComponentsByType(type) {
    const results = [];
    const search = (components) => {
      for (const component of components) {
        if (component.type === type) results.push(component);
        if (component.children) search(component.children);
      }
    };
    search(this.components);
    return results;
  }

  findComponentByName(name) {
    const search = (components) => {
      for (const component of components) {
        if (component.props?.name?.toLowerCase() === name.toLowerCase()) {
          return component;
        }
        if (component.children) {
          const found = search(component.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.components);
  }

  getComponentPath(componentId) {
    const path = [];
    const findPath = (components) => {
      for (const component of components) {
        if (component.id === componentId) {
          path.push(component);
          return true;
        }
        if (component.children) {
          if (findPath(component.children)) {
            path.unshift(component);
            return true;
          }
        }
      }
      return false;
    };
    findPath(this.components);
    return path;
  }

  addToHistory(command) {
    this.history.push({
      command,
      timestamp: new Date().toISOString()
    });
  }

  getLastCommand() {
    return this.history[this.history.length - 1]?.command;
  }
} 