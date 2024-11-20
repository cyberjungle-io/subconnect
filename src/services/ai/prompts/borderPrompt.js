export const borderControlsPrompt = `
Border Controls Available:

1. Set Complete Border:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "borderWidth": "[WIDTH]",
    "borderStyle": "[STYLE]",
    "borderColor": "[COLOR]"
  }
}

2. Set Individual Border Sides:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "borderWidth": "[TOP] [RIGHT] [BOTTOM] [LEFT]"
  }
}

3. Set Border Radius:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "borderRadius": "[RADIUS]" // Single value or "[TOP-LEFT] [TOP-RIGHT] [BOTTOM-RIGHT] [BOTTOM-LEFT]"
  }
}

4. Add Shadow Effects:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "boxShadow": "[X-OFFSET] [Y-OFFSET] [BLUR] [SPREAD] [COLOR]"
  }
}

Valid Values:
- Border Styles: none, solid, dashed, dotted, double, groove, ridge, inset, outset
- Width Units: px, em, rem, %, vw, vh
- Colors: hex (#RRGGBB), rgb(r,g,b), rgba(r,g,b,a), or color names
- Shadow Format: "inset? x-offset y-offset blur-radius spread-radius color"

Examples:
- "Add a 2px solid red border"
- "Make the top border 3px dashed blue"
- "Round the corners by 10px"
- "Add a drop shadow 5px offset with blur"
`; 