export const buttonControlsPrompt = `
Button Controls Available:

1. Hover Effects:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "hoverBackgroundColor": "[COLOR]",
    "hoverColor": "[COLOR]",
    "hoverScale": "[0.5-2.0]"
  }
}

2. Cursor Style:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "cursor": "[CURSOR_TYPE]"
  }
}

3. Transitions:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "transitionDuration": "[MS]",
    "transition": "all [DURATION]ms [TIMING_FUNCTION]"
  }
}

4. Page Navigation:
{
  "type": "modify",
  "componentId": "[ID]",
  "style": {
    "enablePageNavigation": true|false,
    "targetPageId": "[PAGE_ID]"
  }
}

Available Cursor Types:
- pointer (default for buttons)
- default
- move
- grab/grabbing
- not-allowed
- wait
- progress
- help
- crosshair
- text
- copy
- cell

Hover Effect Presets:
- Subtle: Small scale (1.05) with slight color change
- Medium: Medium scale (1.1) with noticeable color change
- Strong: Large scale (1.15) with dramatic color change

Examples:
- "Add a subtle hover effect"
- "Make the button grow on hover"
- "Change color to blue on hover"
- "Add a smooth transition effect"
- "Link this button to page XYZ"
`; 