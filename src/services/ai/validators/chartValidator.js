import { isValidColor } from '../../../utils/colorUtils';
import { validateDateFormat } from '../../../utils/dateUtils';
import { validateNumberFormat } from '../../../utils/numberUtils';

export const chartValidator = {
  validateChartType: (config) => {
    const validTypes = ['line', 'bar', 'area', 'pie'];
    return validTypes.includes(config.chartType);
  },

  validateDataConfig: (config) => {
    // Validate query selection
    if (!config.selectedQueryId) return false;
    
    // Validate data keys
    if (!config.dataKeys || !Array.isArray(config.dataKeys) || config.dataKeys.length === 0) return false;
    
    // Validate name key
    if (!config.nameKey) return false;

    // Validate series names and colors if present
    if (config.seriesNames) {
      for (const color of Object.values(config.lineColors || {})) {
        if (!isValidColor(color)) return false;
      }
    }

    return true;
  },

  validateVisualElements: (config) => {
    // Validate title configuration
    if (config.title) {
      if (config.titleFontSize && typeof config.titleFontSize !== 'number') return false;
      if (config.titleColor && !isValidColor(config.titleColor)) return false;
      if (config.titleAlign && !['left', 'center', 'right'].includes(config.titleAlign)) return false;
    }

    // Validate legend configuration
    if (config.showLegend !== undefined) {
      if (config.legendPosition && !['top', 'right', 'bottom', 'left'].includes(config.legendPosition)) {
        return false;
      }
    }

    // Validate grid configuration
    if (config.showGrid !== undefined) {
      if (config.gridColor && !isValidColor(config.gridColor)) return false;
    }

    return true;
  },

  validateAxisConfig: (config) => {
    // Validate X-axis configuration
    if (config.xAxisDataType) {
      if (!['category', 'date', 'number'].includes(config.xAxisDataType)) return false;
      
      if (config.xAxisDataType === 'date' && config.dateFormat) {
        if (!validateDateFormat(config.dateFormat)) return false;
      }
    }

    // Validate Y-axis configuration
    if (config.yAxisDataType) {
      if (!['number', 'category'].includes(config.yAxisDataType)) return false;
      
      if (config.yAxisDataType === 'number' && config.numberFormat) {
        if (!validateNumberFormat(config.numberFormat)) return false;
      }
    }

    return true;
  },

  validateTooltipConfig: (config) => {
    const colorProps = [
      'tooltipBackgroundColor',
      'tooltipBorderColor',
      'tooltipTextColor'
    ];

    for (const prop of colorProps) {
      if (config[prop] && !isValidColor(config[prop])) return false;
    }

    if (config.tooltipValueFormat && !validateNumberFormat(config.tooltipValueFormat)) {
      return false;
    }

    return true;
  }
}; 