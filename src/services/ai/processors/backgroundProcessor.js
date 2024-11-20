export const processBackgroundCommand = (command) => {
  const { style } = command;
  const processedStyle = {};

  if (style.backgroundColor !== undefined) {
    processedStyle.backgroundColor = style.backgroundColor;
  }

  if (style.backgroundImage !== undefined) {
    // Handle special cases for background image
    if (style.backgroundImage === '') {
      // Clear background image
      processedStyle.backgroundImage = '';
    } else if (!style.backgroundImage.startsWith('url(')) {
      // Wrap URL in url() if not already wrapped
      processedStyle.backgroundImage = `url(${style.backgroundImage})`;
    } else {
      processedStyle.backgroundImage = style.backgroundImage;
    }
  }

  return {
    ...command,
    style: processedStyle
  };
}; 