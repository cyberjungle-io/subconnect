import { componentConfig } from '../components/Components/componentConfig';
import { aiAddComponent, updateComponent } from '../features/editorSlice';
import { StyleCommandProcessor } from './styleCommandProcessor';
import LLMService from './llm/llmService';

export class AICommandExecutor {
  // Define actionWords as a static class property
  static actionWords = [
    'add', 'create', 'insert', 'place', 'put', 'make', 'generate', 
    'give me', 'i want', 'i need', 'can you add', 'could you add',
    'please add', 'would you add', 'i\'d like'
  ];

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

    const llmService = new LLMService();

    // First, try to understand the user's intent using the LLM
    const intentPrompt = `
      Analyze the following user input and match it to one of these command types:
      1. Add Component: User wants to add/create a new component
      2. Style Update: User wants to modify the style of an existing component
      3. Unknown: Command doesn't match known patterns

      Consider these style patterns:
      ${JSON.stringify(StyleCommandProcessor.getPropertyNames(), null, 2)}

      User input: "${input}"
      
      Respond in JSON format:
      {
        "type": "ADD_COMPONENT | STYLE_UPDATE | UNKNOWN",
        "targetProperty": "style property name if applicable",
        "value": "suggested value if applicable",
        "confidence": "number between 0 and 1"
      }
    `;

    try {
      const intentResponse = await llmService.sendMessage(intentPrompt);
      const intent = JSON.parse(intentResponse.content);
      console.log('Detected intent:', intent);

      if (intent.type === 'STYLE_UPDATE' && selectedComponent) {
        // If it's a style update, construct a more precise command
        const stylePrompt = `
          Convert this natural language request into a specific style command.
          Original request: "${input}"
          Target property: "${intent.targetProperty}"
          
          Available patterns:
          ${JSON.stringify(StyleCommandProcessor.getStylePatterns(), null, 2)}
          
          Respond with the most appropriate command that matches the patterns.
        `;

        const styleResponse = await llmService.sendMessage(stylePrompt);
        const processedCommand = styleResponse.content.trim();
        
        // Try processing the constructed command
        const styleResult = StyleCommandProcessor.processStyleCommand(processedCommand, selectedComponent);
        if (styleResult) {
          try {
            const updatedComponent = {
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                ...styleResult.style
              }
            };
            
            console.log('Final component update:', updatedComponent);

            // Update the component, whether it's nested or not
            dispatch(updateComponent({
              id: selectedComponent.id,
              updates: updatedComponent
            }));

            // Generate appropriate success message
            const updatedProperty = Object.keys(styleResult.style)[0];
            const updatedValue = styleResult.style[updatedProperty];
            const propertyNames = StyleCommandProcessor.getPropertyNames();

            return {
              success: true,
              message: `Updated ${intent.targetProperty} to ${intent.value}`
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

      // If it's an add component request or the style update failed, continue with existing logic
      return await this.processTraditionalCommand(input, dispatch, selectedComponent);
    } catch (error) {
      console.error('Error processing command with LLM:', error);
      // Fallback to traditional processing
      return await this.processTraditionalCommand(input, dispatch, selectedComponent);
    }
  }

  static async processTraditionalCommand(input, dispatch, selectedComponent) {
    const lowercaseInput = input.toLowerCase();
    
    // First, check if we're trying to modify a selected FLEX_CONTAINER
    if (selectedComponent?.type === 'FLEX_CONTAINER') {
      console.log('Processing command for FLEX_CONTAINER');

      // Check each component type for a match
      for (const [type, config] of Object.entries(componentConfig)) {
        const nameVariations = this.getNameVariations(config.name);
        const patterns = [];
        
        // Use the static actionWords property
        for (const action of AICommandExecutor.actionWords) {
          for (const name of nameVariations) {
            patterns.push(
              `${action} a ${name}`,
              `${action} an ${name}`,
              `${action} ${name}`,
              `${action} some ${name}`
            );
          }
        }

        // Check if any pattern matches the input
        if (patterns.some(pattern => lowercaseInput.includes(pattern))) {
          try {
            console.log(`Adding ${type} as child to FLEX_CONTAINER`);
            
            // Generate a unique ID for the child
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const uniqueId = `${timestamp}_${randomString}`;

            // Create the child component
            const childComponent = {
              id: uniqueId,
              type: type,
              name: `${config.name}_${uniqueId.substr(0, 8)}`,
              props: {
                name: `AI Created ${config.name}`,
                ...config.defaultProps
              },
              style: {
                ...config.defaultSize,
                ...config.style
              },
              children: [],
              acceptsChildren: config.acceptsChildren || false
            };

            // Update the parent FLEX_CONTAINER with the new child
            const updatedComponent = {
              ...selectedComponent,
              children: [
                ...(selectedComponent.children || []),
                childComponent
              ]
            };

            console.log('Updating FLEX_CONTAINER with new child:', updatedComponent);

            dispatch(updateComponent({
              id: selectedComponent.id,
              updates: updatedComponent
            }));

            return {
              success: true,
              message: `Added a new ${config.name} to the selected container!`
            };
          } catch (error) {
            console.error('Error adding child component:', error);
            return {
              success: false,
              message: `Failed to add child component: ${error.message}`
            };
          }
        }
      }
    }

    // If we get here, either:
    // 1. No FLEX_CONTAINER is selected
    // 2. The command wasn't for adding a component
    // 3. The selected component isn't a FLEX_CONTAINER
    
    // Try processing style commands
    if (selectedComponent) {
      const styleUpdates = StyleCommandProcessor.processStyleCommand(lowercaseInput, selectedComponent);
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

          // Update the component, whether it's nested or not
          dispatch(updateComponent({
            id: selectedComponent.id,
            updates: updatedComponent
          }));

          // Generate appropriate success message
          const updatedProperty = Object.keys(styleUpdates.style)[0];
          const updatedValue = styleUpdates.style[updatedProperty];
          const propertyNames = StyleCommandProcessor.getPropertyNames();

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

    // If nothing else matched, try adding a component to the canvas
    // Check each component type for a match
    for (const [type, config] of Object.entries(componentConfig)) {
      const nameVariations = this.getNameVariations(config.name);
      
      // Add type-based variations
      if (type === 'FLEX_CONTAINER') {
        nameVariations.push('flex', 'flex container', 'flex_container', 'flexcontainer');
      }
      
      // Generate natural language patterns
      const patterns = [];
      
      // Use the static actionWords property
      for (const action of AICommandExecutor.actionWords) {
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