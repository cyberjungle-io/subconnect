export const processSpacingCommand = (command) => {
  const { style } = command;
  const processedStyle = {};

  // Helper function to process spacing values
  const processSpacingValue = (value, property) => {
    // Handle preset values
    const presets = {
      small: '8px',
      medium: '16px',
      large: '24px'
    };

    if (typeof value === 'string' && value.toLowerCase() in presets) {
      return presets[value.toLowerCase()];
    }

    // Handle removal of spacing
    if (value === 'none' || value === '0') {
      return '0px';
    }

    // Handle auto margins
    if (property === 'margin' && value === 'auto') {
      return 'auto';
    }

    return value;
  };

  // Process padding
  if (style.padding !== undefined) {
    processedStyle.padding = processSpacingValue(style.padding, 'padding');
  }

  // Process margin
  if (style.margin !== undefined) {
    processedStyle.margin = processSpacingValue(style.margin, 'margin');
  }

  // Process gap
  if (style.gap !== undefined) {
    processedStyle.gap = processSpacingValue(style.gap, 'gap');
  }

  // Handle individual side spacing if specified
  const sides = ['Top', 'Right', 'Bottom', 'Left'];
  sides.forEach(side => {
    if (style[`padding${side}`] !== undefined) {
      processedStyle[`padding${side}`] = processSpacingValue(style[`padding${side}`], 'padding');
    }
    if (style[`margin${side}`] !== undefined) {
      processedStyle[`margin${side}`] = processSpacingValue(style[`margin${side}`], 'margin');
    }
  });

  return {
    ...command,
    style: processedStyle
  };
}; 