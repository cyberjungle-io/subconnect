export const backgroundControlsPrompt = `
Background Controls Available:

1. Set Background Color:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "backgroundColor": "[COLOR]"  // Can be hex (#RRGGBB), rgb(r,g,b), rgba(r,g,b,a), or color name
  }
}

2. Set Background Image:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "backgroundImage": "url([IMAGE_URL])"
  }
}

3. Clear Background Image:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "backgroundImage": ""
  }
}

4. Set Both Color and Image:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "backgroundColor": "[COLOR]",
    "backgroundImage": "url([IMAGE_URL])"
  }
}

Examples:
- "Set the background color to blue"
- "Add a background image from [URL]"
- "Remove the background image"
- "Make the background transparent"
`; 