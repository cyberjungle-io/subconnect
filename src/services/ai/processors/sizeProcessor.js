export const processSizeCommand = (command) => {
  const { style } = command;
  const processedStyle = {};

  // Helper function to process size values
  const processSizeValue = (value) => {
    // Handle preset values
    const presets = {
      small: '200px',
      medium: '400px',
      large: '800px',
      full: '100%'
    };

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue in presets) {
        return presets[lowerValue];
      }

      // Handle special keywords
      if (['auto', 'fit-content', 'min-content', 'max-content'].includes(lowerValue)) {
        return lowerValue;
      }
    }

    return value;
  };

  // Process basic dimensions
  if (style.width !== undefined) {
    processedStyle.width = processSizeValue(style.width);
  }
  if (style.height !== undefined) {
    processedStyle.height = processSizeValue(style.height);
  }

  // Process min/max constraints
  ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(prop => {
    if (style[prop] !== undefined) {
      processedStyle[prop] = processSizeValue(style[prop]);
    }
  });

  // Process aspect ratio
  if (style.aspectRatio !== undefined) {
    processedStyle.aspectRatio = style.aspectRatio;
  }

  // Handle preset configurations
  if (style.preset) {
    switch (style.preset.toLowerCase()) {
      case 'square':
        const size = style.preset.size || '200px';
        processedStyle.width = size;
        processedStyle.height = size;
        break;
      case 'banner':
        processedStyle.width = '100%';
        processedStyle.height = style.preset.height || '150px';
        break;
      case 'card':
        processedStyle.width = style.preset.width || '300px';
        processedStyle.height = 'auto';
        break;
      case 'full':
        processedStyle.width = '100%';
        processedStyle.height = '100%';
        break;
    }
    delete style.preset; // Remove preset from final style
  }

  return {
    ...command,
    style: processedStyle
  };
}; 