import { componentTypes } from '../components/Components/componentConfig';

const validateStyles = (styles) => {
  if (typeof styles !== 'object' || styles === null) {
    throw new Error('Styles must be a valid object');
  }
  // Add any additional style validation logic as needed
};

const validateComponentProps = (componentType, props) => {
  if (!componentTypes[componentType]) {
    throw new Error(`Invalid component type: ${componentType}`);
  }
  // Basic props validation - extend as needed
  return { ...props };
};

const validateTextProps = (props) => {
  const validTextProps = {
    elementType: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    textTransform: ['none', 'uppercase', 'lowercase', 'capitalize'],
    textAlign: ['left', 'center', 'right', 'justify'],
    fontStyle: ['normal', 'italic'],
    fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    textDecoration: ['none', 'underline', 'line-through', 'overline'],
  };

  const sanitizedProps = {};

  // Validate element type
  if (props.elementType && validTextProps.elementType.includes(props.elementType)) {
    sanitizedProps.elementType = props.elementType;
  }

  // Validate text transform
  if (props.textTransform && validTextProps.textTransform.includes(props.textTransform)) {
    sanitizedProps.textTransform = props.textTransform;
  }

  // Validate text alignment
  if (props.textAlign && validTextProps.textAlign.includes(props.textAlign)) {
    sanitizedProps.textAlign = props.textAlign;
  }

  // Validate font style
  if (props.fontStyle && validTextProps.fontStyle.includes(props.fontStyle)) {
    sanitizedProps.fontStyle = props.fontStyle;
  }

  // Validate font weight
  if (props.fontWeight && validTextProps.fontWeight.includes(props.fontWeight)) {
    sanitizedProps.fontWeight = props.fontWeight;
  }

  // Validate text decoration
  if (props.textDecoration && validTextProps.textDecoration.includes(props.textDecoration)) {
    sanitizedProps.textDecoration = props.textDecoration;
  }

  return sanitizedProps;
};

const validateTextStyles = (styles) => {
  const sanitizedStyles = {};

  // Validate font family
  if (styles.fontFamily) {
    sanitizedStyles.fontFamily = styles.fontFamily;
  }

  // Validate font size with units
  if (styles.fontSize && /^\d+(\.\d+)?(px|em|rem|pt|%)$/.test(styles.fontSize)) {
    sanitizedStyles.fontSize = styles.fontSize;
  }

  // Validate color (hex, rgb, rgba)
  if (styles.color && /^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-1](\.\d+)?\))$/.test(styles.color)) {
    sanitizedStyles.color = styles.color;
  }

  // Validate letter spacing with units
  if (styles.letterSpacing && /^-?\d+(\.\d+)?(px|em|rem)$/.test(styles.letterSpacing)) {
    sanitizedStyles.letterSpacing = styles.letterSpacing;
  }

  // Validate line height (unitless or with units)
  if (styles.lineHeight && /^(\d+(\.\d+)?|\d+(\.\d+)?(px|em|rem|%))$/.test(styles.lineHeight)) {
    sanitizedStyles.lineHeight = styles.lineHeight;
  }

  // Validate word spacing with units
  if (styles.wordSpacing && /^-?\d+(\.\d+)?(px|em|rem)$/.test(styles.wordSpacing)) {
    sanitizedStyles.wordSpacing = styles.wordSpacing;
  }

  // Validate text shadow
  if (styles.textShadow && /^-?\d+px\s+-?\d+px\s+\d+px\s+(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))$/.test(styles.textShadow)) {
    sanitizedStyles.textShadow = styles.textShadow;
  }

  return sanitizedStyles;
};

export const validateAndProcessAICommands = (commands) => {
  try {
    if (!Array.isArray(commands)) {
      throw new Error('Invalid command structure');
    }

    return commands.map(command => {
      // Validate required fields
      if (!command.type) {
        throw new Error('Missing required command fields');
      }

      // For modify commands, ensure componentId exists
      if (command.type === 'modify') {
        if (!command.componentId) {
          throw new Error('Missing componentId for modify command');
        }

        // Validate and sanitize style updates
        if (command.style) {
          command.style = sanitizeStyles(command.style);
          
          // Convert color names to hex values if needed
          if (command.style.backgroundColor) {
            command.style.backgroundColor = convertColorToHex(command.style.backgroundColor);
          }
          if (command.style.color) {
            command.style.color = convertColorToHex(command.style.color);
          }
        }

        // Validate and sanitize props
        if (command.props) {
          command.props = validateComponentProps(command.componentType, command.props);
        }
      }

      return command;
    });
  } catch (error) {
    console.error('AI Command Validation Error:', error);
    throw error;
  }
};

const sanitizeStyles = (styles) => {
  const allowedUnits = ['px', '%', 'em', 'rem', 'vh', 'vw'];
  const sanitized = {};

  Object.entries(styles).forEach(([key, value]) => {
    // Convert numeric values to pixel units
    if (typeof value === 'number') {
      sanitized[key] = `${value}px`;
      return;
    }
    
    // Validate CSS units
    if (typeof value === 'string' && /^[\d.]+[a-z%]+$/.test(value)) {
      const unit = value.replace(/[\d.]+/, '');
      if (allowedUnits.includes(unit)) {
        sanitized[key] = value;
      }
    }
  });

  return sanitized;
};

// Helper function to convert color names to hex
const convertColorToHex = (color) => {
  const colorMap = {
    purple: '#8B5CF6',
    blue: '#3B82F6',
    red: '#EF4444',
    green: '#10B981',
    // Add more color mappings as needed
  };
  
  return colorMap[color.toLowerCase()] || color;
}; 