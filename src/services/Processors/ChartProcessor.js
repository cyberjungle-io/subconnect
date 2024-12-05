export class ChartProcessor {
  static chartPatterns = [
    /(?:change|switch|set|make|convert)\s+(?:the\s+)?(?:chart|graph)\s+(?:type\s+)?(?:to\s+)?(line|bar|area|pie)/i,
    /(?:add|set|update)\s+(?:the\s+)?data\s+keys?/i,
    /(?:show|hide|toggle)\s+(?:the\s+)?(legend|grid|data\s+points|x\s*axis|y\s*axis)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+(?:title|size|width|height)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:title|axis)\s+(?:color|font|size|alignment)/i,
    /(?:list|show|display|get)\s+(?:all\s+)?(?:available\s+)?queries/i,
    /(?:what|which)\s+queries\s+(?:are\s+)?(?:available|exist|do\s+i\s+have)/i,
    /(?:find|search|look\s+for)\s+(?:a\s+)?query/i
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

  static processCommand(input, currentProps = {}, state = null) {
    console.log("ChartProcessor received input:", input, "Current props:", currentProps);
    const lowercaseInput = input.toLowerCase();

    // Process query listing commands
    const queryListPattern = /(?:list|show|display|get)\s+(?:all\s+)?(?:available\s+)?queries|(?:what|which)\s+queries\s+(?:are\s+)?(?:available|exist|do\s+i\s+have)/i;
    
    if (queryListPattern.test(lowercaseInput)) {
      // Check if we have access to the state and queries
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the saved queries at the moment. Please try again later."
        };
      }

      const queries = state.w3s.queries.list;
      if (queries.length === 0) {
        return {
          props: currentProps,
          message: "There are no saved queries available. You can create new queries in the Data Modal."
        };
      }

      // Format the query list
      const queryList = queries.map((query, index) => 
        `${index + 1}. "${query.name}" (${query.resultType})`
      ).join('\n');

      return {
        props: currentProps,
        message: `Here are the available queries:\n${queryList}\n\nYou can use these queries to populate your chart data.`
      };
    }

    // Process query search commands
    const searchPattern = /(?:find|search|look\s+for)\s+(?:a\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i;
    const searchMatch = lowercaseInput.match(searchPattern);
    
    if (searchMatch) {
      const searchTerm = searchMatch[1].toLowerCase();
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the saved queries at the moment. Please try again later."
        };
      }

      const queries = state.w3s.queries.list;
      const matchingQueries = queries.filter(query => 
        query.name.toLowerCase().includes(searchTerm)
      );

      if (matchingQueries.length === 0) {
        return {
          props: currentProps,
          message: `No queries found matching "${searchMatch[1]}". Try listing all queries to see what's available.`
        };
      }

      const queryList = matchingQueries.map((query, index) => 
        `${index + 1}. "${query.name}"\n   Type: ${query.resultType}\n   Source: ${query.querySource || 'N/A'}`
      ).join('\n');

      return {
        props: currentProps,
        message: `Found ${matchingQueries.length} matching ${matchingQueries.length === 1 ? 'query' : 'queries'}:\n${queryList}`
      };
    }

    // Continue with existing chart processing logic...
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