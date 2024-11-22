import { componentTypes } from '../components/Components/componentConfig';
import { aiAddComponent } from '../features/editorSlice';

export class AICommandExecutor {
  static commands = {
    ADD_FLEX_CONTAINER: {
      patterns: [
        /can you add a flex[_\s]?container/i,
        /add a flex[_\s]?container/i,
        /create a flex[_\s]?container/i,
        /insert a flex[_\s]?container/i,
        /place a flex[_\s]?container/i
      ],
      execute: async (dispatch) => {
        const result = await dispatch(aiAddComponent({
          type: 'FLEX_CONTAINER',
          position: { x: 20, y: 20 },
          props: {
            name: 'AI Created Container',
            direction: 'row',
            wrap: 'nowrap',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: '20px'
          }
        }));
        return result;
      }
    }
  };

  static async processCommand(input, dispatch) {
    for (const [commandName, command] of Object.entries(this.commands)) {
      for (const pattern of command.patterns) {
        if (pattern.test(input)) {
          try {
            const result = await command.execute(dispatch);
            return {
              success: true,
              command: commandName,
              result
            };
          } catch (error) {
            console.error('Command execution error:', error);
            return {
              success: false,
              command: commandName,
              message: error.message
            };
          }
        }
      }
    }
    return null;
  }
} 