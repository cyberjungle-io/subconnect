export class TodoProcessor {
  static todoPatterns = [
    // Title patterns
    /(?:change|set|make)\s+(?:the\s+)?title\s+(?:color|font|size|style|weight|decoration|alignment)/i,
    /(?:update|modify)\s+(?:the\s+)?title\s+(?:to|with)\s+/i,
    
    // Task patterns
    /(?:change|set|make)\s+(?:the\s+)?tasks?\s+(?:background|color|font|size|style)/i,
    /(?:update|modify)\s+(?:the\s+)?tasks?\s+(?:appearance|style)/i,
    
    // Button patterns
    /(?:change|set|make)\s+(?:the\s+)?(?:add\s+)?button\s+(?:color|background)/i,
    /(?:update|modify)\s+(?:the\s+)?(?:add\s+)?button/i,
    
    // Accent color pattern
    /(?:change|set|make)\s+(?:the\s+)?(?:accent|underline)\s+color/i
  ];

  static isTodoCommand(input) {
    return this.todoPatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static getStylePatterns() {
    return {
      title: [
        /(?:change|set|make)\s+(?:the\s+)?title\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:change|set|make)\s+(?:the\s+)?title\s+size\s+(?:to\s+)?(\d+)(?:px)?/i,
        /(?:change|set|make)\s+(?:the\s+)?title\s+font\s+(?:to\s+)?([a-zA-Z\s,]+)/i,
        /(?:change|set|make)\s+(?:the\s+)?title\s+(?:to\s+)?(bold|normal|light)/i,
        /(?:change|set|make)\s+(?:the\s+)?title\s+(?:to\s+)?(italic|normal)/i,
        /(?:change|set|make)\s+(?:the\s+)?title\s+(?:to\s+)?(underline|none)/i,
        /(?:change|set|make)\s+(?:the\s+)?title\s+align(?:ment)?\s+(?:to\s+)?(left|center|right)/i
      ],
      task: [
        /(?:change|set|make)\s+(?:the\s+)?tasks?\s+background\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:change|set|make)\s+(?:the\s+)?tasks?\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:change|set|make)\s+(?:the\s+)?tasks?\s+size\s+(?:to\s+)?(\d+)(?:px)?/i,
        /(?:change|set|make)\s+(?:the\s+)?tasks?\s+font\s+(?:to\s+)?([a-zA-Z\s,]+)/i,
        /(?:change|set|make)\s+(?:the\s+)?tasks?\s+(?:to\s+)?(bold|normal|light)/i,
        /(?:change|set|make)\s+(?:the\s+)?tasks?\s+(?:to\s+)?(italic|normal)/i
      ],
      button: [
        /(?:change|set|make)\s+(?:the\s+)?(?:add\s+)?button\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
        /(?:change|set|make)\s+(?:the\s+)?(?:add\s+)?button\s+background\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i
      ],
      accent: [
        /(?:change|set|make)\s+(?:the\s+)?(?:accent|underline)\s+color\s+(?:to\s+)?(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      titleColor: "title color",
      titleFontSize: "title font size",
      titleFontFamily: "title font family",
      titleFontWeight: "title font weight",
      titleFontStyle: "title font style",
      titleTextDecoration: "title text decoration",
      titleTextAlign: "title alignment",
      taskBackgroundColor: "task background color",
      taskTextColor: "task text color",
      taskFontSize: "task font size",
      taskFontFamily: "task font family",
      taskFontWeight: "task font weight",
      taskFontStyle: "task font style",
      addButtonColor: "add button color",
      addButtonBgColor: "add button background color",
      accentColor: "accent color"
    };
  }

  static processCommand(input, currentProps = {}) {
    const lowercaseInput = input.toLowerCase();
    const patterns = this.getStylePatterns();

    // Process title styles
    for (const pattern of patterns.title) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const value = match[1];
        if (pattern.toString().includes('color')) {
          return { props: { ...currentProps, titleColor: value } };
        } else if (pattern.toString().includes('size')) {
          return { props: { ...currentProps, titleFontSize: parseInt(value) } };
        } else if (pattern.toString().includes('font')) {
          return { props: { ...currentProps, titleFontFamily: value } };
        } else if (pattern.toString().includes('bold|normal|light')) {
          return { props: { ...currentProps, titleFontWeight: value } };
        } else if (pattern.toString().includes('italic')) {
          return { props: { ...currentProps, titleFontStyle: value } };
        } else if (pattern.toString().includes('underline')) {
          return { props: { ...currentProps, titleTextDecoration: value } };
        } else if (pattern.toString().includes('align')) {
          return { props: { ...currentProps, titleTextAlign: value } };
        }
      }
    }

    // Process task styles
    for (const pattern of patterns.task) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const value = match[1];
        if (pattern.toString().includes('background')) {
          return { props: { ...currentProps, taskBackgroundColor: value } };
        } else if (pattern.toString().includes('color')) {
          return { props: { ...currentProps, taskTextColor: value } };
        } else if (pattern.toString().includes('size')) {
          return { props: { ...currentProps, taskFontSize: parseInt(value) } };
        } else if (pattern.toString().includes('font')) {
          return { props: { ...currentProps, taskFontFamily: value } };
        } else if (pattern.toString().includes('bold|normal|light')) {
          return { props: { ...currentProps, taskFontWeight: value } };
        } else if (pattern.toString().includes('italic')) {
          return { props: { ...currentProps, taskFontStyle: value } };
        }
      }
    }

    // Process button styles
    for (const pattern of patterns.button) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const value = match[1];
        if (pattern.toString().includes('background')) {
          return { props: { ...currentProps, addButtonBgColor: value } };
        } else if (pattern.toString().includes('color')) {
          return { props: { ...currentProps, addButtonColor: value } };
        }
      }
    }

    // Process accent color
    for (const pattern of patterns.accent) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        return { props: { ...currentProps, accentColor: match[1] } };
      }
    }

    return null;
  }

  static getSuggestions() {
    return [
      {
        text: "Title Styling",
        type: "category",
        options: [
          { text: "change title color to blue", type: "command" },
          { text: "set title size to 24", type: "command" },
          { text: "make title bold", type: "command" },
          { text: "align title center", type: "command" }
        ]
      },
      {
        text: "Task Styling",
        type: "category",
        options: [
          { text: "change tasks background to #f5f5f5", type: "command" },
          { text: "set task text color to #333333", type: "command" },
          { text: "make tasks bold", type: "command" }
        ]
      },
      {
        text: "Button Styling",
        type: "category",
        options: [
          { text: "change add button color to white", type: "command" },
          { text: "set button background to blue", type: "command" }
        ]
      },
      {
        text: "Accent Color",
        type: "category",
        options: [
          { text: "change accent color to #4a90e2", type: "command" }
        ]
      }
    ];
  }
} 