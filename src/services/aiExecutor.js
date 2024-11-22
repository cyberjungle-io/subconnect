import { componentConfig } from '../components/Components/componentConfig';
import { aiAddComponent } from '../features/editorSlice';

export class AICommandExecutor {
  // Helper function to generate variations of component names
  static getNameVariations(componentName) {
    const baseName = componentName.toLowerCase();
    const withoutSpaces = baseName.replace(/\s+/g, '');
    return [
      baseName,
      withoutSpaces,
      // Common variations
      baseName.replace('container', 'box'),
      baseName.replace('component', ''),
      // Handle specific cases
      baseName === 'todo list' ? 'todos' : null,
      baseName === 'kanban board' ? 'kanban' : null,
      baseName === 'flex container' ? 'flexbox' : null,
      baseName === 'query value' ? 'query' : null,
    ].filter(Boolean); // Remove null values
  }

  static async processCommand(input, dispatch) {
    const lowercaseInput = input.toLowerCase();

    // Common action words that might indicate component creation
    const actionWords = [
      'add', 'create', 'insert', 'place', 'put', 'make', 'generate', 
      'give me', 'i want', 'i need', 'can you add', 'could you add',
      'please add', 'would you add', 'i\'d like'
    ];

    // Check each component type for a match
    for (const [type, config] of Object.entries(componentConfig)) {
      const nameVariations = this.getNameVariations(config.name);
      
      // Generate natural language patterns
      const patterns = [];
      
      // Combine action words with name variations
      for (const action of actionWords) {
        for (const name of nameVariations) {
          patterns.push(
            `${action} a ${name}`,
            `${action} an ${name}`,
            `${action} ${name}`,
            `${action} some ${name}`,
            `${name} ${action}`,
            `new ${name}`
          );
        }
      }

      // Additional natural patterns
      patterns.push(
        ...nameVariations.map(name => `i want to add ${name}`),
        ...nameVariations.map(name => `i need ${name}`),
        ...nameVariations.map(name => `${name} please`),
        ...nameVariations.map(name => `can i get ${name}`),
        ...nameVariations.map(name => `${name} would be nice`)
      );

      // Check if any pattern matches the input
      if (patterns.some(pattern => lowercaseInput.includes(pattern))) {
        try {
          await dispatch(aiAddComponent({
            type: type,
            position: { x: 20, y: 20 },
            props: {
              name: `AI Created ${config.name}`,
              ...config.defaultProps
            },
            style: {
              ...config.defaultSize,
              ...config.style
            }
          }));

          // Generate a more natural response
          const responses = [
            `I've added a new ${config.name} to your canvas. Feel free to customize it!`,
            `Here's your new ${config.name}! You can customize it using the toolbar.`,
            `I've created a ${config.name} for you. You'll find it on your canvas.`,
            `Done! I've added a ${config.name} to your workspace.`,
            `Your new ${config.name} is ready to use!`
          ];

          return {
            success: true,
            message: responses[Math.floor(Math.random() * responses.length)]
          };
        } catch (error) {
          return {
            success: false,
            message: `Sorry, I couldn't add the ${config.name}: ${error.message}`
          };
        }
      }
    }

    return null;
  }
} 