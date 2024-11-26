import { BorderProcessor } from './Processors/BorderProcessor';
import { BackgroundProcessor } from './Processors/BackgroundProcessor';
import { SizeProcessor } from './Processors/SizeProcessor';
import { SpacingProcessor } from './Processors/SpacingProcessor';
import { ShadowProcessor } from './Processors/ShadowProcessor';
import { LayoutProcessor } from './Processors/LayoutProcessor';
import { ButtonProcessor } from './Processors/ButtonProcessor';

export class StyleCommandProcessor {
  static lastModifiedProperty = null;  // Track the last modified property
  static lastModifiedValue = null;     // Track the last value
  static lastUsedProcessor = null;     // Track the last processor used

  static processStyleCommand(input, component) {
    console.log('StyleCommandProcessor received input:', input);
    console.log('Component style:', component.style);
    console.log('Last context:', {
      property: this.lastModifiedProperty,
      value: this.lastModifiedValue,
      processor: this.lastUsedProcessor?.name
    });

    const processors = [
      BorderProcessor,
      LayoutProcessor,
      SpacingProcessor,
      SizeProcessor,
      BackgroundProcessor,
      ShadowProcessor,
      ButtonProcessor
    ];

    // Check if this is a contextual command (like "make it darker")
    const contextualPattern = /(?:can you |please |could you )?(?:make|set)\s*(?:it|this)\s*(stronger|weaker|lighter|darker|more intense|less intense|more|less)/i;
    const isContextual = input.match(contextualPattern);

    if (isContextual && this.lastModifiedProperty && this.lastUsedProcessor) {
      console.log('Processing contextual command with:', this.lastUsedProcessor.name);
      
      const result = this.lastUsedProcessor.processCommand(input, component.style);
      if (result) {
        // Update context
        this.lastModifiedProperty = Object.keys(result.style)[0];
        this.lastModifiedValue = result.style[this.lastModifiedProperty];
        return result;
      }
    }

    // Try each processor
    for (const processor of processors) {
      console.log(`Trying ${processor.name}`);
      const result = processor.processCommand(input, component.style);
      
      if (result) {
        // Store context
        this.lastModifiedProperty = Object.keys(result.style)[0];
        this.lastModifiedValue = result.style[this.lastModifiedProperty];
        this.lastUsedProcessor = processor;
        
        console.log('Updated context:', {
          property: this.lastModifiedProperty,
          value: this.lastModifiedValue,
          processor: this.lastUsedProcessor.name
        });
        
        return result;
      }
    }

    return null;
  }

  // Add method to clear context
  static clearContext() {
    this.lastModifiedProperty = null;
    this.lastModifiedValue = null;
    this.lastUsedProcessor = null;
  }

  static getPropertyNames() {
    return {
      ...BorderProcessor.getPropertyNames(),
      ...LayoutProcessor.getPropertyNames(),
      ...SpacingProcessor.getPropertyNames(),
      ...SizeProcessor.getPropertyNames(),
      ...BackgroundProcessor.getPropertyNames(),
      ...ShadowProcessor.getPropertyNames(),
      ...ButtonProcessor.getPropertyNames()
    };
  }

  static getStylePatterns() {
    return {
      ...BorderProcessor.getStylePatterns(),
      ...LayoutProcessor.getStylePatterns(),
      ...SpacingProcessor.getStylePatterns(),
      ...SizeProcessor.getStylePatterns(),
      ...BackgroundProcessor.getStylePatterns(),
      ...ShadowProcessor.getStylePatterns(),
      ...ButtonProcessor.getStylePatterns()
    };
  }
} 