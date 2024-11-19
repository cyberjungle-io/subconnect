import { v4 as uuidv4 } from 'uuid';
import { createComponent } from '../components/Components/componentFactory';
import { 
  addComponent, 
  updateComponent, 
  deleteComponents 
} from '../features/editorSlice';
import { addToHistory } from '../features/historySlice';

export const executeAICommands = (commands, dispatch) => {
  try {
    const executedCommands = [];

    commands.forEach(command => {
      const result = executeCommand(command, dispatch);
      if (result) {
        executedCommands.push({
          command,
          result,
          timestamp: Date.now()
        });
      }
    });

    // Add to history for undo/redo
    if (executedCommands.length > 0) {
      dispatch(addToHistory(executedCommands));
    }

  } catch (error) {
    console.error('Error executing AI commands:', error);
    throw error;
  }
};

const executeCommand = (command, dispatch) => {
  switch (command.type) {
    case 'add':
      const newComponent = createComponent(command.componentType, {
        ...command.props,
        style: command.style,
        id: uuidv4()
      });
      dispatch(addComponent(newComponent));
      return { type: 'add', componentId: newComponent.id };

    case 'modify':
      dispatch(updateComponent({
        id: command.componentId,
        updates: {
          style: command.style,
          props: command.props
        }
      }));
      return { type: 'modify', componentId: command.componentId };

    case 'delete':
      dispatch(deleteComponents([command.componentId]));
      return { type: 'delete', componentId: command.componentId };

    case 'arrange':
      // Handle component arrangement
      return null;

    default:
      console.warn('Unknown command type:', command.type);
      return null;
  }
}; 