export class ErrorRecoveryHandler {
  constructor(context) {
    this.context = context;
  }

  handleError(error, command) {
    const recovery = {
      suggestions: [],
      alternativeCommands: []
    };

    switch (error.type) {
      case 'InvalidParent':
        recovery.suggestions.push(this.suggestValidParent(command));
        break;
      case 'StyleConflict':
        recovery.suggestions.push(this.resolveStyleConflict(command));
        break;
      case 'InvalidNesting':
        recovery.suggestions.push(this.suggestValidNesting(command));
        break;
    }

    return recovery;
  }

  suggestValidParent(command) {
    const validParents = this.findValidParentComponents(command);
    return {
      type: 'parentSuggestion',
      message: 'This component needs a valid parent container.',
      suggestions: validParents.map(parent => ({
        id: parent.id,
        name: parent.props.name,
        type: parent.type
      }))
    };
  }

  resolveStyleConflict(command) {
    const conflictingStyles = this.findConflictingStyles(command);
    return {
      type: 'styleConflict',
      message: 'There are conflicting styles.',
      suggestions: conflictingStyles.map(style => ({
        property: style.property,
        currentValue: style.current,
        suggestedValue: style.suggested,
        reason: style.reason
      }))
    };
  }

  suggestValidNesting(command) {
    const path = this.context.getComponentPath(command.componentId);
    const maxDepth = 5; // Maximum recommended nesting depth

    if (path.length >= maxDepth) {
      return {
        type: 'nestingSuggestion',
        message: 'Component nesting is too deep.',
        suggestions: [
          {
            type: 'restructure',
            description: 'Consider flattening the component hierarchy'
          },
          {
            type: 'split',
            description: 'Split into separate component groups'
          }
        ]
      };
    }
    return null;
  }

  findValidParentComponents(command) {
    return this.context.components
      .filter(component => this.canContainComponent(component, command.componentType))
      .slice(0, 3); // Limit to top 3 suggestions
  }

  canContainComponent(parent, childType) {
    return parent.type === 'FLEX_CONTAINER' || 
           (parent.acceptsChildren && !this.wouldCreateCyclicDependency(parent, childType));
  }
} 