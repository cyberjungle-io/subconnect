export class ColorThemeProcessor {
  static colorThemePatterns = [
    /(?:show|list|display)\s+(?:the\s+)?(?:current\s+)?color\s+theme/i,
    /(?:change|update|set)\s+(?:the\s+)?color\s+(?:named|called)?\s*["']?([^"']+)["']?\s*(?:to|=|:)\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
    /(?:rename|change\s+name\s+of)\s+(?:the\s+)?color\s+(?:named|called)?\s*["']?([^"']+)["']?\s*(?:to|=|:)\s*["']?([^"']+)["']?/i,
    /(?:add|create)\s+(?:a\s+)?new\s+color\s+(?:named|called)?\s*["']?([^"']+)["']?\s*(?:with\s+value)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i,
    /(?:work\s+on|edit|modify|manage)\s+(?:the\s+)?color\s+theme/i,
    /^__colorOption__:(.+)::(.+)$/i
  ];

  static isColorThemeCommand(input) {
    return this.colorThemePatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static formatColorDetails(color, index) {
    return {
      text: `${color.name}: ${color.value}`,
      clickable: true,
      type: 'color',
      value: color.name,
      color: color.value,
      options: [
        {
          text: 'Change Color Value',
          type: 'command',
          clickable: true,
          value: `__colorOption__:${color.name}::Change Color Value`
        },
        {
          text: 'Rename Color',
          type: 'command',
          clickable: true,
          value: `__colorOption__:${color.name}::Rename Color`
        },
        {
          text: 'Delete Color',
          type: 'command',
          clickable: true,
          value: `__colorOption__:${color.name}::Delete Color`
        }
      ]
    };
  }

  static processColorOption(colorName, option, currentTheme = []) {
    const colorIndex = currentTheme.findIndex(c => c.name.toLowerCase() === colorName.toLowerCase());
    if (colorIndex === -1) {
      return {
        type: 'ERROR',
        message: `Color "${colorName}" not found in the theme`
      };
    }

    switch (option) {
      case 'Change Color Value':
        return {
          type: 'PROMPT',
          message: `Enter the new color value for "${colorName}" (e.g., #FF0000 or red):`,
          followUp: {
            type: 'COLOR_VALUE_CHANGE',
            colorName
          }
        };

      case 'Rename Color':
        return {
          type: 'PROMPT',
          message: `Enter the new name for "${colorName}":`,
          followUp: {
            type: 'COLOR_RENAME',
            colorName
          }
        };

      case 'Delete Color':
        const updatedTheme = currentTheme.filter((_, i) => i !== colorIndex);
        return {
          type: 'UPDATE_THEME',
          theme: updatedTheme,
          message: `Deleted color "${colorName}"`
        };

      default:
        return null;
    }
  }

  static processCommand(input, currentTheme = []) {
    const lowercaseInput = input.toLowerCase();

    // Handle color option selection
    const optionMatch = input.match(/^__colorOption__:(.+)::(.+)$/i);
    if (optionMatch) {
      const [_, colorName, option] = optionMatch;
      return this.processColorOption(colorName, option, currentTheme);
    }

    // Show current theme
    if (/(?:show|list|display)\s+(?:the\s+)?(?:current\s+)?color\s+theme/i.test(input)) {
      return {
        type: 'SHOW_THEME',
        message: 'Current Color Theme:',
        options: Array.isArray(currentTheme) ? currentTheme.map((color, index) => this.formatColorDetails(color, index)) : [],
        actions: [{
          text: 'Add New Color',
          value: 'ADD_NEW_COLOR'
        }]
      };
    }

    // Change existing color value
    const changeColorMatch = input.match(/(?:change|update|set)\s+(?:the\s+)?color\s+(?:named|called)?\s*["']?([^"']+)["']?\s*(?:to|=|:)\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i);
    if (changeColorMatch) {
      const [_, colorName, newValue] = changeColorMatch;
      const colorIndex = currentTheme.findIndex(c => c.name.toLowerCase() === colorName.toLowerCase());
      
      if (colorIndex === -1) {
        return {
          type: 'ERROR',
          message: `Color "${colorName}" not found in the theme`
        };
      }

      const updatedTheme = [...currentTheme];
      updatedTheme[colorIndex] = {
        ...updatedTheme[colorIndex],
        value: newValue
      };

      return {
        type: 'UPDATE_THEME',
        theme: updatedTheme,
        message: `Updated color "${colorName}" to ${newValue}`
      };
    }

    // Rename existing color
    const renameMatch = input.match(/(?:rename|change\s+name\s+of)\s+(?:the\s+)?color\s+(?:named|called)?\s*["']?([^"']+)["']?\s*(?:to|=|:)\s*["']?([^"']+)["']?/i);
    if (renameMatch) {
      const [_, oldName, newName] = renameMatch;
      const colorIndex = currentTheme.findIndex(c => c.name.toLowerCase() === oldName.toLowerCase());
      
      if (colorIndex === -1) {
        return {
          type: 'ERROR',
          message: `Color "${oldName}" not found in the theme`
        };
      }

      const updatedTheme = [...currentTheme];
      updatedTheme[colorIndex] = {
        ...updatedTheme[colorIndex],
        name: newName
      };

      return {
        type: 'UPDATE_THEME',
        theme: updatedTheme,
        message: `Renamed color "${oldName}" to "${newName}"`
      };
    }

    // Add new color
    const addColorMatch = input.match(/(?:add|create)\s+(?:a\s+)?new\s+color\s+(?:named|called)?\s*["']?([^"']+)["']?\s*(?:with\s+value)?\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/i);
    if (addColorMatch) {
      const [_, name, value] = addColorMatch;
      const updatedTheme = [
        ...currentTheme,
        { name, value }
      ];

      return {
        type: 'UPDATE_THEME',
        theme: updatedTheme,
        message: `Added new color "${name}" with value ${value}`
      };
    }

    // General color theme management command
    if (/(?:work\s+on|edit|modify|manage)\s+(?:the\s+)?color\s+theme/i.test(input)) {
      // Ensure currentTheme is an array and has items
      const formattedColors = Array.isArray(currentTheme) 
        ? currentTheme.map((color, index) => this.formatColorDetails(color, index))
        : [];

      return {
        type: 'SHOW_THEME',
        message: 'Here are the current colors in your theme:',
        options: formattedColors,
        actions: [{
          text: 'Add New Color',
          value: 'ADD_NEW_COLOR'
        }]
      };
    }

    return null;
  }
} 