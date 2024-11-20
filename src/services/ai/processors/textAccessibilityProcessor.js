export class TextAccessibilityProcessor {
  static WCAG_CONTRAST_LEVELS = {
    AA: {
      normal: 4.5,
      large: 3
    },
    AAA: {
      normal: 7,
      large: 4.5
    }
  };

  static calculateContrastRatio(foreground, background) {
    // Convert hex to relative luminance
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;
      
      const toSRGB = (value) => {
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      };

      return 0.2126 * toSRGB(r) + 0.7152 * toSRGB(g) + 0.0722 * toSRGB(b);
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  static analyzeAccessibility(style, content) {
    const issues = [];
    const suggestions = [];

    // Font size analysis
    const fontSize = parseInt(style.fontSize);
    if (fontSize < 16) {
      issues.push({
        type: 'fontSize',
        severity: 'warning',
        message: 'Font size may be too small for comfortable reading'
      });
      suggestions.push({
        property: 'fontSize',
        value: '16px',
        reason: 'Improve readability with larger font size'
      });
    }

    // Line height analysis
    const lineHeight = parseFloat(style.lineHeight);
    if (lineHeight < 1.5) {
      issues.push({
        type: 'lineHeight',
        severity: 'warning',
        message: 'Line height should be at least 1.5 for better readability'
      });
      suggestions.push({
        property: 'lineHeight',
        value: '1.5',
        reason: 'Improve text spacing for better readability'
      });
    }

    // Color contrast analysis
    if (style.color && style.backgroundColor) {
      const contrastRatio = this.calculateContrastRatio(style.color, style.backgroundColor);
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && style.fontWeight >= 700);
      
      const requiredRatio = isLargeText 
        ? this.WCAG_CONTRAST_LEVELS.AA.large 
        : this.WCAG_CONTRAST_LEVELS.AA.normal;

      if (contrastRatio < requiredRatio) {
        issues.push({
          type: 'contrast',
          severity: 'error',
          message: 'Insufficient color contrast ratio'
        });
        suggestions.push({
          property: 'color',
          value: this.suggestAccessibleColor(style.backgroundColor, requiredRatio),
          reason: 'Improve color contrast for better readability'
        });
      }
    }

    return { issues, suggestions };
  }

  static suggestAccessibleColor(backgroundColor, targetRatio) {
    // Implementation to suggest a color that meets contrast requirements
    // This is a simplified version
    const baseColors = ['#000000', '#FFFFFF'];
    let bestColor = baseColors[0];
    let bestRatio = this.calculateContrastRatio(baseColors[0], backgroundColor);

    baseColors.forEach(color => {
      const ratio = this.calculateContrastRatio(color, backgroundColor);
      if (ratio > targetRatio && ratio > bestRatio) {
        bestColor = color;
        bestRatio = ratio;
      }
    });

    return bestColor;
  }
} 