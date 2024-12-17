import { BorderProcessor } from "./Processors/BorderProcessor";
import { BackgroundProcessor } from "./Processors/BackgroundProcessor";
import { SizeProcessor } from "./Processors/SizeProcessor";
import { SpacingProcessor } from "./Processors/SpacingProcessor";
import { ShadowProcessor } from "./Processors/ShadowProcessor";
import { LayoutProcessor } from "./Processors/LayoutProcessor";
import { ButtonProcessor } from "./Processors/ButtonProcessor";
import { TextProcessor } from "./Processors/TextProcessor";
import { VideoProcessor } from "./Processors/VideoProcessor";
import { BasicTextProcessor } from "./Processors/BasicTextProcessor";

export class StyleCommandProcessor {
  static lastModifiedProperty = null;
  static lastModifiedValue = null;
  static lastUsedProcessor = null;
  static currentContext = null;
  static pendingPrompt = null;

  static processStyleCommand(input, component) {
    console.log("StyleCommandProcessor received input:", input);
    console.log("Component style:", component?.style);
    console.log("Current context:", this.currentContext);

    // Handle direct color input when we have a pending prompt
    const directColorPattern = /^([a-z]+|#[0-9a-f]{3,6}|rgb\(\d+,\s*\d+,\s*\d+\))$/i;
    if (this.pendingPrompt && directColorPattern.test(input)) {
      const contextProcessorMap = {
        'border': BorderProcessor,
        'background': BackgroundProcessor,
        'text': TextProcessor
      };

      const contextProcessor = contextProcessorMap[this.currentContext];
      if (contextProcessor) {
        // Use the stored followUp command to process the color
        const command = this.pendingPrompt.followUp.command(input);
        const result = contextProcessor.processCommand(command, component?.style);
        this.pendingPrompt = null; // Clear the pending prompt
        return result;
      }
    }

    // If we have a context and this is a color command, prioritize the appropriate processor
    if (this.currentContext && input.match(/(?:color|#[0-9a-fA-F]{6}|rgb|rgba)/i)) {
      const contextProcessorMap = {
        'border': BorderProcessor,
        'background': BackgroundProcessor,
        'text': TextProcessor
      };

      const contextProcessor = contextProcessorMap[this.currentContext];
      if (contextProcessor) {
        const result = contextProcessor.processCommand(input, component?.style);
        if (result) {
          // Store prompt information if this is a PROMPT type response
          if (result.type === 'PROMPT') {
            this.pendingPrompt = result;
            this.currentContext = result.context || this.currentContext;
            return result;
          }
          
          // Only store context if we have style updates
          if (result.style) {
            this.lastModifiedProperty = Object.keys(result.style)[0];
            this.lastModifiedValue = result.style[this.lastModifiedProperty];
            this.lastUsedProcessor = contextProcessor;
          }
          return result;
        }
      }
    }

    // If we get a PROMPT type response from any processor, return it directly
    const borderResult = BorderProcessor.processCommand(
      input,
      component?.style
    );
    if (borderResult?.type === "PROMPT") {
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
      console.log(`Trying ${processor.name}`);
      const result = processor.processCommand(input, component?.style);

      // Return PROMPT responses directly
      if (result?.type === "PROMPT") {
        return result;
      }

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
    this.currentContext = null;
    this.pendingPrompt = null;
  }

  static setContext(context) {
    console.log("Setting context to:", context);
    this.currentContext = context;
    this.pendingPrompt = null;
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
