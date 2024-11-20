export const sizeControlsPrompt = `
Size Controls Available:

1. Basic Dimensions:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "width": "[VALUE]",
    "height": "[VALUE]"
  }
}

2. Min/Max Constraints:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "minWidth": "[VALUE]",
    "maxWidth": "[VALUE]",
    "minHeight": "[VALUE]",
    "maxHeight": "[VALUE]"
  }
}

3. Fit Content Options:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "width": "fit-content",
    "height": "fit-content"
  }
}

4. Aspect Ratio:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "aspectRatio": "[WIDTH/HEIGHT]"  // e.g., "16/9", "1/1"
  }
}

Size Presets:
- Square: width and height equal
- Banner: full width (100%) with fixed height
- Card: fixed width with auto height
- Full: 100% width and height

Valid Values:
1. Units:
   - Pixels: px
   - Percentage: %
   - Relative: em, rem
   - Viewport: vw, vh
   
2. Special Values:
   - auto
   - fit-content
   - min-content
   - max-content
   
3. Calculations:
   - calc(100% - 20px)
   - calc(50vh - 100px)

Examples:
- "Make it 300px wide and 200px tall"
- "Set width to 100% with auto height"
- "Make it square with 200px sides"
- "Fit content width with minimum 100px"
- "Set 16:9 aspect ratio"
- "Make it full screen size"
`; 