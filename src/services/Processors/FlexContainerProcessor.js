
import { LayoutProcessor } from "./LayoutProcessor";
import { SizeProcessor } from "./SizeProcessor";
import { SpacingProcessor } from "./SpacingProcessor";
import { BorderProcessor } from "./BorderProcessor";
import { ShadowProcessor } from "./ShadowProcessor";
import { BackgroundProcessor } from "./BackgroundProcessor";



export class FlexContainerProcessor {
  static getSuggestions() {
    const buttonClass = "text-xs px-1 py-1";
    const headerClass = "text-xs font-small text-gray-200";

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
