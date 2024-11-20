export const processButtonCommand = (command) => {
  const { style } = command;
  const processedStyle = {};

  // Helper function to process hover effect presets
  const applyHoverPreset = (preset) => {
    switch (preset.toLowerCase()) {
      case 'subtle':
        return {
          hoverScale: 1.05,
          transitionDuration: 200,
          transition: 'all 200ms ease-out',
          cursor: 'pointer'
        };
      case 'medium':
        return {
          hoverScale: 1.1,
          transitionDuration: 300,
          transition: 'all 300ms ease-out',
          cursor: 'pointer'
        };
      case 'strong':
        return {
          hoverScale: 1.15,
          transitionDuration: 400,
          transition: 'all 400ms ease-out',
          cursor: 'pointer'
        };
      default:
        return {};
    }
  };

  // Process hover preset if specified
  if (style.hoverPreset) {
    Object.assign(processedStyle, applyHoverPreset(style.hoverPreset));
    delete style.hoverPreset;
  }

  // Process hover effects
  if (style.hoverBackgroundColor !== undefined) {
    processedStyle.hoverBackgroundColor = style.hoverBackgroundColor;
  }
  if (style.hoverColor !== undefined) {
    processedStyle.hoverColor = style.hoverColor;
  }
  if (style.hoverScale !== undefined) {
    processedStyle.hoverScale = parseFloat(style.hoverScale);
  }

  // Process cursor
  if (style.cursor !== undefined) {
    processedStyle.cursor = style.cursor;
  }

  // Process transitions
  if (style.transitionDuration !== undefined) {
    processedStyle.transitionDuration = parseInt(style.transitionDuration);
    // Auto-generate transition property if not explicitly set
    if (style.transition === undefined) {
      processedStyle.transition = `all ${processedStyle.transitionDuration}ms ease-out`;
    }
  }
  if (style.transition !== undefined) {
    processedStyle.transition = style.transition;
  }

  // Process page navigation
  if (style.enablePageNavigation !== undefined) {
    processedStyle.enablePageNavigation = style.enablePageNavigation;
  }
  if (style.targetPageId !== undefined) {
    processedStyle.targetPageId = style.targetPageId;
  }

  return {
    ...command,
    style: processedStyle
  };
}; 