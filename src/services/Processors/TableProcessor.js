export class TableProcessor {
  static tablePatterns = [
    /(?:show|hide|toggle)\s+(?:the\s+)?(?:header|borders?)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:header|row|text|border)\s+color/i,
    /(?:set|change|update)\s+(?:the\s+)?page\s+size/i,
    /(?:show|hide|toggle)\s+(?:the\s+)?columns?\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:rename|change)\s+(?:the\s+)?column\s+(?:called|named)?\s*["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i,
    /(?:sort|order)\s+(?:by|using)\s+(?:the\s+)?column\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:filter|show only)\s+(?:rows?\s+)?where\s+["']?([^"']+)["']?\s+(?:is|equals|contains|matches)\s+["']?([^"']+)["']?/i,
    /(?:list|show|display|get)\s+(?:all\s+)?(?:available\s+)?queries/i,
    /(?:select|use|choose)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:show|list|display)\s+(?:available\s+)?(?:field|column)\s+options/i,
    /(?:add|set|use)\s+(?:the\s+)?fields?\s+(?:called|named)?\s*["']?([^"']+)["']?(?:\s+(?:and|,)\s*["']?([^"']+)["']?)*/i,
  ];

  static isTableCommand(input) {
    return this.tablePatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static getStylePatterns() {
    return {
      visibility: [
        /(?:show|hide|toggle)\s+(?:the\s+)?(header|borders?)/i,
      ],
      colors: [
        /(?:set|change|update)\s+(?:the\s+)?header\s+(?:background\s+)?color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
        /(?:set|change|update)\s+(?:the\s+)?row\s+(?:background\s+)?color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
        /(?:set|change|update)\s+(?:the\s+)?alternate\s+row\s+(?:background\s+)?color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
        /(?:set|change|update)\s+(?:the\s+)?(?:text|font)\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
        /(?:set|change|update)\s+(?:the\s+)?border\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i,
      ],
      pagination: [
        /(?:set|change|update)\s+(?:the\s+)?page\s+size\s+(?:to\s+)?(\d+)/i,
      ]
    };
  }

  static getPropertyNames() {
    return {
      showHeader: "header visibility",
      showBorder: "border visibility",
      headerBackgroundColor: "header background color",
      rowBackgroundColor: "row background color",
      alternateRowBackgroundColor: "alternate row background color",
      rowTextColor: "text color",
      borderColor: "border color",
      pageSize: "page size"
    };
  }

  static processCommand(input, currentProps = {}, state = null) {
    const lowercaseInput = input.toLowerCase();

    // Handle query selection
    if (input.startsWith('__queryOption__:')) {
      const [queryName, option] = input.replace('__queryOption__:', '').split('::');
      return this.processQueryOption(queryName, option, currentProps, state);
    }

    // Handle field selection
    if (input.startsWith('__fieldOption__:')) {
      const [field, option] = input.replace('__fieldOption__:', '').split('::');
      return this.processFieldOption(field, option, currentProps);
    }

    // Process query listing commands
    const queryListPattern = /(?:list|show|display|get)\s+(?:all\s+)?(?:available\s+)?queries/i;
    if (queryListPattern.test(lowercaseInput)) {
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the saved queries at the moment. Please ensure you have loaded your queries in the Data Modal."
        };
      }

      return {
        props: currentProps,
        message: "Available Queries:",
        options: state.w3s.queries.list.map(query => this.formatQueryDetails(query))
      };
    }

    // Process field options listing
    const fieldOptionsPattern = /(?:show|list|display)\s+(?:available\s+)?(?:field|column)\s+options/i;
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

    // Handle visibility toggles
    const visibilityMatch = lowercaseInput.match(/(?:show|hide|toggle)\s+(?:the\s+)?(header|borders?)/i);
    if (visibilityMatch) {
      const element = visibilityMatch[1].toLowerCase().replace(/s$/, '');
      const isHiding = lowercaseInput.includes('hide');
      const propMap = {
        'header': 'showHeader',
        'border': 'showBorder'
      };

      const propName = propMap[element];
      if (propName) {
        return {
          props: {
            ...currentProps,
            [propName]: !isHiding
          },
          message: `${isHiding ? 'Hidden' : 'Showing'} the table ${element}`,
          success: true
        };
      }
    }

    // Handle color changes
    const colorMatch = lowercaseInput.match(/(?:set|change|update)\s+(?:the\s+)?(header|row|alternate row|text|border)\s+(?:background\s+)?color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-z]+)/i);
    if (colorMatch) {
      const [_, element, color] = colorMatch;
      const propMap = {
        'header': 'headerBackgroundColor',
        'row': 'rowBackgroundColor',
        'alternate row': 'alternateRowBackgroundColor',
        'text': 'rowTextColor',
        'border': 'borderColor'
      };

      const propName = propMap[element.toLowerCase()];
      if (propName) {
        return {
          props: {
            ...currentProps,
            [propName]: color
          },
          message: `Updated the ${element.toLowerCase()} color to ${color}`,
          success: true
        };
      }
    }

    // Handle page size changes
    const pageSizeMatch = lowercaseInput.match(/(?:set|change|update)\s+(?:the\s+)?page\s+size\s+(?:to\s+)?(\d+)/i);
    if (pageSizeMatch) {
      const pageSize = parseInt(pageSizeMatch[1]);
      return {
        props: {
          ...currentProps,
          pageSize
        },
        message: `Updated page size to ${pageSize} rows per page`,
        success: true
      };
    }

    return null;
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
      options: ['Add as column', 'Show field details']
    };
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
          message: `Available fields for ${queryName}:`,
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
            columns: [],
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

  static processFieldOption(field, option, currentProps = {}) {
    switch (option) {
      case 'Add as column':
        const newColumns = [...(currentProps.columns || [])];
        if (!newColumns.some(col => col.key === field)) {
          newColumns.push({
            key: field,
            header: field,
            type: 'string' // You might want to determine this from the field metadata
          });
        }
        return {
          props: {
            ...currentProps,
            columns: newColumns,
            key: Date.now()
          },
          message: `Added ${field} as a column`
        };
      case 'Show field details':
        return {
          props: currentProps,
          message: `Field: ${field}\nType: String\nDescription: Data field that can be used as a table column`
        };
      default:
        return null;
    }
  }

  static getSuggestions(state = null) {
    return [
      {
        text: "Table Visibility",
        type: "category",
        options: [
          { text: "show header", type: "command" },
          { text: "hide header", type: "command" },
          { text: "show borders", type: "command" },
          { text: "hide borders", type: "command" }
        ]
      },
      {
        text: "Data Management",
        type: "category",
        options: [
          {
            text: "Available Queries",
            type: "info"
          },
          {
            text: "To select a query, click one of the options below:",
            type: "info"
          },
          ...((state?.w3s?.queries?.list || []).map(query => ({
            text: query.name,
            type: 'query',
            value: query.name,
            options: ['List available fields', 'Show query details', 'Select query']
          })))
        ]
      },
      {
        text: "Colors",
        type: "category",
        options: [
          { text: "set header color to #e6f3ff", type: "command" },
          { text: "set row color to white", type: "command" },
          { text: "set alternate row color to #f9fafb", type: "command" },
          { text: "set text color to #374151", type: "command" },
          { text: "set border color to #e5e7eb", type: "command" }
        ]
      },
      {
        text: "Pagination",
        type: "category",
        options: [
          { text: "set page size to 5", type: "command" },
          { text: "set page size to 10", type: "command" },
          { text: "set page size to 25", type: "command" }
        ]
      }
    ];
  }

  static getSuggestionsWithState(state = null) {
    const suggestions = this.getSuggestions();
    
    // Find the Data Management category
    const dataManagementCategory = suggestions.find(cat => cat.text === "Data Management");
    if (dataManagementCategory && state?.w3s?.queries?.list) {
      // Replace the options with available queries
      dataManagementCategory.options = [
        {
          text: "Available Queries",
          type: "info"
        },
        {
          text: "To select a query, click one of the options below:",
          type: "info"
        },
        ...state.w3s.queries.list.map(query => ({
          text: query.name,
          type: 'query',
          value: query.name,
          options: ['List available fields', 'Show query details', 'Select query']
        }))
      ];
    }
    
    return suggestions;
  }
} 