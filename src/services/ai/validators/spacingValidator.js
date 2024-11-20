export const validateSpacingStyle = (style) => {
  const { padding, margin, gap } = style;

  const validateSpacingValue = (value, property) => {
    // Split into individual values
    const values = value.split(' ');
    if (values.length > 4) {
      throw new Error(`${property} can have maximum 4 values`);
    }

    // Validate each value
    values.forEach(val => {
      // Allow 'auto' for margin
      if (property === 'margin' && val === 'auto') return;
      
      // Check for valid units
      if (!/^-?\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(val)) {
        throw new Error(`Invalid ${property} value: ${val}`);
      }
    });
  };

  // Validate padding
  if (padding !== undefined) {
    validateSpacingValue(padding, 'padding');
  }

  // Validate margin
  if (margin !== undefined) {
    validateSpacingValue(margin, 'margin');
  }

  // Validate gap
  if (gap !== undefined) {
    if (!/^-?\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(gap)) {
      throw new Error(`Invalid gap value: ${gap}`);
    }
  }

  return true;
}; 