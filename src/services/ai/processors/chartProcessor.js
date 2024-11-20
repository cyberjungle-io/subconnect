import { isValidColor } from '../../../utils/colorUtils';
import { validateDateFormat } from '../../../utils/dateUtils';
import { validateNumberFormat } from '../../../utils/numberUtils';

export const chartProcessor = {
  // Main processor function
  processChartCommand: (command, currentConfig) => {
    const processors = [
      processChartType,
      processDataConfig,
      processVisualElements,
      processAxisConfig,
      processTooltipConfig
    ];

    for (const processor of processors) {
      const result = processor(command, currentConfig);
      if (result) return result;
    }

    return null;
  },

  // Validation function
  validateChartConfig: (config) => {
    const validators = [
      validateChartType,
      validateDataConfig,
      validateVisualElements,
      validateAxisConfig,
      validateTooltipConfig
    ];

    return validators.every(validator => validator(config));
  }
};

// Individual processors
function processChartType(command, currentConfig) {
  const chartTypes = ['line', 'bar', 'area', 'pie'];
  const typeMatches = command.match(/(?:make|change|set|convert to|use)(?:\s+it(?:\s+to)?|\s+chart(?:\s+to)?)?\s+(${chartTypes.join('|')})(?:\s+chart)?/i);

  if (typeMatches) {
    return {
      type: 'UPDATE_CHART_TYPE',
      config: {
        chartType: typeMatches[1].toLowerCase(),
        key: Date.now() // Force refresh
      }
    };
  }
  return null;
}

function processDataConfig(command, currentConfig) {
  // Process query selection
  const queryMatch = command.match(/use(?:\s+data\s+from)?\s+(?:the\s+)?query\s+["'](.+?)["']/i);
  if (queryMatch) {
    return {
      type: 'UPDATE_CHART_DATA',
      config: {
        selectedQueryId: queryMatch[1],
        key: Date.now()
      }
    };
  }

  // Process series configuration
  const seriesMatch = command.match(/(?:rename|change)\s+series\s+["'](.+?)["']\s+to\s+["'](.+?)["']/i);
  if (seriesMatch) {
    return {
      type: 'UPDATE_SERIES_NAME',
      config: {
        seriesNames: {
          ...currentConfig.seriesNames,
          [seriesMatch[1]]: seriesMatch[2]
        }
      }
    };
  }

  // Process series color
  const colorMatch = command.match(/set\s+(?:the\s+)?color\s+(?:of\s+)?(?:series\s+)?["'](.+?)["']\s+to\s+(.+)/i);
  if (colorMatch && isValidColor(colorMatch[2])) {
    return {
      type: 'UPDATE_SERIES_COLOR',
      config: {
        lineColors: {
          ...currentConfig.lineColors,
          [colorMatch[1]]: colorMatch[2]
        }
      }
    };
  }

  return null;
}

function processVisualElements(command, currentConfig) {
  // Process title configuration
  const titleMatch = command.match(/set\s+(?:the\s+)?(?:chart\s+)?title\s+to\s+["'](.+?)["'](?:\s+in\s+(.+?)(?:\s+(\d+)px)?)?/i);
  if (titleMatch) {
    const config = {
      title: titleMatch[1]
    };
    
    if (titleMatch[2] && isValidColor(titleMatch[2])) {
      config.titleColor = titleMatch[2];
    }
    
    if (titleMatch[3]) {
      config.titleFontSize = parseInt(titleMatch[3]);
    }

    return {
      type: 'UPDATE_CHART_TITLE',
      config
    };
  }

  // Process legend configuration
  const legendMatch = command.match(/(show|hide)\s+(?:the\s+)?legend(?:\s+(?:at|on)\s+(?:the\s+)?(top|bottom|left|right))?/i);
  if (legendMatch) {
    return {
      type: 'UPDATE_LEGEND_CONFIG',
      config: {
        showLegend: legendMatch[1].toLowerCase() === 'show',
        ...(legendMatch[2] && { legendPosition: legendMatch[2].toLowerCase() })
      }
    };
  }

  // Process grid configuration
  const gridMatch = command.match(/(show|hide)\s+(?:the\s+)?grid(?:\s+lines)?(?:\s+in\s+(.+))?/i);
  if (gridMatch) {
    return {
      type: 'UPDATE_GRID_CONFIG',
      config: {
        showGrid: gridMatch[1].toLowerCase() === 'show',
        ...(gridMatch[2] && isValidColor(gridMatch[2]) && { gridColor: gridMatch[2] })
      }
    };
  }

  return null;
}

function processAxisConfig(command, currentConfig) {
  // Process X-axis configuration
  const xAxisFormatMatch = command.match(/format\s+(?:the\s+)?x-axis\s+(?:dates?\s+)?(?:as|to|in)\s+["'](.+?)["']/i);
  if (xAxisFormatMatch && validateDateFormat(xAxisFormatMatch[1])) {
    return {
      type: 'UPDATE_XAXIS_CONFIG',
      config: {
        xAxisDataType: 'date',
        dateFormat: xAxisFormatMatch[1]
      }
    };
  }

  // Process Y-axis configuration
  const yAxisFormatMatch = command.match(/format\s+(?:the\s+)?y-axis\s+(?:values?\s+)?(?:as|to|in)\s+["'](.+?)["']/i);
  if (yAxisFormatMatch && validateNumberFormat(yAxisFormatMatch[1])) {
    return {
      type: 'UPDATE_YAXIS_CONFIG',
      config: {
        yAxisDataType: 'number',
        numberFormat: yAxisFormatMatch[1]
      }
    };
  }

  return null;
}

function processTooltipConfig(command, currentConfig) {
  // Process tooltip configuration
  const tooltipMatch = command.match(/set\s+(?:the\s+)?tooltip\s+(?:background\s+to\s+(.+?))?(?:\s+(?:and|with)\s+(?:border|border\s+color)\s+(.+?))?(?:\s+(?:and)\s+(?:text|text\s+color)\s+(.+?))?/i);
  
  if (tooltipMatch) {
    const config = {};
    
    if (tooltipMatch[1] && isValidColor(tooltipMatch[1])) {
      config.tooltipBackgroundColor = tooltipMatch[1];
    }
    
    if (tooltipMatch[2] && isValidColor(tooltipMatch[2])) {
      config.tooltipBorderColor = tooltipMatch[2];
    }
    
    if (tooltipMatch[3] && isValidColor(tooltipMatch[3])) {
      config.tooltipTextColor = tooltipMatch[3];
    }

    if (Object.keys(config).length > 0) {
      return {
        type: 'UPDATE_TOOLTIP_CONFIG',
        config
      };
    }
  }

  return null;
}

// Add these validation functions before or after the processor functions
function validateChartType(config) {
  return ['line', 'bar', 'area', 'pie'].includes(config.chartType);
}

function validateDataConfig(config) {
  return config.selectedQueryId != null;
}

function validateVisualElements(config) {
  return true; // Add specific validation logic if needed
}

function validateAxisConfig(config) {
  return true; // Add specific validation logic if needed
}

function validateTooltipConfig(config) {
  return true; // Add specific validation logic if needed
} 