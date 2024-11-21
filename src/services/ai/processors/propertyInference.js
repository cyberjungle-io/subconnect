export const inferProperties = (command, context) => {
  const targetComponent = command.componentId ? 
    context.findComponentById(command.componentId) : 
    null;

  // Infer component type from context
  if (!command.componentType && command.type === 'add') {
    command.componentType = inferComponentType(command, context);
  }

  // Infer styles from natural language
  if (Object.keys(command.style).length === 0) {
    command.style = inferStyles(command, context);
  }

  // Infer layout properties
  if (command.parentId) {
    const parent = context.findComponentById(command.parentId);
    if (parent?.type === 'FLEX_CONTAINER') {
      command.props = {
        ...command.props,
        ...inferFlexChildProperties(command, parent)
      };
    }
  }

  return command;
};

const inferComponentType = (command, context) => {
  // Infer type based on content and context
  if (command.props.src) return 'IMAGE';
  if (command.props.chartType) return 'CHART';
  if (command.props.content) return 'TEXT';
  return 'FLEX_CONTAINER'; // Default
};

const inferStyles = (command, context) => {
  const styles = {};
  const lastComponent = context.getLastCommand()?.componentId ?
    context.findComponentById(context.getLastCommand().componentId) :
    null;

  // Inherit relevant styles from last component
  if (lastComponent) {
    ['color', 'fontSize', 'fontFamily'].forEach(prop => {
      if (lastComponent.style[prop]) {
        styles[prop] = lastComponent.style[prop];
      }
    });
  }

  return styles;
};

const inferFlexChildProperties = (command, parentContainer) => {
  const props = {};
  
  // Infer flex properties based on parent container
  if (parentContainer.props.direction === 'row') {
    props.flexBasis = command.style.width || 'auto';
    props.flexGrow = command.style.width ? 0 : 1;
  } else {
    props.flexBasis = command.style.height || 'auto';
    props.flexGrow = command.style.height ? 0 : 1;
  }

  // Infer alignment based on natural language cues
  if (command.layout.alignment) {
    switch (command.layout.alignment.toLowerCase()) {
      case 'center':
        props.alignSelf = 'center';
        break;
      case 'start':
      case 'left':
      case 'top':
        props.alignSelf = 'flex-start';
        break;
      case 'end':
      case 'right':
      case 'bottom':
        props.alignSelf = 'flex-end';
        break;
    }
  }

  return props;
};

const inferComponentSpecificProps = (command) => {
  const props = {};
  
  switch (command.componentType) {
    case 'TEXT':
      props.fontSize = command.style.fontSize || '16px';
      props.fontWeight = /bold|strong/i.test(command.message) ? 'bold' : 'normal';
      break;
      
    case 'IMAGE':
      props.objectFit = /cover|contain|fill/i.test(command.message) ? 
        command.message.match(/cover|contain|fill/i)[0].toLowerCase() : 
        'cover';
      break;
      
    case 'CHART':
      props.showLegend = !/no\s+legend/i.test(command.message);
      props.animate = !/no\s+animation/i.test(command.message);
      break;
  }
  
  return props;
};

const inferSizeProperties = (command, context) => {
  const sizeKeywords = {
    small: { width: '100px', height: '100px' },
    medium: { width: '200px', height: '200px' },
    large: { width: '300px', height: '300px' },
    full: { width: '100%', height: '100%' }
  };

  // Extract size keywords from command
  for (const [keyword, sizes] of Object.entries(sizeKeywords)) {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(command.message)) {
      return sizes;
    }
  }

  return {};
};

const inferColorScheme = (command) => {
  const colorSchemes = {
    primary: { backgroundColor: '#007bff', color: '#ffffff' },
    success: { backgroundColor: '#28a745', color: '#ffffff' },
    warning: { backgroundColor: '#ffc107', color: '#000000' },
    danger: { backgroundColor: '#dc3545', color: '#ffffff' }
  };

  for (const [scheme, colors] of Object.entries(colorSchemes)) {
    if (new RegExp(`\\b${scheme}\\b`, 'i').test(command.message)) {
      return colors;
    }
  }

  return {};
}; 