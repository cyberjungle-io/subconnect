export class ChartProcessor {
  static chartPatterns = [
    /(?:change|switch|set|make|convert)\s+(?:the\s+)?(?:chart|graph)\s+(?:type\s+)?(?:to\s+)?(line|bar|area|pie)/i,
    /(?:add|set|update)\s+(?:the\s+)?data\s+keys?/i,
    /(?:show|hide|toggle)\s+(?:the\s+)?(legend|grid|data\s+points|x\s*axis|y\s*axis)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+(?:title|size|width|height)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:title|axis)\s+(?:color|font|size|alignment)/i,
  ];

  static isChartCommand(input) {
    return this.chartPatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static getStylePatterns() {
    return {
      chartType: [
        /(?:change|switch|set|make|convert)\s+(?:the\s+)?(?:chart|graph)\s+(?:type\s+)?(?:to\s+)?(line|bar|area|pie)/i,
      ],
      visibility: [
        /(?:show|hide|toggle)\s+(?:the\s+)?(legend|grid|data\s+points|x\s*axis|y\s*axis)/i,
      ],
      title: [
        /(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+title\s+(?:to\s+)?["'](.+?)["']/i,
        /(?:set|change|update)\s+(?:the\s+)?title\s+(?:font\s+)?size\s+(?:to\s+)?(\d+)(?:px)?/i,
        /(?:set|change|update)\s+(?:the\s+)?title\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
        /(?:set|change|update)\s+(?:the\s+)?title\s+alignment\s+(?:to\s+)?(left|center|right)/i,
      ],
      size: [
        /(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+width\s+(?:to\s+)?(\d+)(?:px)?/i,
        /(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+height\s+(?:to\s+)?(\d+)(?:px)?/i,
      ],
    };
  }

  static getPropertyNames() {
    return {
      chartType: "chart type",
      showLegend: "legend visibility",
      showGrid: "grid visibility",
      showDataPoints: "data points visibility",
      showXAxis: "x-axis visibility",
      showYAxis: "y-axis visibility",
      title: "chart title",
      titleFontSize: "title font size",
      titleColor: "title color",
      titleAlign: "title alignment",
      width: "chart width",
      height: "chart height",
    };
  }

  static processCommand(input, currentProps = {}) {
    console.log("ChartProcessor received input:", input, "Current props:", currentProps);
    const lowercaseInput = input.toLowerCase();

    // Process chart type changes
    const chartTypeMatch = lowercaseInput.match(/(?:change|switch|set|make|convert)\s+(?:the\s+)?(?:chart|graph)\s+(?:type\s+)?(?:to\s+)?(line|bar|area|pie)/i);
    if (chartTypeMatch) {
      const chartType = chartTypeMatch[1].toLowerCase();
      return {
        props: {
          ...currentProps,
          chartType: chartType
        }
      };
    }

    // Process visibility toggles
    const visibilityMatch = lowercaseInput.match(/(?:show|hide|toggle)\s+(?:the\s+)?(legend|grid|data\s*points|x\s*axis|y\s*axis)/i);
    if (visibilityMatch) {
      const element = visibilityMatch[1].toLowerCase().replace(/\s+/g, '');
      const isHiding = lowercaseInput.includes('hide');
      const propMap = {
        'legend': 'showLegend',
        'grid': 'showGrid',
        'datapoints': 'showDataPoints',
        'xaxis': 'showXAxis',
        'yaxis': 'showYAxis'
      };
      
      const propName = propMap[element];
      if (propName) {
        return {
          props: {
            ...currentProps,
            [propName]: !isHiding
          }
        };
      }
    }

    // Process title changes
    const titleMatch = input.match(/(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+title\s+(?:to\s+)?["'](.+?)["']/i);
    if (titleMatch) {
      return {
        props: {
          ...currentProps,
          title: titleMatch[1]
        }
      };
    }

    // Process title font size
    const titleSizeMatch = input.match(/(?:set|change|update)\s+(?:the\s+)?title\s+(?:font\s+)?size\s+(?:to\s+)?(\d+)(?:px)?/i);
    if (titleSizeMatch) {
      return {
        props: {
          ...currentProps,
          titleFontSize: parseInt(titleSizeMatch[1])
        }
      };
    }

    // Process title color
    const titleColorMatch = input.match(/(?:set|change|update)\s+(?:the\s+)?title\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i);
    if (titleColorMatch) {
      return {
        props: {
          ...currentProps,
          titleColor: titleColorMatch[1]
        }
      };
    }

    // Process title alignment
    const titleAlignMatch = input.match(/(?:set|change|update)\s+(?:the\s+)?title\s+alignment\s+(?:to\s+)?(left|center|right)/i);
    if (titleAlignMatch) {
      return {
        props: {
          ...currentProps,
          titleAlign: titleAlignMatch[1]
        }
      };
    }

    // Process size changes
    const widthMatch = input.match(/(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+width\s+(?:to\s+)?(\d+)(?:px)?/i);
    if (widthMatch) {
      return {
        props: {
          ...currentProps,
          width: `${widthMatch[1]}px`
        }
      };
    }

    const heightMatch = input.match(/(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+height\s+(?:to\s+)?(\d+)(?:px)?/i);
    if (heightMatch) {
      return {
        props: {
          ...currentProps,
          height: `${heightMatch[1]}px`
        }
      };
    }

    return null;
  }
} 