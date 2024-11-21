export const generateCommandFeedback = (command, result) => {
  switch (command.type) {
    case 'add':
      return `Created a new ${command.componentType.toLowerCase().replace('_', ' ')} component`;
    case 'modify':
      return `Updated the ${command.componentType.toLowerCase().replace('_', ' ')} component`;
    case 'delete':
      return `Deleted the ${command.componentType.toLowerCase().replace('_', ' ')} component`;
    default:
      return 'Command executed successfully';
  }
};

export const generateErrorFeedback = (error) => {
  return error.message || 'An unknown error occurred';
}; 