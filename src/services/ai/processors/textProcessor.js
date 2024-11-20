import { validateColor } from '../../utils/colorUtils';
import { validateUnit } from '../../utils/unitUtils';

const TEXT_ELEMENT_TYPES = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const VALID_FONT_FAMILIES = [
  'Arial, sans-serif',
  'Helvetica, Arial, sans-serif',
  'Georgia, serif',
  '"Times New Roman", Times, serif',
  '"Courier New", Courier, monospace',
  'Verdana, Geneva, sans-serif',
  '"Trebuchet MS", Helvetica, sans-serif',
  '"Arial Black", Gadget, sans-serif',
  '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  'Tahoma, Geneva, sans-serif',
  '"Gill Sans", "Gill Sans MT", sans-serif',
  'Impact, Charcoal, sans-serif',
  '"Century Gothic", sans-serif'
];

const TEXT_TRANSFORMS = ['none', 'uppercase', 'lowercase', 'capitalize'];
const TEXT_DECORATIONS = ['none', 'underline', 'overline', 'line-through'];
const TEXT_ALIGNMENTS = ['left', 'center', 'right'];
const FONT_WEIGHTS = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const FONT_STYLES = ['normal', 'italic'];

export const textProcessor = {
  // Process font-related properties
  processFontFamily: (value) => {
    if (typeof value !== 'string') return { isValid: false, message: 'Font family must be a string' };
    const fontFamily = VALID_FONT_FAMILIES.find(font => 
      font.toLowerCase() === value.toLowerCase() || 
      font.split(',')[0].replace(/"/g, '').toLowerCase() === value.toLowerCase()
    );
    return {
      isValid: !!fontFamily,
      value: fontFamily || value,
      message: fontFamily ? null : 'Unsupported font family'
    };
  },

  processFontSize: (value) => {
    return validateUnit(value, ['px', 'em', 'rem', '%', 'pt'], {
      min: 0,
      max: 200,
      defaultUnit: 'px'
    });
  },

  processFontWeight: (value) => {
    const weight = value.toString().toLowerCase();
    return {
      isValid: FONT_WEIGHTS.includes(weight),
      value: weight,
      message: FONT_WEIGHTS.includes(weight) ? null : 'Invalid font weight'
    };
  },

  // Process text decoration and transformation
  processTextTransform: (value) => {
    const transform = value.toLowerCase();
    return {
      isValid: TEXT_TRANSFORMS.includes(transform),
      value: transform,
      message: TEXT_TRANSFORMS.includes(transform) ? null : 'Invalid text transform'
    };
  },

  processTextDecoration: (value) => {
    const decoration = value.toLowerCase();
    return {
      isValid: TEXT_DECORATIONS.includes(decoration),
      value: decoration,
      message: TEXT_DECORATIONS.includes(decoration) ? null : 'Invalid text decoration'
    };
  },

  // Process spacing and alignment
  processLetterSpacing: (value) => {
    if (value === 'normal') return { isValid: true, value: 'normal' };
    return validateUnit(value, ['px', 'em', 'rem'], {
      allowNegative: true,
      defaultUnit: 'px'
    });
  },

  processLineHeight: (value) => {
    if (value === 'normal') return { isValid: true, value: 'normal' };
    if (!isNaN(value)) return { isValid: true, value: value }; // Allow unitless numbers
    return validateUnit(value, ['px', 'em', 'rem', '%'], {
      min: 0,
      defaultUnit: 'px'
    });
  },

  processWordSpacing: (value) => {
    if (value === 'normal') return { isValid: true, value: 'normal' };
    return validateUnit(value, ['px', 'em', 'rem'], {
      allowNegative: true,
      defaultUnit: 'px'
    });
  },

  processTextAlign: (value) => {
    const alignment = value.toLowerCase();
    return {
      isValid: TEXT_ALIGNMENTS.includes(alignment),
      value: alignment,
      message: TEXT_ALIGNMENTS.includes(alignment) ? null : 'Invalid text alignment'
    };
  },

  // Process text shadow
  processTextShadow: (shadow) => {
    if (shadow === 'none') return { isValid: true, value: 'none' };
    
    const { x, y, blur, color } = shadow;
    const xResult = validateUnit(x, ['px'], { allowNegative: true });
    const yResult = validateUnit(y, ['px'], { allowNegative: true });
    const blurResult = validateUnit(blur, ['px'], { min: 0 });
    const colorResult = validateColor(color);

    if (!xResult.isValid || !yResult.isValid || !blurResult.isValid || !colorResult.isValid) {
      return { 
        isValid: false, 
        message: 'Invalid text shadow parameters' 
      };
    }

    return {
      isValid: true,
      value: `${xResult.value} ${yResult.value} ${blurResult.value} ${colorResult.value}`
    };
  },

  // Process element type
  processElementType: (value) => {
    const type = value.toLowerCase();
    return {
      isValid: TEXT_ELEMENT_TYPES.includes(type),
      value: type,
      message: TEXT_ELEMENT_TYPES.includes(type) ? null : 'Invalid element type'
    };
  },

  // Process complete text style object
  processTextStyle: (style) => {
    const processed = {};
    const errors = [];

    // Process each style property
    if (style.fontFamily) {
      const result = this.processFontFamily(style.fontFamily);
      if (result.isValid) processed.fontFamily = result.value;
      else errors.push(result.message);
    }

    if (style.fontSize) {
      const result = this.processFontSize(style.fontSize);
      if (result.isValid) processed.fontSize = result.value;
      else errors.push(result.message);
    }

    // Add similar processing for other properties...

    return {
      isValid: errors.length === 0,
      value: processed,
      errors
    };
  }
}; 