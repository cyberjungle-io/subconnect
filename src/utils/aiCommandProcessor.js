import { processAICommand } from '../services/ai/processors';
import { getStore } from './storeAccess';
import { showToast } from '../features/toastSlice';

export const handleAICommand = async (message) => {
  const store = getStore();
  
  try {
    // Process the command
    const result = await processAICommand(message);
    
    // Show success toast
    store.dispatch(showToast({
      message: result.message,
      type: 'success'
    }));

    return result;
  } catch (error) {
    // Show error toast
    store.dispatch(showToast({
      message: error.message,
      type: 'error'
    }));
    
    throw error;
  }
};
