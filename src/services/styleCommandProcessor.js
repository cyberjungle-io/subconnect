import { BorderProcessor } from './Processors/BorderProcessor';
import { BackgroundProcessor } from './Processors/BackgroundProcessor';
import { SizeProcessor } from './Processors/SizeProcessor';
import { SpacingProcessor } from './Processors/SpacingProcessor';
import { ShadowProcessor } from './Processors/ShadowProcessor';
import { LayoutProcessor } from './Processors/LayoutProcessor';
import { ButtonProcessor } from './Processors/ButtonProcessor';

export class StyleCommandProcessor {
  static getStylePatterns() {
    return {
      ...BorderProcessor.getStylePatterns(),
      ...BackgroundProcessor.getStylePatterns(),
      ...SizeProcessor.getStylePatterns(),
      ...SpacingProcessor.getStylePatterns(),
      ...ShadowProcessor.getStylePatterns(),
      ...LayoutProcessor.getStylePatterns(),
      ...ButtonProcessor.getStylePatterns()
    };
  }

  static getPropertyNames() {
    return {
      ...SizeProcessor.getPropertyNames(),
      ...BorderProcessor.getPropertyNames(),
      ...BackgroundProcessor.getPropertyNames(),
      ...SpacingProcessor.getPropertyNames(),
      ...ShadowProcessor.getPropertyNames(),
      ...LayoutProcessor.getPropertyNames(),
      ...ButtonProcessor.getPropertyNames()
    };
  }

  static processStyleCommand(input, component) {
    console.log('StyleCommandProcessor received input:', input);
    console.log('Component style:', component?.style);

    // Pass the current style to each processor
    const currentStyle = component?.style || {};

    // Try border processor first for radius-related commands
    const borderResult = BorderProcessor.processCommand(input, currentStyle);
    console.log('Border processor result:', borderResult);
    if (borderResult) {
      return borderResult;
    }

    // Try layout processor
    const layoutResult = LayoutProcessor.processCommand(input, currentStyle);
    console.log('Layout processor result:', layoutResult);
    if (layoutResult) {
      return layoutResult;
    }

    // Try spacing processor
    const spacingResult = SpacingProcessor.processCommand(input, currentStyle);
    console.log('Spacing processor result:', spacingResult);
    if (spacingResult) {
      return spacingResult;
    }

    // Try size processor
    const sizeResult = SizeProcessor.processCommand(input, currentStyle);
    console.log('Size processor result:', sizeResult);
    if (sizeResult) {
      return sizeResult;
    }

    // Try background processor
    const backgroundResult = BackgroundProcessor.processCommand(input, currentStyle);
    console.log('Background processor result:', backgroundResult);
    if (backgroundResult) {
      return backgroundResult;
    }

    // Add shadow processor check
    const shadowResult = ShadowProcessor.processCommand(input, currentStyle);
    console.log('Shadow processor result:', shadowResult);
    if (shadowResult) {
      return shadowResult;
    }

    // Add button processor check
    const buttonResult = ButtonProcessor.processCommand(input, currentStyle);
    console.log('Button processor result:', buttonResult);
    if (buttonResult) {
      return buttonResult;
    }

    return null;
  }
} 