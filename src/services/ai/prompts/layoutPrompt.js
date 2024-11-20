export const layoutControlsPrompt = `
Layout Controls Available:

1. Basic Layout:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "display": "flex",
    "flexDirection": "[row|column|row-reverse|column-reverse]"
  }
}

2. Wrapping:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "flexWrap": "[nowrap|wrap|wrap-reverse]"
  }
}

3. Main Axis Alignment (justifyContent):
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "justifyContent": "[flex-start|flex-end|center|space-between|space-around|space-evenly]"
  }
}

4. Cross Axis Alignment (alignItems):
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "alignItems": "[flex-start|flex-end|center|baseline|stretch]"
  }
}

5. Multi-line Alignment (alignContent):
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "alignContent": "[flex-start|flex-end|center|space-between|space-around|stretch]"
  }
}

6. Child Element Properties:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "flexGrow": "[number]",
    "flexShrink": "[number]",
    "flexBasis": "[value]",
    "order": "[number]"
  }
}

Common Layout Patterns:
- Row Layout: Items in a horizontal line
- Column Layout: Items stacked vertically
- Grid-like Layout: Wrapped items with equal spacing
- Centered Layout: Items centered both horizontally and vertically
- Space Between: Items spread out with equal spacing

Examples:
- "Arrange items in a row"
- "Stack items vertically"
- "Center all items"
- "Wrap items with equal spacing"
- "Distribute items evenly"
- "Make this item grow to fill space"
`; 