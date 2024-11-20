export const processLayoutCommand = (command) => {
  const { style } = command;
  const processedStyle = {};

  // Helper function to process layout presets
  const applyLayoutPreset = (preset) => {
    switch (preset.toLowerCase()) {
      case 'row':
        return {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        };
      case 'column':
        return {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        };
      case 'grid':
        return {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center'
        };
      case 'center':
        return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        };
      case 'space-between':
        return {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        };
      default:
        return {};
    }
  };

  // Process layout preset if specified
  if (style.layoutPreset) {
    Object.assign(processedStyle, applyLayoutPreset(style.layoutPreset));
    delete style.layoutPreset;
  }

  // Process individual layout properties
  const layoutProperties = [
    'display',
    'flexDirection',
    'flexWrap',
    'justifyContent',
    'alignItems',
    'alignContent',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'order'
  ];

  layoutProperties.forEach(prop => {
    if (style[prop] !== undefined) {
      processedStyle[prop] = style[prop];
    }
  });

  // Handle shorthand flex property
  if (style.flex !== undefined) {
    processedStyle.flex = style.flex;
  }

  return {
    ...command,
    style: processedStyle
  };
}; 