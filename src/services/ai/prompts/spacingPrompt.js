export const spacingControlsPrompt = `
Spacing Controls Available:

1. Set Padding:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "padding": "[VALUE]"  // Single value or "[TOP] [RIGHT] [BOTTOM] [LEFT]"
  }
}

2. Set Margin:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "margin": "[VALUE]"  // Single value or "[TOP] [RIGHT] [BOTTOM] [LEFT]"
  }
}

3. Set Gap (for flex containers):
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "gap": "[VALUE]"
  }
}

Spacing Presets:
- Small: "8px"
- Medium: "16px"
- Large: "24px"

Valid Units:
- Absolute: px, em, rem
- Relative: %, vw, vh
- Special: auto (for margin only)

Examples:
- "Add 20px padding all around"
- "Set margin to 10px on top and bottom, 20px on sides"
- "Add 16px gap between flex items"
- "Remove all padding"
- "Center the component with auto margins"

Shorthand Formats:
1. One value: applies to all sides
2. Two values: [vertical] [horizontal]
3. Three values: [top] [horizontal] [bottom]
4. Four values: [top] [right] [bottom] [left]
`; 