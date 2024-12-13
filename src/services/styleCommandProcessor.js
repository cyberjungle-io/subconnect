import { BorderProcessor } from "./Processors/BorderProcessor";
import { BackgroundProcessor } from "./Processors/BackgroundProcessor";
import { SizeProcessor } from "./Processors/SizeProcessor";
import { SpacingProcessor } from "./Processors/SpacingProcessor";
import { ShadowProcessor } from "./Processors/ShadowProcessor";
import { LayoutProcessor } from "./Processors/LayoutProcessor";
import { ButtonProcessor } from "./Processors/ButtonProcessor";
import { TextProcessor } from "./Processors/TextProcessor";
import { VideoProcessor } from "./Processors/VideoProcessor";
import { BasicTextProcessor } from './Processors/BasicTextProcessor';

export class StyleCommandProcessor {
  static lastModifiedProperty = null;
  static lastModifiedValue = null;
  static lastUsedProcessor = null;

  static processStyleCommand(input, component) {
    console.log("StyleCommandProcessor received input:", input);
    console.log("Component style:", component?.style);
    console.log("Last context:", this.lastContext);

    // If we get a PROMPT type response from any processor, return it directly
    const borderResult = BorderProcessor.processCommand(input, component?.style);
    if (borderResult?.type === 'PROMPT') {
      return borderResult;
    }

    // Check if this is a text-specific command
    const isTextCommand =
      /(?:(?:change|set|make)?\s*(?:the)?\s*text\s+(?:to\s+)?(?:color|blue|red|green|yellow|purple|black|white|gray|#[0-9a-fA-F]{3,6})|(?:text|font)\s+(?:color|shadow|size|spacing|height|family|transform|align|style)|(?:make|set|change)\s+(?:the)?\s*text\s+(?:color|style|size|spacing|height|family|transform|align))/i.test(
        input
      );

    console.log(
      "Command type:",
      isTextCommand ? "Text Command" : "Other Command"
    );

    // Define processor order based on command type
    const processors = isTextCommand
      ? [
          TextProcessor,
          BorderProcessor,
          LayoutProcessor,
          SpacingProcessor,
          SizeProcessor,
          ShadowProcessor,
          ButtonProcessor,
          BackgroundProcessor,
          VideoProcessor,
          BasicTextProcessor,
        ]
      : [
          BorderProcessor,
          LayoutProcessor,
          SpacingProcessor,
          SizeProcessor,
          BackgroundProcessor,
          ShadowProcessor,
          ButtonProcessor,
          TextProcessor,
          VideoProcessor,
          BasicTextProcessor,
        ];

    // Check if this is a contextual command (like "make it darker")
    const contextualPattern =
      /(?:can you |please |could you )?(?:make|set)\s*(?:it|this)\s*(stronger|weaker|lighter|darker|more intense|less intense|more|less)/i;
    const isContextual = input.match(contextualPattern);

    if (isContextual && this.lastModifiedProperty && this.lastUsedProcessor) {
      console.log(
        "Processing contextual command with:",
        this.lastUsedProcessor.name
      );

      const result = this.lastUsedProcessor.processCommand(
        input,
        component.style
      );
      if (result) {
        // Update context
        this.lastModifiedProperty = Object.keys(result.style)[0];
        this.lastModifiedValue = result.style[this.lastModifiedProperty];
        return result;
      }
    }

    // Try each processor
    for (const processor of processors) {
      console.log(
        `Trying ${processor.name}${isTextCommand ? " (Text Command Mode)" : ""}`
      );
      const result = processor.processCommand(input, component.style);

      if (result) {
        // Store context
        this.lastModifiedProperty = Object.keys(result.style)[0];
        this.lastModifiedValue = result.style[this.lastModifiedProperty];
        this.lastUsedProcessor = processor;

        console.log("Updated context:", {
          property: this.lastModifiedProperty,
          value: this.lastModifiedValue,
          processor: this.lastUsedProcessor.name,
        });

        return result;
      }
    }

    return null;
  }

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
      ...ButtonProcessor.getPropertyNames(),
      ...TextProcessor.getPropertyNames(),
      ...VideoProcessor.getPropertyNames(),
      ...BasicTextProcessor.getPropertyNames(),
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
      ...ButtonProcessor.getStylePatterns(),
      ...TextProcessor.getStylePatterns(),
      ...VideoProcessor.getStylePatterns(),
      ...BasicTextProcessor.getStylePatterns(),
    };
  }
}
