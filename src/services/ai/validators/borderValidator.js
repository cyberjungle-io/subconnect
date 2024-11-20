export const validateBorderStyle = (style) => {
  const {
    borderWidth, borderStyle, borderColor, borderRadius,
    boxShadow, // For shadow controls
  } = style;

  // Validate border width
  if (borderWidth !== undefined) {
    // Can be single value or up to 4 values for top, right, bottom, left
    const values = borderWidth.split(' ');
    if (values.length > 4) {
      throw new Error('Border width can have maximum 4 values');
    }
    values.forEach(value => {
      if (!/^[0-9]+(px|em|rem|%|vw|vh)$/.test(value)) {
        throw new Error(`Invalid border width value: ${value}`);
      }
    });
  }

  // Validate border style
  if (borderStyle !== undefined) {
    const validStyles = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
    if (!validStyles.includes(borderStyle)) {
      throw new Error(`Invalid border style: ${borderStyle}`);
    }
  }

  // Validate border color
  if (borderColor !== undefined) {
    const isValidColor = /^(#[0-9A-Fa-f]{3,8}|(rgb|hsl)a?\(.*\)|[a-zA-Z]+)$/.test(borderColor);
    if (!isValidColor) {
      throw new Error(`Invalid border color: ${borderColor}`);
    }
  }

  // Validate border radius
  if (borderRadius !== undefined) {
    const values = borderRadius.split(' ');
    if (values.length > 4) {
      throw new Error('Border radius can have maximum 4 values');
    }
    values.forEach(value => {
      if (!/^[0-9]+(px|em|rem|%|vw|vh)$/.test(value)) {
        throw new Error(`Invalid border radius value: ${value}`);
      }
    });
  }

  // Validate box shadow
  if (boxShadow !== undefined) {
    // Basic validation for box-shadow format
    const isValidShadow = /^(inset\s+)?(-?\d+px\s+){2,3}(-?\d+px)(\s+[a-zA-Z]+(\([^)]+\))?)?$/.test(boxShadow);
    if (!boxShadow === 'none' && !isValidShadow) {
      throw new Error(`Invalid box shadow format: ${boxShadow}`);
    }
  }

  return true;
}; 