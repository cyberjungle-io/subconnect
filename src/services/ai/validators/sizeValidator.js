export const validateSizeStyle = (style) => {
  const sizeProperties = [
    'width', 'height',
    'minWidth', 'maxWidth',
    'minHeight', 'maxHeight'
  ];

  const validateSizeValue = (value, property) => {
    // Valid size values include:
    // - Numbers with units (px, %, em, rem, vw, vh)
    // - Special values (auto, fit-content, min-content, max-content)
    // - Calc expressions (basic validation)
    const validSpecialValues = ['auto', 'fit-content', 'min-content', 'max-content'];
    
    if (validSpecialValues.includes(value)) return true;
    
    if (value.startsWith('calc(')) {
      // Basic calc validation - should be improved based on needs
      if (!/^calc\([^()]+\)$/.test(value)) {
        throw new Error(`Invalid calc expression for ${property}: ${value}`);
      }
      return true;
    }

    // Check for valid numeric values with units
    if (!/^-?\d+(\.\d+)?(px|%|em|rem|vw|vh)$/.test(value)) {
      throw new Error(`Invalid ${property} value: ${value}`);
    }

    return true;
  };

  sizeProperties.forEach(prop => {
    if (style[prop] !== undefined) {
      validateSizeValue(style[prop], prop);
    }
  });

  // Validate aspect ratio if present
  if (style.aspectRatio !== undefined) {
    if (!/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(style.aspectRatio)) {
      throw new Error(`Invalid aspect ratio: ${style.aspectRatio}`);
    }
  }

  return true;
}; 