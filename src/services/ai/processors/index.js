import { processBackgroundCommand } from './backgroundProcessor';
import { processBorderCommand } from './borderProcessor';
import { processSpacingCommand } from './spacingProcessor';
import { processSizeCommand } from './sizeProcessor';
import { processLayoutCommand } from './layoutProcessor';
import { processButtonCommand } from './buttonProcessor';

export const processAICommands = (commands) => {
  return commands.map(command => {
    if (command.style) {
      // Check for button properties
      if (command.style.cursor !== undefined ||
          command.style.hoverBackgroundColor !== undefined ||
          command.style.hoverColor !== undefined ||
          command.style.hoverScale !== undefined ||
          command.style.transitionDuration !== undefined ||
          command.style.transition !== undefined ||
          command.style.enablePageNavigation !== undefined ||
          command.style.targetPageId !== undefined ||
          command.style.hoverPreset !== undefined) {
        command = processButtonCommand(command);
      }

      // Check for layout properties
      if (command.style.display !== undefined ||
          command.style.flexDirection !== undefined ||
          command.style.flexWrap !== undefined ||
          command.style.justifyContent !== undefined ||
          command.style.alignItems !== undefined ||
          command.style.alignContent !== undefined ||
          command.style.flex !== undefined ||
          command.style.layoutPreset !== undefined) {
        command = processLayoutCommand(command);
      }

      // Check for size properties
      if (command.style.width !== undefined ||
          command.style.height !== undefined ||
          command.style.minWidth !== undefined ||
          command.style.maxWidth !== undefined ||
          command.style.minHeight !== undefined ||
          command.style.maxHeight !== undefined ||
          command.style.aspectRatio !== undefined ||
          command.style.preset !== undefined) {
        command = processSizeCommand(command);
      }

      // Check for background properties
      if (command.style.backgroundColor !== undefined || command.style.backgroundImage !== undefined) {
        command = processBackgroundCommand(command);
      }
      
      // Check for border properties
      if (command.style.borderWidth !== undefined || 
          command.style.borderStyle !== undefined ||
          command.style.borderColor !== undefined ||
          command.style.borderRadius !== undefined ||
          command.style.boxShadow !== undefined ||
          command.style.border !== undefined) {
        command = processBorderCommand(command);
      }

      // Check for spacing properties
      if (command.style.padding !== undefined ||
          command.style.margin !== undefined ||
          command.style.gap !== undefined ||
          Object.keys(command.style).some(key => 
            key.startsWith('padding') || key.startsWith('margin'))) {
        command = processSpacingCommand(command);
      }
    }
    return command;
  });
}; 