import { componentTypes, componentConfig } from '../../../components/Components/componentConfig';

const validateStyle = (style, config) => {
  const validStyleProps = {
    // Define valid style properties
    backgroundColor: 'string',
    width: 'string',
    height: 'string',
    padding: 'string',
    margin: 'string',
    borderRadius: 'string',
    // Add other valid style properties
  };

  Object.entries(style).forEach(([key, value]) => {
    if (!validStyleProps[key]) {
      throw new Error(`Invalid style property: ${key}`);
    }
    // Add type checking if needed
  });
};

const validateProps = (props, config) => {
  if (!config) return; // Skip validation if no config provided
  
  const validProps = config.defaultProps || {};
  Object.keys(props).forEach(key => {
    if (!(key in validProps)) {
      throw new Error(`Invalid prop: ${key} for component type`);
    }
  });
};

const validateAddCommand = (command) => {
  if (!command.componentType || !componentTypes[command.componentType]) {
    throw new Error(`Invalid component type: ${command.componentType}`);
  }

  // Validate style and props against component config
  const config = componentConfig[command.componentType];
  if (command.style) {
    validateStyle(command.style, config);
  }
  if (command.props) {
    validateProps(command.props, config);
  }

  return command;
};

const validateModifyCommand = (command) => {
  if (!command.componentId) {
    throw new Error('Component ID is required for modify commands');
  }

  // Add validation for style and prop updates
  if (command.style) {
    validateStyle(command.style);
  }
  if (command.props) {
    validateProps(command.props);
  }

  return command;
};

const validatePosition = (position, context) => {
  if (!position) return true;

  // Validate relative positioning
  if (position.relative) {
    const { reference, placement } = position.relative;
    const referenceComponent = context.findComponentById(reference);
    
    if (!referenceComponent) {
      throw new Error('Reference component not found for positioning');
    }

    // Check if placement is valid relative to the reference component
    const validPlacements = ['above', 'below', 'left', 'right'];
    if (!validPlacements.includes(placement)) {
      throw new Error(`Invalid placement: ${placement}`);
    }
  }

  // Validate absolute positioning
  if (position.absolute) {
    const { x, y } = position.absolute;
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Invalid coordinates for absolute positioning');
    }
  }

  return true;
};

const validateComponentSpecifics = (command, context) => {
  const componentType = command.componentType;
  const config = componentConfig[componentType];

  if (!config) {
    throw new Error(`No configuration found for component type: ${componentType}`);
  }

  // Validate component-specific requirements
  switch (componentType) {
    case 'FLEX_CONTAINER':
      validateFlexContainer(command, config);
      break;
    case 'TEXT':
      validateTextComponent(command, config);
      break;
    case 'IMAGE':
      validateImageComponent(command, config);
      break;
    // Add cases for other component types
  }

  return true;
};

// Helper validation functions for specific component types
const validateFlexContainer = (command, config) => {
  const { props = {} } = command;
  
  // Validate direction
  if (props.direction && !['row', 'column'].includes(props.direction)) {
    throw new Error('Invalid flex direction');
  }

  // Validate wrap
  if (props.wrap && !['wrap', 'nowrap', 'wrap-reverse'].includes(props.wrap)) {
    throw new Error('Invalid flex wrap');
  }
};

const validateTextComponent = (command, config) => {
  const { props = {} } = command;
  
  // Validate text content if provided
  if (props.content && typeof props.content !== 'string') {
    throw new Error('Text content must be a string');
  }
};

const validateImageComponent = (command, config) => {
  const { props = {} } = command;
  
  // Validate image source if provided
  if (props.src && typeof props.src !== 'string') {
    throw new Error('Image source must be a string URL');
  }
};

export const validateCommand = (command, context) => {
  console.log('Validating command:', command); // Debug log

  // Basic validation
  if (!command || typeof command !== 'object') {
    throw new Error('Invalid command format');
  }

  if (!command.type) {
    console.error('Command type is missing:', command); // Debug log
    throw new Error('Command type is required');
  }

  // Validate command type
  const validTypes = ['add', 'modify', 'delete'];
  if (!validTypes.includes(command.type.toLowerCase())) {
    throw new Error(`Invalid command type: ${command.type}. Must be one of: ${validTypes.join(', ')}`);
  }

  // For 'add' commands, validate component type
  if (command.type === 'add' && !command.componentType) {
    throw new Error('Component type is required for add commands');
  }

  return true;
};

const validateParentChild = (parentId, childType, context) => {
  const parent = context.findComponentById(parentId);
  if (!parent) {
    throw new Error('Parent container not found');
  }

  if (!parent.acceptsChildren) {
    throw new Error(`${parent.type} cannot contain other components`);
  }

  // Add specific parent-child relationship rules
};

const validateComponentRelationships = (command, context) => {
  // Validate parent-child relationships
  if (command.parentId) {
    const parent = context.findComponentById(command.parentId);
    const child = command.componentId ? 
      context.findComponentById(command.componentId) : 
      { type: command.componentType };

    // Check if parent can contain this type of child
    const validChildren = componentConfig[parent.type].validChildren;
    if (validChildren && !validChildren.includes(child.type)) {
      throw new Error(`${parent.type} cannot contain ${child.type} components`);
    }

    // Check nesting limits
    const parentPath = context.getComponentPath(command.parentId);
    if (parentPath.length >= 5) { // Example max nesting depth
      throw new Error('Maximum nesting depth exceeded');
    }
  }

  // Validate sibling relationships
  if (command.position?.type === 'relative') {
    const reference = context.findComponentById(command.position.reference);
    if (!reference) {
      throw new Error('Reference component not found');
    }

    // Check if components can be siblings
    const parent = context.findParentComponent(reference.id);
    if (parent && parent.type === 'FLEX_CONTAINER') {
      // Validate flex container constraints
      validateFlexContainerPlacement(command, parent);
    }
  }
};

const validateFlexContainerPlacement = (command, container) => {
  const { direction = 'row' } = container.props;
  const { placement } = command.position;

  // Validate placement based on flex direction
  if (direction === 'row' && ['above', 'below'].includes(placement)) {
    throw new Error(`Cannot place components ${placement} in a row container`);
  }
  if (direction === 'column' && ['left', 'right'].includes(placement)) {
    throw new Error(`Cannot place components to the ${placement} in a column container`);
  }
};
