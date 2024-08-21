const highlightColors = [
    '#FF0000', // Red for top level
    '#00FF00', // Green for second level
    '#0000FF', // Blue for third level
    '#FFFF00', // Yellow for fourth level
    '#FF00FF', // Magenta for fifth level
  ];
  
  export const getHighlightColor = (depth) => {
    return highlightColors[depth % highlightColors.length];
  };