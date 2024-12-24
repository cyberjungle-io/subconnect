import { LayoutProcessor } from "./LayoutProcessor";
import { SizeProcessor } from "./SizeProcessor";
import { SpacingProcessor } from "./SpacingProcessor";
import { BorderProcessor } from "./BorderProcessor";
import { ShadowProcessor } from "./ShadowProcessor";
import { BackgroundProcessor } from "./BackgroundProcessor";
import { ButtonProcessor } from "./ButtonProcessor";
import { StyleCommandProcessor } from "./StyleCommandProcessor";

export class FlexContainerProcessor {
  static validProcessors = [
    LayoutProcessor,
    SizeProcessor,
    SpacingProcessor,
    BorderProcessor,
    ShadowProcessor,
    BackgroundProcessor,
    ButtonProcessor,
  ];

  static processCommand(input, component, buttonClass, context) {
    console.log("FlexContainerProcessor processing command:", input);
    console.log("Received context:", context);

    // First try layout-specific commands as they're most common for flex containers
    const layoutResult = LayoutProcessor.processCommand(input);
    if (layoutResult) {
      console.log("Layout processor matched:", layoutResult);
      return {
        ...layoutResult,
        message:
          layoutResult.message ||
          `Updated ${Object.keys(layoutResult.props || layoutResult.style)[0]}`,
      };
    }

    // If we have a direct color input and a background context, try BackgroundProcessor first
    const directColorPattern =
      /^([a-z]+|#[0-9a-f]{3,6}|rgb\(\d+,\s*\d+,\s*\d+\))$/i;
    if (context === "background" && directColorPattern.test(input)) {
      console.log("Processing direct color input for background");
      const result = BackgroundProcessor.processCommand(
        input,
        component?.style,
        buttonClass
      );
      if (result) {
        return result;
      }
    }

    // Define context processor map
    const contextProcessorMap = {
      background: BackgroundProcessor,
      border: BorderProcessor,
      shadow: ShadowProcessor,
    };

    // If we have a context, try that processor first
    if (context && contextProcessorMap[context]) {
      const contextProcessor = contextProcessorMap[context];
      console.log(`Trying context processor ${contextProcessor.name} first`);
      const result = contextProcessor.processCommand(
        input,
        component?.style,
        buttonClass
      );
      if (result) {
        console.log(`${contextProcessor.name} matched:`, result);
        return result;
      }
    }

    // Then try other valid processors in order of likelihood
    for (const Processor of this.validProcessors) {
      if (Processor === LayoutProcessor) continue; // Skip as we already tried it
      if (context && Processor === contextProcessorMap[context])
        continue;

      console.log(`Trying ${Processor.name}`);
      const result = Processor.processCommand(
        input,
        component?.style,
        buttonClass
      );
      if (result) {
        console.log(`${Processor.name} matched:`, result);

        // If it's a PROMPT type, return it directly without modification
        if (result.type === "PROMPT") {
          return result;
        }

        return {
          ...result,
          message:
            result.message ||
            `Updated ${Object.keys(result.style || result.props)[0]}`,
        };
      }
    }

    return null;
  }

  static getSuggestions(headerClass, buttonClass) {
    return [
      LayoutProcessor.getSuggestions(headerClass, buttonClass),
      SizeProcessor.getSuggestions(headerClass, buttonClass),
      SpacingProcessor.getSuggestions(headerClass, buttonClass),
      BorderProcessor.getSuggestions(headerClass, buttonClass),
      ShadowProcessor.getSuggestions(headerClass, buttonClass),
      BackgroundProcessor.getSuggestions(headerClass, buttonClass),
      ButtonProcessor.getSuggestions(headerClass, buttonClass),
    ];
  }
}
