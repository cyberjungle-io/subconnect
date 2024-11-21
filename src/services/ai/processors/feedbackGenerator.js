export const generateClarificationResponse = (feedbackResult) => {
  const { originalCommand, clarificationOptions } = feedbackResult;
  
  if (clarificationOptions.length === 0) {
    return "I'm not sure what you'd like me to clarify. Could you please be more specific?";
  }

  const responses = clarificationOptions.map(option => {
    switch (option.type) {
      case 'componentList':
        return `Available components: ${option.components
          .map(c => c.props.name || c.type)
          .join(', ')}`;
      
      case 'propertyList':
        return `Available properties: ${option.properties.join(', ')}`;
      
      default:
        return '';
    }
  });

  return responses.join('\n');
};

export const generateChainedCommandFeedback = (commands, results) => {
  if (!Array.isArray(commands) || commands.length === 0) {
    return 'No commands to execute';
  }

  const feedbackMessages = commands.map((command, index) => {
    const result = results[index];
    
    switch (command.type) {
      case 'add':
        return `Created ${command.componentType.toLowerCase()} component${
          command.style.backgroundColor ? ` with ${command.style.backgroundColor} background` : ''
        }${command.parentId ? ' inside the container' : ''}`;
      
      case 'modify':
        const changes = [];
        if (Object.keys(command.style).length) changes.push('style');
        if (Object.keys(command.props).length) changes.push('properties');
        return `Updated ${changes.join(' and ')} of the component`;
      
      case 'delete':
        return 'Removed the component';
      
      default:
        return 'Command executed successfully';
    }
  });

  return feedbackMessages.join('\n');
}; 