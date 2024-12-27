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
    console.log("Current component:", component);

    // Try layout-specific commands first as they're most common
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

    // Try SizeProcessor next for size-related commands
    const sizeResult = SizeProcessor.processCommand(input, component?.style);
    if (sizeResult) {
      console.log("Size processor matched:", sizeResult);
      return {
        style: {
          ...component.style,
          ...sizeResult.style,
        },
        message: sizeResult.message,
        property: sizeResult.property,
      };
    }

    // Try other processors
    for (const Processor of this.validProcessors) {
      if (Processor === LayoutProcessor || Processor === SizeProcessor)
        continue;

      console.log(`Trying ${Processor.name}`);
      const result = Processor.processCommand(
        input,
        component?.style,
        buttonClass
      );
      if (result) {
        console.log(`${Processor.name} matched:`, result);

        // Handle adjustment functions
        if (result.adjust) {
          const adjustedValues = result.adjust(component?.style);
          console.log("Adjusted values:", adjustedValues);

          // Handle props separately if they exist
          if (adjustedValues.props) {
            const { props, ...styleValues } = adjustedValues;
            return {
              style: {
                ...component.style,
                ...styleValues,
              },
              props: {
                ...component.props,
                ...props,
              },
              message: result.message || `Updated spacing`,
              property: result.property,
            };
          }

          // Handle style-only updates
          return {
            style: {
              ...component.style,
              ...adjustedValues,
            },
            message: result.message || `Updated spacing`,
            property: result.property,
          };
        }

        // Handle direct style/props updates
        if (result.style || result.props) {
          return {
            style: {
              ...component.style,
              ...result.style,
            },
            props: {
              ...component.props,
              ...result.props,
            },
            message:
              result.message ||
              `Updated ${Object.keys(result.style || result.props)[0]}`,
            property: result.property,
          };
        }

        return result;
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
