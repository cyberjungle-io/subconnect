export class StyleInferenceEngine {
  constructor(context) {
    this.context = context;
    this.themeTokens = this.context.state.theme || {};
  }

  inferStyles(command) {
    return {
      ...this.inferFromSiblings(command),
      ...this.inferFromTheme(command),
      ...this.inferFromContent(command),
      ...command.style // Original styles take precedence
    };
  }

  inferFromSiblings(command) {
    const siblings = this.getSiblingComponents(command);
    return this.analyzeCommonStyles(siblings);
  }

  inferFromTheme(command) {
    const componentType = command.componentType.toLowerCase();
    return {
      color: this.themeTokens[`${componentType}Color`],
      backgroundColor: this.themeTokens[`${componentType}Background`],
      padding: this.themeTokens[`${componentType}Padding`],
      // Add more theme-based styles
    };
  }

  inferFromContent(command) {
    // Analyze content to suggest appropriate styles
    if (command.props.content) {
      return this.analyzeContentForStyles(command.props.content);
    }
    return {};
  }

  getSiblingComponents(command) {
    if (!command.parentId) return [];
    const parent = this.context.findComponentById(command.parentId);
    return parent?.children || [];
  }

  analyzeCommonStyles(siblings) {
    if (!siblings.length) return {};

    const styleFrequency = {};
    siblings.forEach(sibling => {
      Object.entries(sibling.style).forEach(([key, value]) => {
        if (!styleFrequency[key]) {
          styleFrequency[key] = {};
        }
        styleFrequency[key][value] = (styleFrequency[key][value] || 0) + 1;
      });
    });

    return Object.entries(styleFrequency).reduce((acc, [property, values]) => {
      const [mostCommon] = Object.entries(values)
        .sort((a, b) => b[1] - a[1]);
      if (mostCommon && mostCommon[1] > siblings.length / 2) {
        acc[property] = mostCommon[0];
      }
      return acc;
    }, {});
  }

  analyzeContentForStyles(content) {
    const styles = {};
    
    // Infer text styles based on content
    if (content.length > 100) {
      styles.fontSize = '14px';
      styles.lineHeight = '1.6';
    } else if (content.length < 20) {
      styles.fontSize = '24px';
      styles.fontWeight = 'bold';
    }

    // Infer emphasis styles
    if (content.includes('!')) {
      styles.fontWeight = 'bold';
      styles.color = this.themeTokens.emphasisColor || '#ff0000';
    }

    return styles;
  }
} 