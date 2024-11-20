import { v4 as uuidv4 } from 'uuid';
import { createComponent } from '../components/Components/componentFactory';
import { 
  addComponent, 
  updateComponent, 
  deleteComponents 
} from '../features/editorSlice';
import { addToHistory } from '../features/historySlice';
import { componentConfig } from '../components/Components/componentConfig';

const executeCommand = (command, dispatch) => {
  switch (command.type) {
    case 'add':
      const newComponent = createComponent(command.componentType, {
        ...componentConfig[command.componentType].defaultProps,
        ...command.props,
        style: {
          ...componentConfig[command.componentType].defaultSize,
          ...command.style
        },
        id: uuidv4()
      });
      dispatch(addComponent(newComponent));
      return { type: 'add', componentId: newComponent.id };

    case 'modify':
      dispatch(updateComponent({
        id: command.componentId,
        updates: {
          style: command.style || {},
          props: command.props || {}
        }
      }));
      return { type: 'modify', componentId: command.componentId };

    case 'delete':
      dispatch(deleteComponents([command.componentId]));
      return { type: 'delete', componentId: command.componentId };

    default:
      console.warn('Unknown command type:', command.type);
      return null;
  }
};

export const executeAICommands = (commands, dispatch) => {
  try {
    const executedCommands = commands
      .map(command => executeCommand(command, dispatch))
      .filter(Boolean);

    if (executedCommands.length > 0) {
      dispatch(addToHistory(executedCommands));
    }

  } catch (error) {
    console.error('Error executing AI commands:', error);
    throw error;
  }
}; 