export class ToolbarProcessor {
  static toolbarPatterns = [
    /(?:show|list|display)\s+(?:the\s+)?(?:current\s+)?toolbar\s+(?:settings|configuration|setup)/i,
    /(?:change|update|set)\s+(?:the\s+)?toolbar\s+(?:background|text|button\s+hover)\s+color\s+(?:to|=|:)\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
    /(?:work\s+on|edit|modify|manage)\s+(?:the\s+)?toolbar/i,
    /^__toolbarOption__:(.+)::(.+)$/i
  ];

  static isToolbarCommand(input) {
    return this.toolbarPatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static formatToolbarDetails(settings) {
    return [
      {
        text: `Background Color: ${settings.backgroundColor || '#e8e8e8'}`,
        type: 'color',
        color: settings.backgroundColor || '#e8e8e8',
        options: [
          {
            text: 'Change Color',
            type: 'command',
            value: '__toolbarOption__:backgroundColor::Change Color'
          }
        ]
      },
      {
        text: `Text Color: ${settings.textColor || '#333333'}`,
        type: 'color',
        color: settings.textColor || '#333333',
        options: [
          {
            text: 'Change Color',
            type: 'command',
            value: '__toolbarOption__:textColor::Change Color'
          }
        ]
      },
      {
        text: `Button Hover Color: ${settings.buttonHoverColor || '#d0d0d0'}`,
        type: 'color',
        color: settings.buttonHoverColor || '#d0d0d0',
        options: [
          {
            text: 'Change Color',
            type: 'command',
            value: '__toolbarOption__:buttonHoverColor::Change Color'
          }
        ]
      }
    ];
  }

  static processCommand(input, currentSettings = {}) {
    // Handle color value changes
    const lastMessage = input.toLowerCase();
    if (lastMessage.match(/^(#[0-9a-fA-F]{6}|[a-zA-Z]+)$/)) {
      const pendingChange = currentSettings.pendingColorChange;
      if (pendingChange) {
        const { pendingColorChange, ...rest } = currentSettings;
        return {
          type: 'UPDATE_TOOLBAR',
          settings: {
            ...rest,
            [pendingChange]: lastMessage
          },
          message: `Updated toolbar ${pendingChange.replace(/([A-Z])/g, ' $1').toLowerCase()} to ${lastMessage}`
        };
      }
    }

    // Handle toolbar option selection
    const optionMatch = input.match(/^__toolbarOption__:(.+)::(.+)$/i);
    if (optionMatch) {
      const [_, property, action] = optionMatch;
      if (action === 'Change Color') {
        return {
          type: 'UPDATE_TOOLBAR',
          settings: {
            ...currentSettings,
            pendingColorChange: property
          },
          message: `Enter new color value for ${property.replace(/([A-Z])/g, ' $1').toLowerCase()}:`,
          options: [
            {
              text: 'Use color names (red) or hex codes (#FF0000)',
              type: 'info'
            }
          ]
        };
      }
    }

    // Show current settings
    if (/(?:show|list|display)\s+(?:the\s+)?(?:current\s+)?toolbar\s+(?:settings|configuration|setup)/i.test(input)) {
      return {
        type: 'SHOW_TOOLBAR',
        message: 'Current Toolbar Settings:',
        options: this.formatToolbarDetails(currentSettings)
      };
    }

    // Change color directly
    const changeColorMatch = input.match(/(?:change|update|set)\s+(?:the\s+)?toolbar\s+(?:background|text|button\s+hover)\s+color\s+(?:to|=|:)\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i);
    if (changeColorMatch) {
      const [_, newValue] = changeColorMatch;
      const propertyMap = {
        'background': 'backgroundColor',
        'text': 'textColor',
        'button hover': 'buttonHoverColor'
      };

      const property = Object.entries(propertyMap).find(([key]) => input.toLowerCase().includes(key))?.[1];
      
      if (property) {
        return {
          type: 'UPDATE_TOOLBAR',
          settings: {
            ...currentSettings,
            [property]: newValue
          },
          message: `Updated toolbar ${property.replace(/([A-Z])/g, ' $1').toLowerCase()} to ${newValue}`
        };
      }
    }

    // General toolbar management command
    if (/(?:work\s+on|edit|modify|manage)\s+(?:the\s+)?toolbar/i.test(input)) {
      return {
        type: 'SHOW_TOOLBAR',
        message: 'Here are the current toolbar settings:',
        options: this.formatToolbarDetails(currentSettings)
      };
    }

    return null;
  }
} 