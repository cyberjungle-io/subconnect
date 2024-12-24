import { LayoutProcessor } from "./LayoutProcessor";
import { SizeProcessor } from "./SizeProcessor";
import { SpacingProcessor } from "./SpacingProcessor";
import { BorderProcessor } from "./BorderProcessor";
import { ShadowProcessor } from "./ShadowProcessor";
import { BackgroundProcessor } from "./BackgroundProcessor";

export class FlexContainerProcessor {
  static validProcessors = [
    LayoutProcessor,
    SizeProcessor,
    SpacingProcessor,
    BorderProcessor,
    ShadowProcessor,
    BackgroundProcessor,
  ];

  static processCommand(input, component) {
    console.log("FlexContainerProcessor processing command:", input);

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

    // Then try other valid processors in order of likelihood
    for (const Processor of this.validProcessors) {
      if (Processor === LayoutProcessor) continue; // Skip as we already tried it

      console.log(`Trying ${Processor.name}`);
      const result = Processor.processCommand(input, component?.style);
      if (result) {
        console.log(`${Processor.name} matched:`, result);
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
    ];
  }
}
