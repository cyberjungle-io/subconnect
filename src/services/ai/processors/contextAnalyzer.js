export class ContextAnalyzer {
  constructor(context) {
    this.context = context;
  }

  analyzeCommandContext(command) {
    return {
      recentActions: this.getRecentRelatedActions(command),
      relatedComponents: this.findRelatedComponents(command),
      suggestedProperties: this.suggestProperties(command)
    };
  }

  getRecentRelatedActions(command) {
    return this.context.history
      .filter(entry => entry.command.componentType === command.componentType)
      .slice(-3);
  }

  findRelatedComponents(command) {
    const components = this.context.findComponentsByType(command.componentType);
    return components.map(component => ({
      id: component.id,
      name: component.props.name,
      similarity: this.calculateSimilarity(command, component)
    })).sort((a, b) => b.similarity - a.similarity);
  }

  suggestProperties(command) {
    const similarComponents = this.findRelatedComponents(command);
    if (similarComponents.length === 0) return {};

    // Analyze common properties among similar components
    return this.analyzeCommonProperties(similarComponents);
  }

  calculateSimilarity(command, component) {
    // Implement similarity scoring based on properties and context
    let score = 0;
    
    // Check property similarity
    const commandProps = Object.keys(command.props);
    const componentProps = Object.keys(component.props);
    const commonProps = commandProps.filter(prop => componentProps.includes(prop));
    
    score += commonProps.length / Math.max(commandProps.length, componentProps.length);
    
    // Check style similarity
    const styleScore = this.calculateStyleSimilarity(command.style, component.style);
    score += styleScore;
    
    return score / 2; // Normalize to 0-1
  }

  analyzeCommonProperties(components) {
    // Implement property analysis logic
    const propertyFrequency = {};
    components.forEach(component => {
      Object.entries(component.props).forEach(([key, value]) => {
        if (!propertyFrequency[key]) {
          propertyFrequency[key] = { count: 0, values: {} };
        }
        propertyFrequency[key].count++;
        propertyFrequency[key].values[value] = (propertyFrequency[key].values[value] || 0) + 1;
      });
    });

    return Object.entries(propertyFrequency)
      .filter(([_, data]) => data.count > components.length / 2)
      .reduce((acc, [key, data]) => {
        const mostCommonValue = Object.entries(data.values)
          .sort((a, b) => b[1] - a[1])[0][0];
        acc[key] = mostCommonValue;
        return acc;
      }, {});
  }
} 