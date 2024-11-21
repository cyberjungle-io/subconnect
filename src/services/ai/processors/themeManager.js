export class ThemeManager {
  constructor(context) {
    this.context = context;
    this.theme = context.state.theme || {};
  }

  getThemeTokens(componentType) {
    return {
      colors: this.getColorTokens(componentType),
      spacing: this.getSpacingTokens(componentType),
      typography: this.getTypographyTokens(componentType)
    };
  }

  getColorTokens(componentType) {
    const baseTokens = {
      primary: this.theme.colors?.primary || '#007bff',
      secondary: this.theme.colors?.secondary || '#6c757d',
      background: this.theme.colors?.background || '#ffffff'
    };

    // Component-specific color tokens
    const componentTokens = this.theme.components?.[componentType]?.colors || {};
    return { ...baseTokens, ...componentTokens };
  }

  getSpacingTokens(componentType) {
    return {
      base: this.theme.spacing?.base || '8px',
      small: this.theme.spacing?.small || '4px',
      large: this.theme.spacing?.large || '16px',
      componentSpecific: this.theme.components?.[componentType]?.spacing
    };
  }

  getTypographyTokens(componentType) {
    return {
      fontSize: this.theme.typography?.fontSize || '16px',
      fontFamily: this.theme.typography?.fontFamily || 'sans-serif',
      componentSpecific: this.theme.components?.[componentType]?.typography
    };
  }
} 