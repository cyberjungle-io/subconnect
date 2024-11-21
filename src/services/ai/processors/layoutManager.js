export class LayoutManager {
  constructor(context) {
    this.context = context;
  }

  optimizeLayout(command) {
    const parentContainer = command.parentId ? 
      this.context.findComponentById(command.parentId) : null;

    if (parentContainer?.type === 'FLEX_CONTAINER') {
      return this.optimizeFlexLayout(command, parentContainer);
    }

    return this.suggestContainerCreation(command);
  }

  optimizeFlexLayout(command, container) {
    const siblings = container.children || [];
    const layout = {
      direction: container.props.direction || 'row',
      spacing: container.props.gap || '8px',
      alignment: container.props.alignItems || 'center'
    };

    // Adjust new component properties based on layout
    return {
      ...command,
      style: {
        ...command.style,
        flex: this.calculateFlexValue(siblings.length),
        margin: this.calculateMargin(layout)
      },
      props: {
        ...command.props,
        alignSelf: this.determineAlignment(command, layout)
      }
    };
  }

  suggestContainerCreation(command) {
    // Suggest creating a flex container if component would benefit from it
    if (this.shouldCreateContainer(command)) {
      return {
        type: 'chain',
        commands: [
          {
            type: 'add',
            componentType: 'FLEX_CONTAINER',
            style: { padding: '16px' },
            props: { direction: 'row', gap: '16px' }
          },
          {
            ...command,
            parentId: '{{previousId}}' // Will be replaced with new container's ID
          }
        ]
      };
    }
    return command;
  }
} 