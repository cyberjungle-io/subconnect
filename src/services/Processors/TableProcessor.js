export class TableProcessor {
  static tablePatterns = [
    /(?:show|hide|toggle)\s+(?:the\s+)?(?:header|borders?)/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:header|row|text|border)\s+color/i,
    /(?:set|change|update)\s+(?:the\s+)?page\s+size/i,
    /(?:show|hide|toggle)\s+(?:the\s+)?columns?\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:rename|change)\s+(?:the\s+)?column\s+(?:called|named)?\s*["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i,
    /(?:sort|order)\s+(?:by|using)\s+(?:the\s+)?column\s+(?:called|named)?\s*["']?([^"']+)["']?/i,
    /(?:filter|show only)\s+(?:rows?\s+)?where\s+["']?([^"']+)["']?\s+(?:is|equals|contains|matches)\s+["']?([^"']+)["']?/i
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

  static getSuggestions() {
    return [
      {
        text: "Table Visibility",
        type: "category",
        options: [
          {
            text: "show header",
            type: "command"
          },
          {
            text: "hide header",
            type: "command"
          },
          {
            text: "show borders",
            type: "command"
          },
          {
            text: "hide borders",
            type: "command"
          }
        ]
      },
      {
        text: "Colors",
        type: "category",
        options: [
          {
            text: "set header color to #e6f3ff",
            type: "command"
          },
          {
            text: "set row color to white",
            type: "command"
          },
          {
            text: "set alternate row color to #f9fafb",
            type: "command"
          },
          {
            text: "set text color to #374151",
            type: "command"
          },
          {
            text: "set border color to #e5e7eb",
            type: "command"
          }
        ]
      },
      {
        text: "Pagination",
        type: "category",
        options: [
          {
            text: "set page size to 5",
            type: "command"
          },
          {
            text: "set page size to 10",
            type: "command"
          },
          {
            text: "set page size to 25",
            type: "command"
          }
        ]
      }
    ];
  }
} 