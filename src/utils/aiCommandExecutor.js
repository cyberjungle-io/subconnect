import { store } from '../store/store';
import { 
  addComponent,
  updateComponent,
  deleteComponent 
} from '../features/editorSlice';

let isExecutingCommand = false;

export const executeCommand = async (command) => {
  if (isExecutingCommand) {
    console.log('Command already executing, skipping');
    return null;
  }

  try {
    isExecutingCommand = true;
    console.log('Executing command:', command);

    switch (command.type) {
      case 'add':
        const result = store.dispatch(addComponent({
          type: command.componentType,
          props: command.props || {},
          style: command.style || {},
          parentId: command.parentId,
          layout: command.layout || {}
        }));
        console.log('Add component result:', result);
        return result;

      case 'modify':
        return store.dispatch(updateComponent({
          id: command.componentId,
          updates: {
            props: command.props,
            style: command.style,
            layout: command.layout
          }
        }));

      case 'delete':
        return store.dispatch(deleteComponent(command.componentId));

      default:
        throw new Error(`Unknown command type: ${command.type}`);
    }
  } catch (error) {
    console.error('Command execution error:', error);
    throw error;
  } finally {
    isExecutingCommand = false;
  }
};
