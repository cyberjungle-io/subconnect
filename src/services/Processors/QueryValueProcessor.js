export class QueryValueProcessor {
  static queryValuePatterns = [
    /(?:select|use|choose)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:set|use|display)\s+(?:the\s+)?field\s+(?:to|as)?\s*["']?([^"']+)["']?/i,
    /(?:format|show|display)\s+(?:as|with)?\s+(?:percentage|percent|%)/i,
    /(?:add|set|use)\s+(?:prefix|suffix)\s+(?:to|as)?\s*["']?([^"']+)["']?/i,
    /(?:set|use|show)\s+(\d+)\s+decimal\s+places?/i,
    /(?:use|show|display|format\s+with)\s+commas?/i,
    /(?:set|change|make)\s+(?:prefix|suffix)\s+(?:color|size)\s+(?:to|as)?\s*(.*)/i,
    /(?:move|position|place)\s+suffix\s+(?:to|at|on)?\s+(top|middle|bottom)/i
  ];

  static isQueryValueCommand(input) {
    return this.queryValuePatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static processCommand(input, currentProps = {}, state = null) {
    const lowercaseInput = input.toLowerCase();

    // Handle query selection
    const querySelectionMatch = input.match(/(?:select|use|choose)\s+(?:the\s+)?query\s+(?:called|named)?\s*["']?([^"']+)["']?/i);
    if (querySelectionMatch) {
      if (!state?.w3s?.queries?.list) {
        return {
          props: currentProps,
          message: "I cannot access the queries at the moment. Please ensure you have loaded your queries."
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
          queryId: query._id,
          field: ''
        },
        message: `Selected query "${query.name}". Available fields are: ${query.fields.map(f => f.name).join(', ')}`
      };
    }

    // Handle field selection
    const fieldMatch = input.match(/(?:set|use|display)\s+(?:the\s+)?field\s+(?:to|as)?\s*["']?([^"']+)["']?/i);
    if (fieldMatch) {
      if (!currentProps.queryId) {
        return {
          props: currentProps,
          message: "Please select a query first before setting the field."
        };
      }

      const fieldName = fieldMatch[1];
      const query = state?.w3s?.queries?.list?.find(q => q._id === currentProps.queryId);
      
      if (!query) {
        return {
          props: currentProps,
          message: "Could not find the selected query. Please select a valid query first."
        };
      }

      if (!query.fields.some(f => f.name.toLowerCase() === fieldName.toLowerCase())) {
        return {
          props: currentProps,
          message: `Field "${fieldName}" not found. Available fields are: ${query.fields.map(f => f.name).join(', ')}`
        };
      }

      return {
        props: {
          ...currentProps,
          field: fieldName
        },
        message: `Set field to "${fieldName}"`
      };
    }

    // Handle percentage formatting
    if (/(?:format|show|display)\s+(?:as|with)?\s+(?:percentage|percent|%)/i.test(lowercaseInput)) {
      return {
        props: {
          ...currentProps,
          isPercentage: true
        },
        message: "Value will be displayed as a percentage"
      };
    }

    // Handle comma formatting
    if (/(?:use|show|display|format\s+with)\s+commas?/i.test(lowercaseInput)) {
      return {
        props: {
          ...currentProps,
          useCommas: true
        },
        message: "Value will be displayed with comma separation"
      };
    }

    // Handle decimal places
    const decimalMatch = input.match(/(?:set|use|show)\s+(\d+)\s+decimal\s+places?/i);
    if (decimalMatch) {
      const places = parseInt(decimalMatch[1]);
      return {
        props: {
          ...currentProps,
          decimalPlaces: places
        },
        message: `Set decimal places to ${places}`
      };
    }

    // Handle prefix/suffix
    const affixMatch = input.match(/(?:add|set|use)\s+(prefix|suffix)\s+(?:to|as)?\s*["']?([^"']+)["']?/i);
    if (affixMatch) {
      const [_, type, value] = affixMatch;
      return {
        props: {
          ...currentProps,
          [type.toLowerCase()]: value
        },
        message: `Set ${type.toLowerCase()} to "${value}"`
      };
    }

    // Handle suffix position
    const positionMatch = input.match(/(?:move|position|place)\s+suffix\s+(?:to|at|on)?\s+(top|middle|bottom)/i);
    if (positionMatch) {
      return {
        props: {
          ...currentProps,
          suffixPosition: positionMatch[1].toLowerCase()
        },
        message: `Set suffix position to ${positionMatch[1].toLowerCase()}`
      };
    }

    return null;
  }

  static getSuggestions() {
    return [
      {
        text: "Query Selection",
        type: "category",
        options: [
          { text: "list available queries", type: "command" },
          { text: "select query [query name]", type: "command" },
          { text: "show field options", type: "command" }
        ]
      },
      {
        text: "Formatting",
        type: "category",
        options: [
          { text: "format as percentage", type: "command" },
          { text: "show with commas", type: "command" },
          { text: "set decimal places to [number]", type: "command" }
        ]
      },
      {
        text: "Prefix/Suffix",
        type: "category",
        options: [
          { text: "add prefix [symbol]", type: "command" },
          { text: "add suffix [text]", type: "command" },
          { text: "move suffix to [top/middle/bottom]", type: "command" }
        ]
      }
    ];
  }
} 