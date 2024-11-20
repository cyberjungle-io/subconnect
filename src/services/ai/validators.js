const VALID_COMPONENT_TYPES = [
  'FLEX_CONTAINER',
  'HEADING',
  'TEXT',
  'IMAGE',
  'BUTTON',
  'CHART',
  'WHITEBOARD',
  'VIDEO',
  'QUERY_VALUE',
  'KANBAN',
  'TABLE',
  'TODO'
];

export const validateCommand = (command) => {
  // Basic command structure validation
  if (!command.type || typeof command.type !== 'string') {
    throw new Error('Command must have a valid type');
  }

  switch (command.type) {
    case 'add':
      if (!VALID_COMPONENT_TYPES.includes(command.componentType)) {
        throw new Error(`Invalid component type: ${command.componentType}`);
      }
      // Validate style object if present
      if (command.style) {
        validateStyle(command.style);
      }
      // Validate props object if present
      if (command.props) {
        validateProps(command.props);
      }
      break;

    case 'modify':
      if (!command.componentId) {
        throw new Error('Modify command must include componentId');
      }
      // Validate style updates if present
      if (command.style) {
        validateStyle(command.style);
      }
      // Validate props updates if present
      if (command.props) {
        validateProps(command.props);
      }
      break;

    case 'delete':
      if (!command.componentId) {
        throw new Error('Delete command must include componentId');
      }
      break;

    default:
      throw new Error(`Unknown command type: ${command.type}`);
  }

  return command;
};

const validateStyle = (style) => {
  // Basic style properties
  const validStyleProps = {
    // Layout properties
    display: ['flex', 'block', 'inline', 'inline-block', 'none'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    alignItems: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    alignContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'],
    gap: 'string',

    // Size properties
    width: 'string',
    height: 'string',
    minWidth: 'string',
    maxWidth: 'string',
    minHeight: 'string',
    maxHeight: 'string',

    // Spacing properties
    padding: 'string',
    margin: 'string',

    // Border properties
    borderWidth: 'string',
    borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double'],
    borderColor: 'string',
    borderRadius: 'string',

    // Background properties
    backgroundColor: 'string',
    backgroundImage: 'string',

    // Button/hover properties
    cursor: 'string',
    hoverBackgroundColor: 'string',
    hoverColor: 'string',
    hoverScale: 'number',
    transitionDuration: 'number',
    
    // Other visual properties
    opacity: 'number',
    boxShadow: 'string',
    transform: 'string',
    transition: 'string'
  };

  Object.entries(style).forEach(([key, value]) => {
    const validationType = validStyleProps[key];
    if (!validationType) {
      throw new Error(`Invalid style property: ${key}`);
    }

    if (Array.isArray(validationType)) {
      if (!validationType.includes(value)) {
        throw new Error(`Invalid value for ${key}: ${value}`);
      }
    } else if (typeof value !== validationType) {
      throw new Error(`Invalid type for ${key}: expected ${validationType}, got ${typeof value}`);
    }
  });
};

const validateProps = (props) => {
  // Add specific prop validation based on component type if needed
  if (typeof props !== 'object') {
    throw new Error('Props must be an object');
  }
}; 