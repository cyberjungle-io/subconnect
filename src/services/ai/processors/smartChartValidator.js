export class SmartChartValidator {
  validate(config, data) {
    const validationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Perform comprehensive validation
    this.validateBasicRequirements(config, validationResult);
    this.validateDataCompatibility(config, data, validationResult);
    this.validateVisualEffectiveness(config, data, validationResult);
    this.validateAccessibility(config, validationResult);
    this.validatePerformance(config, data, validationResult);

    return validationResult;
  }

  validateBasicRequirements(config, result) {
    // Check required properties
    const requiredProps = ['chartType', 'dataKeys', 'nameKey'];
    for (const prop of requiredProps) {
      if (!config[prop]) {
        result.isValid = false;
        result.errors.push(`Missing required property: ${prop}`);
      }
    }
  }

  validateDataCompatibility(config, data, result) {
    // Check if chart type is appropriate for data structure
    if (config.chartType === 'pie' && config.dataKeys.length > 1) {
      result.warnings.push('Pie charts are not recommended for multiple data series');
      result.suggestions.push('Consider using a bar or line chart for multiple series');
    }

    // Check data scale appropriateness
    if (config.chartType === 'line' && this.hasLargeValueGaps(data)) {
      result.warnings.push('Large value gaps detected in line chart');
      result.suggestions.push('Consider using a logarithmic scale or different chart type');
    }
  }

  validateVisualEffectiveness(config, data, result) {
    // Check color contrast
    if (config.lineColors) {
      for (const [series, color] of Object.entries(config.lineColors)) {
        if (!this.hasAdequateContrast(color, config.backgroundColor)) {
          result.warnings.push(`Low contrast for series: ${series}`);
        }
      }
    }

    // Check data density
    if (data.length > 50 && config.chartType === 'bar') {
      result.warnings.push('High data density for bar chart');
      result.suggestions.push('Consider using a line chart or data aggregation');
    }
  }

  validateAccessibility(config, result) {
    // Check for colorblind-friendly colors
    if (!this.isColorblindFriendly(config.lineColors)) {
      result.warnings.push('Color scheme may not be colorblind-friendly');
      result.suggestions.push('Consider using a colorblind-friendly palette');
    }

    // Check for adequate text size
    if (config.titleFontSize < 16 || config.labelFontSize < 12) {
      result.warnings.push('Font sizes may be too small for accessibility');
    }
  }

  validatePerformance(config, data, result) {
    // Check data point density
    if (data.length * config.dataKeys.length > 1000) {
      result.warnings.push('Large number of data points may affect performance');
      result.suggestions.push('Consider data sampling or aggregation');
    }

    // Check animation performance
    if (config.animations && data.length > 500) {
      result.warnings.push('Animations may be sluggish with large dataset');
      result.suggestions.push('Consider disabling animations for better performance');
    }
  }
} 