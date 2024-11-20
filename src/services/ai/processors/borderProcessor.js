export const processBorderCommand = (command) => {
  const { style } = command;
  const processedStyle = {};

  // Process border width
  if (style.borderWidth !== undefined) {
    // Handle shorthand and individual values
    processedStyle.borderWidth = style.borderWidth;
  }

  // Process border style
  if (style.borderStyle !== undefined) {
    processedStyle.borderStyle = style.borderStyle;
  }

  // Process border color
  if (style.borderColor !== undefined) {
    processedStyle.borderColor = style.borderColor;
  }

  // Process border radius
  if (style.borderRadius !== undefined) {
    processedStyle.borderRadius = style.borderRadius;
  }

  // Process box shadow
  if (style.boxShadow !== undefined) {
    // Handle special case for removing shadow
    if (style.boxShadow === 'none' || style.boxShadow === '') {
      processedStyle.boxShadow = 'none';
    } else {
      processedStyle.boxShadow = style.boxShadow;
    }
  }

  // Handle complete border shorthand
  if (style.border !== undefined) {
    processedStyle.border = style.border;
  }

  return {
    ...command,
    style: processedStyle
  };
}; 