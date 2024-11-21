export class UserPreferenceAnalyzer {
  constructor(context) {
    this.context = context;
    this.stylePreferences = new Map();
    this.layoutPreferences = new Map();
    this.componentPreferences = new Map();
  }

  analyzePreferences(command) {
    this.updateStylePreferences(command);
    this.updateLayoutPreferences(command);
    this.updateComponentPreferences(command);

    return {
      styles: this.getStyleRecommendations(),
      layout: this.getLayoutRecommendations(),
      components: this.getComponentRecommendations()
    };
  }

  updateStylePreferences(command) {
    if (command.style) {
      Object.entries(command.style).forEach(([key, value]) => {
        const preferences = this.stylePreferences.get(key) || new Map();
        preferences.set(value, (preferences.get(value) || 0) + 1);
        this.stylePreferences.set(key, preferences);
      });
    }
  }

  getPreferences(componentType) {
    return {
      styles: this.getPreferredStyles(componentType),
      layout: this.getPreferredLayout(componentType),
      components: this.getPreferredComponents(componentType)
    };
  }

  getPreferredStyles(componentType) {
    const componentStyles = this.stylePreferences.get(componentType) || new Map();
    return Object.fromEntries(
      Array.from(this.stylePreferences.entries())
        .map(([property, values]) => [
          property,
          this.getMostFrequentValue(values)
        ])
    );
  }

  getPreferredLayout(componentType) {
    const layoutPrefs = this.layoutPreferences.get(componentType) || new Map();
    return Object.fromEntries(
      Array.from(layoutPrefs.entries())
        .map(([property, values]) => [
          property,
          this.getMostFrequentValue(values)
        ])
    );
  }

  getPreferredComponents(componentType) {
    const componentPrefs = this.componentPreferences.get(componentType) || new Map();
    return Object.fromEntries(
      Array.from(componentPrefs.entries())
        .map(([property, values]) => [
          property,
          this.getMostFrequentValue(values)
        ])
    );
  }

  getMostFrequentValue(valuesMap) {
    if (!valuesMap || valuesMap.size === 0) return null;
    
    return Array.from(valuesMap.entries())
      .reduce((most, current) => 
        current[1] > most[1] ? current : most
      )[0];
  }
} 