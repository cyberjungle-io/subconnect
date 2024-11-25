import { componentConfig } from '../components/Components/componentConfig';
import { aiAddComponent, updateComponent } from '../features/editorSlice';

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
      baseName === 'flex_container' ? 'flexbox' : null,
      baseName === 'flexcontainer' ? 'flexbox' : null,
      baseName === 'query value' ? 'query' : null,
    ].filter(Boolean); // Remove null values
  }

  static async processCommand(input, dispatch, selectedComponent = null) {
    console.log('Processing command:', input);
    console.log('Selected component:', selectedComponent);

    const lowercaseInput = input.toLowerCase();

    // First, check if we're trying to modify a selected component
    if (selectedComponent) {
      const styleUpdates = this.processStyleCommand(lowercaseInput, selectedComponent);
      console.log('Style updates:', styleUpdates);

      if (styleUpdates) {
        try {
          const updatedComponent = {
            ...selectedComponent,
            style: {
              ...selectedComponent.style,
              ...styleUpdates.style
            }
          };
          
          console.log('Final component update:', updatedComponent);

          dispatch({
            type: 'editor/updateComponent',
            payload: {
              id: selectedComponent.id,
              updates: updatedComponent
            }
          });

          // Generate appropriate success message based on what was updated
          const updatedProperty = Object.keys(styleUpdates.style)[0];
          const updatedValue = styleUpdates.style[updatedProperty];
          
          // Create friendly property name
          const propertyNames = {
            backgroundColor: 'background color',
            borderRadius: 'border radius',
            width: 'width',
            height: 'height',
            borderWidth: 'border width',
            borderStyle: 'border style',
            borderColor: 'border color'
          };

          return {
            success: true,
            message: `Updated the ${selectedComponent.type}'s ${propertyNames[updatedProperty] || updatedProperty} to ${updatedValue}`
          };
        } catch (error) {
          console.error('Update failed:', error);
          return {
            success: false,
            message: `Failed to update component: ${error.message}`
          };
        }
      }
    }

    // Common action words that might indicate component creation
    const actionWords = [
      'add', 'create', 'insert', 'place', 'put', 'make', 'generate', 
      'give me', 'i want', 'i need', 'can you add', 'could you add',
      'please add', 'would you add', 'i\'d like'
    ];

    // Check each component type for a match
    for (const [type, config] of Object.entries(componentConfig)) {
      const nameVariations = this.getNameVariations(config.name);
      
      // Add type-based variations
      if (type === 'FLEX_CONTAINER') {
        nameVariations.push('flex', 'flex container', 'flex_container', 'flexcontainer');
      }
      
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

  static processStyleCommand(input, component) {
    console.log('Input received:', input);

    const stylePatterns = {
      backgroundColor: [
        // Simplified patterns that should catch more variations
        /background\s*(?:color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|#[0-9a-fA-F]{3,6})/i,
      ]
    };

    // Debug log the input against each pattern
    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        console.log('Testing pattern:', pattern);
        const match = input.match(pattern);
        console.log('Match result:', match);
        
        if (match) {
          const colorValue = match[1].toLowerCase();
          console.log('Captured color value:', colorValue);
          
          const updates = {
            style: {
              [property]: colorValue
            }
          };
          
          console.log('Generated updates:', updates);
          return updates;
        }
      }
    }

    console.log('No pattern matched');
    return null;
  }
} 