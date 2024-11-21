const determineCommandType = (message) => {
  // Command type patterns
  const patterns = {
    add: /add|create|insert|new/i,
    modify: /change|modify|update|set|make/i,
    delete: /delete|remove|eliminate/i,
  };

  // Check each pattern and return the matching type
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(message)) {
      return type;
    }
  }

  // Default to modify if no clear command type is found
  return 'modify';
};

export const generateCommand = (message, parsedLanguage, context) => {
  const { matches } = parsedLanguage;
  const targetComponent = context.getTargetComponent();
  const lastCommand = context.getLastCommand();

  let command = {
    type: determineCommandType(message),
    componentType: null,
    componentId: targetComponent?.id,
    style: {},
    props: {},
    parentId: null,
    layout: {},
    position: {}
  };

  // Process layout matches
  if (matches.layout) {
    processLayoutMatches(matches.layout, command);
  }

  // Process style matches
  if (matches.style) {
    processStyleMatches(matches.style, command);
  }

  // Process position matches
  if (matches.position) {
    processPositionMatches(matches.position, command, context);
  }

  // Process content matches
  if (matches.content) {
    processContentMatches(matches.content, command);
  }

  // Handle context-based references
  handleContextualReferences(message, command, context);

  return command;
};

// Helper functions for processing different types of matches
const processLayoutMatches = (layoutMatches, command) => {
  if (layoutMatches.direction) {
    command.props.direction = layoutMatches.direction[1].toLowerCase() === 'vertical' ? 'column' : 'row';
  }
  if (layoutMatches.columns) {
    command.props.columns = parseInt(layoutMatches.columns[1]);
  }
  // Add more layout processing...
};

const processStyleMatches = (styleMatches, command) => {
  Object.entries(styleMatches).forEach(([key, match]) => {
    if (match.value) {
      const value = match.unit ? `${match.value}${match.unit}` : match.value;
      if (match.property) {
        command.style[`${match.property}${match.subProperty ? match.subProperty.charAt(0).toUpperCase() + match.subProperty.slice(1) : ''}`] = value;
      }
    }
  });
};

const processPositionMatches = (positionMatches, command, context) => {
  if (positionMatches.inside) {
    const containerName = positionMatches.inside[1];
    const container = context.findComponentByName(containerName);
    if (container) {
      command.parentId = container.id;
    }
  }

  if (positionMatches.relative) {
    const [_, placement, referenceName] = positionMatches.relative;
    const referenceComponent = context.findComponentByName(referenceName);
    if (referenceComponent) {
      command.position = {
        type: 'relative',
        reference: referenceComponent.id,
        placement
      };
    }
  }
};

const processContentMatches = (contentMatches, command) => {
  if (contentMatches.text) {
    command.props.content = contentMatches.text[1];
  }
  if (contentMatches.image) {
    command.props.src = contentMatches.image[1];
  }
  if (contentMatches.chart) {
    command.props.chartType = contentMatches.chart[1];
  }
};

const handleContextualReferences = (message, command, context) => {
  // Handle references like "it", "this", "that", "the last component"
  const referencePatterns = {
    it: /\bit\b/i,
    this: /\bthis\b/i,
    that: /\bthat\b/i,
    last: /\b(last|previous)\b/i,
  };

  if (Object.values(referencePatterns).some(pattern => pattern.test(message))) {
    const lastCommand = context.getLastCommand();
    if (lastCommand?.componentId) {
      command.componentId = lastCommand.componentId;
    }
  }
};

// Add more processing functions... 