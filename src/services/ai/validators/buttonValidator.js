export const validateButtonStyle = (style) => {
  const {
    cursor,
    hoverBackgroundColor,
    hoverColor,
    hoverScale,
    transitionDuration,
    transition,
    enablePageNavigation,
    targetPageId
  } = style;

  // Validate cursor
  if (cursor !== undefined) {
    const validCursors = [
      'pointer', 'default', 'move', 'grab', 'grabbing',
      'not-allowed', 'wait', 'progress', 'help', 'crosshair',
      'text', 'copy', 'cell'
    ];
    if (!validCursors.includes(cursor)) {
      throw new Error(`Invalid cursor value: ${cursor}`);
    }
  }

  // Validate hover colors
  if (hoverBackgroundColor !== undefined) {
    const isValidColor = /^(#[0-9A-Fa-f]{3,8}|(rgb|hsl)a?\(.*\)|[a-zA-Z]+)$/.test(hoverBackgroundColor);
    if (!isValidColor) {
      throw new Error(`Invalid hover background color: ${hoverBackgroundColor}`);
    }
  }

  if (hoverColor !== undefined) {
    const isValidColor = /^(#[0-9A-Fa-f]{3,8}|(rgb|hsl)a?\(.*\)|[a-zA-Z]+)$/.test(hoverColor);
    if (!isValidColor) {
      throw new Error(`Invalid hover text color: ${hoverColor}`);
    }
  }

  // Validate hover scale
  if (hoverScale !== undefined) {
    const scale = parseFloat(hoverScale);
    if (isNaN(scale) || scale < 0.5 || scale > 2) {
      throw new Error(`Invalid hover scale: ${hoverScale}. Must be between 0.5 and 2`);
    }
  }

  // Validate transition duration
  if (transitionDuration !== undefined) {
    const duration = parseInt(transitionDuration);
    if (isNaN(duration) || duration < 0 || duration > 2000) {
      throw new Error(`Invalid transition duration: ${transitionDuration}. Must be between 0 and 2000ms`);
    }
  }

  // Validate transition
  if (transition !== undefined) {
    const validTransitionFormat = /^(all|[a-zA-Z-]+)\s+\d+m?s(\s+[a-zA-Z-]+)?$/;
    if (!validTransitionFormat.test(transition)) {
      throw new Error(`Invalid transition format: ${transition}`);
    }
  }

  // Validate page navigation properties
  if (enablePageNavigation !== undefined && typeof enablePageNavigation !== 'boolean') {
    throw new Error('enablePageNavigation must be a boolean');
  }

  if (targetPageId !== undefined && typeof targetPageId !== 'string') {
    throw new Error('targetPageId must be a string');
  }

  return true;
}; 