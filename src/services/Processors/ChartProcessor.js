export class ChartProcessor {
  static chartPatterns = [
    /(?:change|switch|set|make|convert)\s+(?:the\s+)?(?:chart|graph)\s+(?:type\s+)?(?:to\s+)?(line|bar|area|pie)/i,
    /(?:add|set|update)\s+(?:the\s+)?data\s+keys?/i,
    /(?:show|hide|toggle)\s+(?:the\s+)?(legend|grid|data\s*points|x\s*axis|y\s*axis)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:chart|graph)\s+(?:title|size|width|height)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:title|axis)\s+(?:color|font|size|alignment)/i,
    /(?:list|show|display|get)\s+(?:all\s+)?(?:available\s+)?queries/i,
    /(?:what|which)\s+queries\s+(?:are\s+)?(?:available|exist|do\s+i\s+have)/i,
    /(?:find|search|look\s+for)\s+(?:a\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:describe|explain|tell\s+me\s+about)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:add|set|use)\s+(?:the\s+)?fields?\s+(?:called|named)?\s*["']?([^"']+)["']?(?:\s+(?:and|,)\s*["']?([^"']+)["']?)*/i,
    /(?:set|use)\s+(?:the\s+)?(?:x-axis|x\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?(?:\s+(?:and|,)\s+(?:the\s+)?(?:y-axis|y\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?)?/i,
    /(?:set|use)\s+(?:the\s+)?(?:y-axis|y\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?(?:\s+(?:and|,)\s+(?:the\s+)?(?:x-axis|x\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?)?/i,
    /(?:select|use|choose)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:show|list|display)\s+(?:available\s+)?(?:field|axis)\s+options/i
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

  static formatQueryDetails(query) {
    const details = [
      `Name: ${query.name}`,
      `Type: ${query.resultType || 'Unknown'}`,
      `Source: ${query.querySource || 'Custom'}`,
    ];
    
    if (query.description) {
      details.push(`Description: ${query.description}`);
    }
    
    if (query.fields?.length > 0) {
      details.push(`Fields: ${query.fields.map(f => f.name).join(', ')}`);
    }
    
    return {
      text: details.join('\n   '),
      clickable: true,
      type: 'query',
      value: query.name,
      options: ['List available fields', 'Show query details', 'Select query']
    };
  }

  static formatFieldOption(field) {
    return {
      text: field.name,
      clickable: true,
      type: 'field',
      value: field.name,
      options: ['Set as X-Axis', 'Set as Y-Axis', 'Add to Y-Axis', 'Show field details']
    };
  }

  static processFieldOption(field, option, currentProps = {}) {
    switch (option) {
      case 'Set as X-Axis':
        return {
          props: {
            ...currentProps,
            nameKey: field,
            key: Date.now()
          },
          message: `Set ${field} as X-Axis`
        };
      case 'Set as Y-Axis':
        return {
          props: {
            ...currentProps,
            dataKeys: [field],
            key: Date.now()
          },
          message: `Set ${field} as Y-Axis`
        };
      case 'Add to Y-Axis':
        const newDataKeys = [...(currentProps.dataKeys || [])];
        if (!newDataKeys.includes(field)) {
          newDataKeys.push(field);
        }
        return {
          props: {
            ...currentProps,
            dataKeys: newDataKeys,
            key: Date.now()
          },
          message: `Added ${field} to Y-Axis`
        };
      case 'Show field details':
        return {
          props: currentProps,
          message: `Field: ${field}\nType: Numeric\nDescription: Numeric value field that can be used for plotting`
        };
      default:
        return null;
    }
  }

  static processQueryOption(queryName, option, currentProps = {}, state = null) {
    const query = state?.w3s?.queries?.list?.find(q => q.name === queryName);
    if (!query) {
      return {
        props: currentProps,
        message: `Query "${queryName}" not found`
      };
    }

    switch (option) {
      case 'List available fields':
        return {
          props: currentProps,
          message: `Available fields for ${queryName}:\n\n${query.fields.map(field => 
            this.formatFieldOption(field).text
          ).join('\n')}`,
          options: query.fields.map(field => this.formatFieldOption(field))
        };
      case 'Show query details':
        return {
          props: currentProps,
          message: this.formatQueryDetails(query).text
        };
      case 'Select query':
        return {
          props: {
            ...currentProps,
            selectedQueryId: query._id,
            dataKeys: [],
            nameKey: '',
            data: [],
            key: Date.now()
          },
          message: `Selected query "${query.name}". Choose from the following options:`,
          options: ['List available fields', 'Show query details'].map(opt => ({
            text: opt,
            clickable: true,
            type: 'queryOption',
            value: opt,
            queryName: query.name
          }))
        };
      default:
        return null;
    }
  }

  static processCommand(input, currentProps = {}, state = null) {
    console.log("ChartProcessor received input:", input, "Current props:", currentProps);
    const lowercaseInput = input.toLowerCase();

    // Handle field option selection
    if (input.startsWith('__fieldOption__:')) {
      const [field, option] = input.replace('__fieldOption__:', '').split('::');
      return this.processFieldOption(field, option, currentProps);
    }

    // Handle query option selection
    if (input.startsWith('__queryOption__:')) {
      const [query, option] = input.replace('__queryOption__:', '').split('::');
      return this.processQueryOption(query, option, currentProps, state);
    }

    // Process field options listing
    const fieldOptionsPattern = /(?:show|list|display)\s+(?:available\s+)?(?:field|axis)\s+options/i;
    if (fieldOptionsPattern.test(lowercaseInput)) {
      if (!state?.w3s?.queries?.list || !currentProps.selectedQueryId) {
        return {
          props: currentProps,
          message: "Please select a query first before viewing field options."
        };
      }

      const query = state.w3s.queries.list.find(q => q._id === currentProps.selectedQueryId);
      if (!query) {
        return {
          props: currentProps,
          message: "Could not find the selected query. Please select a valid query first."
        };
      }

      return {
        props: currentProps,
        message: `Available fields for ${query.name}:`,
        options: query.fields.map(field => this.formatFieldOption(field))
      };
    }

    // Process query listing commands with interactive options
    const queryListPattern = /(?:list|show|display|get)\s+(?:all\s+)?(?:available\s+)?queries|(?:what|which)\s+queries\s+(?:are\s+)?(?:available|exist|do\s+i\s+have)/i;
    
    if (queryListPattern.test(lowercaseInput)) {
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the saved queries at the moment. Please ensure you have loaded your queries in the Data Modal."
        };
      }

      const queries = state.w3s.queries.list;
      if (queries.length === 0) {
        return {
          props: currentProps,
          message: "There are no saved queries available. You can create and save new queries using the Data Modal."
        };
      }

      return {
        props: currentProps,
        message: "Available Queries:",
        options: queries.map(query => this.formatQueryDetails(query))
      };
    }

    // Process query selection
    const querySelectionPattern = /(?:select|use|choose)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i;
    const querySelectionMatch = input.match(querySelectionPattern);
    
    if (querySelectionMatch) {
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the queries at the moment. Please ensure you have loaded your queries in the Data Modal."
        };
      }

      const queryName = querySelectionMatch[1];
      const query = state.w3s.queries.list.find(q => 
        q.name.toLowerCase() === queryName.toLowerCase()
      );

      if (!query) {
        const availableQueries = state.w3s.queries.list.map(q => q.name).join(', ');
        return {
          props: currentProps,
          message: `No query found with the name "${queryName}". Available queries are: ${availableQueries}`
        };
      }

      return {
        props: {
          ...currentProps,
          selectedQueryId: query._id,
          // Reset data-related props when changing query
          dataKeys: [],
          nameKey: '',
          data: []
        },
        message: `Selected query "${query.name}". Available fields are: ${query.fields.map(f => f.name).join(', ')}`,
        options: query.fields.map(field => this.formatFieldOption(field))
      };
    }

    // Process query search commands
    const searchPattern = /(?:find|search|look\s+for)\s+(?:a\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i;
    const searchMatch = lowercaseInput.match(searchPattern);
    
    if (searchMatch) {
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the saved queries at the moment. Please ensure you have loaded your queries in the Data Modal."
        };
      }

      const searchTerm = searchMatch[1].toLowerCase();
      const queries = state.w3s.queries.list;
      const matchingQueries = queries.filter(query => 
        query.name.toLowerCase().includes(searchTerm) ||
        query.description?.toLowerCase().includes(searchTerm) ||
        query.fields?.some(field => field.name.toLowerCase().includes(searchTerm))
      );

      if (matchingQueries.length === 0) {
        return {
          props: currentProps,
          message: `No queries found matching "${searchMatch[1]}". Try "list queries" to see all available queries.`
        };
      }

      const queryList = matchingQueries.map((query, index) => 
        `${index + 1}. ${this.formatQueryDetails(query)}`
      ).join('\n\n');

      return {
        props: currentProps,
        message: `Found ${matchingQueries.length} matching ${matchingQueries.length === 1 ? 'query' : 'queries'}:\n\n${queryList}`
      };
    }

    // Process query description commands
    const describePattern = /(?:describe|explain|tell\s+me\s+about)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i;
    const describeMatch = lowercaseInput.match(describePattern);

    if (describeMatch) {
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the saved queries at the moment. Please ensure you have loaded your queries in the Data Modal."
        };
      }

      const queryName = describeMatch[1].toLowerCase();
      const query = state.w3s.queries.list.find(q => q.name.toLowerCase() === queryName);

      if (!query) {
        return {
          props: currentProps,
          message: `No query found with the name "${describeMatch[1]}". Try "list queries" to see all available queries.`
        };
      }

      return {
        props: currentProps,
        message: `Query Details:\n\n${this.formatQueryDetails(query)}\n\nQuery Content:\n${query.query || 'No query content available'}`
      };
    }

    // Process field addition commands
    const fieldPattern = /(?:add|set|use)\s+(?:the\s+)?fields?\s+(?:called|named)?\s*["']?([^"']+)["']?\s*(?:(?:and|,)\s*["']?([^"']+)["']?)*/i;
    const fieldMatch = input.match(fieldPattern);
    
    if (fieldMatch) {
      if (!state?.w3s?.queries?.list || !currentProps.selectedQueryId) {
        return {
          props: currentProps,
          message: "Please select a query first using the Data Modal before adding fields."
        };
      }

      const query = state.w3s.queries.list.find(q => q._id === currentProps.selectedQueryId);
      if (!query) {
        return {
          props: currentProps,
          message: "Could not find the selected query. Please select a valid query first."
        };
      }

      // Extract all fields from the command
      const fields = input.match(/["']([^"']+)["']/g)?.map(f => f.replace(/["']/g, '')) || [];
      if (fields.length === 0) {
        return {
          props: currentProps,
          message: "Please specify the field names you want to add. For example: add fields 'revenue' and 'profit'"
        };
      }

      // Validate fields exist in the query
      const validFields = fields.filter(field => 
        query.fields.some(f => f.name.toLowerCase() === field.toLowerCase())
      );
      
      const invalidFields = fields.filter(field => 
        !query.fields.some(f => f.name.toLowerCase() === field.toLowerCase())
      );

      if (invalidFields.length > 0) {
        return {
          props: currentProps,
          message: `The following fields are not available in the query: ${invalidFields.join(', ')}. Available fields are: ${query.fields.map(f => f.name).join(', ')}`
        };
      }

      return {
        props: {
          ...currentProps,
          dataKeys: validFields
        },
        message: `Added the following fields to the chart: ${validFields.join(', ')}`
      };
    }

    // Process combined x-axis and y-axis setting
    const xAxisFirstPattern = /(?:set|use)\s+(?:the\s+)?(?:x-axis|x\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?(?:\s+(?:and|,)\s+(?:the\s+)?(?:y-axis|y\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?)?/i;
    const yAxisFirstPattern = /(?:set|use)\s+(?:the\s+)?(?:y-axis|y\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?(?:\s+(?:and|,)\s+(?:the\s+)?(?:x-axis|x\s+axis)\s+(?:to|as)\s+["']?([^"']+)["']?)?/i;
    
    const xAxisFirstMatch = input.match(xAxisFirstPattern);
    const yAxisFirstMatch = input.match(yAxisFirstPattern);
    
    if (xAxisFirstMatch || yAxisFirstMatch) {
      if (!state?.w3s?.queries?.list || !currentProps.selectedQueryId) {
        return {
          props: currentProps,
          message: "Please select a query first using the Data Modal before setting axis fields."
        };
      }

      const query = state.w3s.queries.list.find(q => q._id === currentProps.selectedQueryId);
      if (!query) {
        return {
          props: currentProps,
          message: "Could not find the selected query. Please select a valid query first."
        };
      }

      let xAxisField = xAxisFirstMatch ? xAxisFirstMatch[1] : (yAxisFirstMatch ? yAxisFirstMatch[2] : null);
      let yAxisField = xAxisFirstMatch ? xAxisFirstMatch[2] : (yAxisFirstMatch ? yAxisFirstMatch[1] : null);
      
      const updates = { ...currentProps };
      let messages = [];

      if (xAxisField) {
        if (!query.fields.some(f => f.name.toLowerCase() === xAxisField.toLowerCase())) {
          return {
            props: currentProps,
            message: `The field '${xAxisField}' is not available in the query. Available fields are: ${query.fields.map(f => f.name).join(', ')}`
          };
        }
        updates.nameKey = xAxisField;
        messages.push(`Set x-axis to '${xAxisField}'`);
      }

      if (yAxisField) {
        if (!query.fields.some(f => f.name.toLowerCase() === yAxisField.toLowerCase())) {
          return {
            props: currentProps,
            message: `The field '${yAxisField}' is not available in the query. Available fields are: ${query.fields.map(f => f.name).join(', ')}`
          };
        }
        updates.dataKeys = [yAxisField];
        messages.push(`Set y-axis to '${yAxisField}'`);
      }

      // Add a key to force re-render and trigger query execution
      updates.key = Date.now();
      
      // Reset data to trigger a fresh query
      updates.data = [];

      return {
        props: updates,
        message: messages.join(' and ')
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