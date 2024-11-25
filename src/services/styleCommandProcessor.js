import { BorderProcessor } from './Processors/BorderProcessor';
import { BackgroundProcessor } from './Processors/BackgroundProcessor';
import { SizeProcessor } from './Processors/SizeProcessor';

export class StyleCommandProcessor {
  static getStylePatterns() {
    return {
      // Remove width and height from here since they're now in SizeProcessor
    };
  }

  static getPropertyNames() {
    return {
      ...SizeProcessor.getPropertyNames(),
      ...BorderProcessor.getPropertyNames(),
      ...BackgroundProcessor.getPropertyNames()
    };
  }

  static processStyleCommand(input, component) {
    console.log('StyleCommandProcessor received input:', input);

    // Try size processor
    const sizeResult = SizeProcessor.processCommand(input);
    console.log('Size processor result:', sizeResult);
    if (sizeResult) {
      return sizeResult;
    }

    // Try background processor first (since it's more specific)
    const backgroundResult = BackgroundProcessor.processCommand(input);
    console.log('Background processor result:', backgroundResult);
    if (backgroundResult) {
      return backgroundResult;
    }

    // Try border processor
    const borderResult = BorderProcessor.processCommand(input);
    console.log('Border processor result:', borderResult);
    if (borderResult) {
      return borderResult;
    }

    // If no specific processor matched, try the generic style patterns
    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      console.log(`Testing property: ${property}`);
      
      for (const pattern of patterns) {
        console.log(`  Testing pattern: ${pattern}`);
        const match = input.match(pattern);
        console.log(`  Match result:`, match);
        
        if (match && !matchFound) {
          matchFound = true;
          const value = match[1].toLowerCase();
          console.log(`  Found match for ${property}: ${value}`);
          
          result = {
            style: {
              [property]: value
            }
          };
        }
      }
    }

    console.log('Final result:', result);
    return result;
  }
} 