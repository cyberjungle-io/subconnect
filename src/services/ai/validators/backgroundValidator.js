export const validateBackgroundStyle = (style) => {
  const { backgroundColor, backgroundImage } = style;

  // Validate background color
  if (backgroundColor !== undefined) {
    // Check if it's a valid color value (hex, rgb, rgba, hsl, or named color)
    const isValidColor = /^(#[0-9A-Fa-f]{3,8}|(rgb|hsl)a?\(.*\)|[a-zA-Z]+)$/.test(backgroundColor);
    if (!isValidColor) {
      throw new Error(`Invalid background color: ${backgroundColor}`);
    }
  }

  // Validate background image
  if (backgroundImage !== undefined) {
    // Check if it's a valid URL or data URL format
    const isValidImage = backgroundImage === '' || 
                        backgroundImage.startsWith('url(') && backgroundImage.endsWith(')');
    if (!isValidImage) {
      throw new Error(`Invalid background image format: ${backgroundImage}`);
    }
  }

  return true;
}; 