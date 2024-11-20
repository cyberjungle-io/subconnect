export const validateLayoutStyle = (style) => {
  const layoutProperties = {
    display: ['flex', 'block', 'inline', 'inline-block', 'none'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    alignItems: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    alignContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'],
    flexGrow: (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
    flexShrink: (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
    flexBasis: (value) => {
      if (value === 'auto') return true;
      return /^-?\d+(\.\d+)?(px|%|em|rem|vw|vh)$/.test(value);
    },
    order: (value) => Number.isInteger(Number(value))
  };

  Object.entries(style).forEach(([property, value]) => {
    const validator = layoutProperties[property];
    if (!validator) {
      throw new Error(`Invalid layout property: ${property}`);
    }

    if (Array.isArray(validator)) {
      if (!validator.includes(value)) {
        throw new Error(`Invalid value for ${property}: ${value}. Valid values are: ${validator.join(', ')}`);
      }
    } else if (!validator(value)) {
      throw new Error(`Invalid value for ${property}: ${value}`);
    }
  });

  return true;
}; 