import { textProcessor } from '../../services/ai/processors/textProcessor';

export const validateTextStyle = (style) => {
  const errors = [];
  const validStyle = {};

  // Validate font properties
  if (style.fontFamily) {
    const result = textProcessor.processFontFamily(style.fontFamily);
    if (result.isValid) {
      validStyle.fontFamily = result.value;
    } else {
      errors.push(result.message);
    }
  }

  if (style.fontSize) {
    const result = textProcessor.processFontSize(style.fontSize);
    if (result.isValid) {
      validStyle.fontSize = result.value;
    } else {
      errors.push(result.message);
    }
  }

  // Add validation for all other text properties...

  return {
    isValid: errors.length === 0,
    style: validStyle,
    errors
  };
};

export const validateTextContent = (content) => {
  if (typeof content !== 'string') {
    return {
      isValid: false,
      message: 'Content must be a string'
    };
  }

  // Add any specific content validation rules here
  // For example, max length, allowed characters, etc.

  return {
    isValid: true,
    value: content
  };
}; 