export class LayoutProcessor {
  // Update natural language mappings to include simpler terms
  static naturalLanguageMap = {
    // Direction mappings
    "left to right": "row",
    "right to left": "row-reverse",
    "top to bottom": "column",
    "bottom to top": "column-reverse",
    horizontal: "row",
    vertical: "column",
    sideways: "row",
    "up and down": "column",
    across: "row",
    down: "column",
    "change to row": "row",
    "change to column": "column",
    "set to row": "row",
    "set to column": "column",
    row: "row",
    column: "column",

    // Justify content mappings
    "spread out": "space-between",
    "spaced evenly": "space-evenly",
    "spaced equally": "space-evenly",
    "equal gaps": "space-evenly",
    "equal spacing": "space-evenly",
    "spread apart": "space-around",
    centered: "center",
    "in the middle": "center",
    "at the start": "flex-start",
    "at the beginning": "flex-start",
    "at the end": "flex-end",
    "push to start": "flex-start",
    "push to end": "flex-end",
    // Add direct mappings for simple terms
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",

    // Align items mappings
    "stretch to fit": "stretch",
    "fill space": "stretch",
    "full height": "stretch",
    "same height": "stretch",
    "at the top": "flex-start",
    "at the bottom": "flex-end",
    "in the center": "center",
    middle: "center",
    "line up": "baseline",
    "align text": "baseline",
    // Add direct mappings
    stretch: "stretch",
    baseline: "baseline",
    top: "flex-start",
    bottom: "flex-end",

    // Enhance stretch mappings
    "stretch": "stretch",
    "stretch items": "stretch",
    "fill container": "stretch",
    "expand items": "stretch",
    "fill width": "stretch",
    "fill height": "stretch",
    "stretch to fill": "stretch",
    "fill space": "stretch",
    "expand to fill": "stretch",
    "make items fill": "stretch",
    "stretch all": "stretch",
    "fill all": "stretch",
    "expand all": "stretch",

    // Update stretch mappings with more precise descriptions
    "stretch": "stretch",
    "stretch items": "stretch",
    "auto height": "stretch",
    "auto width": "stretch",
    "fit container": "stretch",
    "remove fixed height": "stretch",
    "remove fixed width": "stretch",
    "auto size": "stretch",
    "stretch to container": "stretch",
    "fit parent": "stretch",
    "fill available space": "stretch",
  };

  static getStylePatterns() {
    return {
      flexDirection: [
        /(?:set|make|change)?\s*(?:the)?\s*direction\s*(?:to)?\s*(row|column)/i,
        /(?:set|make|change)?\s*(?:the)?\s*flex\s*direction\s*(?:to)?\s*(row|column)/i,
        /(?:arrange|layout|display)\s*(?:items)?\s*(horizontally|vertically)/i,
        /(?:stack|place)\s*(?:items|elements)?\s*(horizontally|vertically)/i,
        /(?:put|align)\s*(?:items|elements)?\s*(?:in\s*a)?\s*(row|column)/i,
        /(?:make|create)\s*(?:a)?\s*(horizontal|vertical)\s*(?:layout|arrangement)/i,
        /(?:items|elements)\s*should\s*(?:go|be)\s*(horizontally|vertically)/i,
        /(?:flow|arrange)\s*(?:from)?\s*(left to right|top to bottom)/i,
        /(?:i want|i need|i'd like|could you|can you|please)?\s*(?:make|set|arrange|put)\s*(?:it|everything|the items|the elements)?\s*(?:go|flow|run|layout)?\s*(left to right|right to left|top to bottom|bottom to top|horizontal|vertical|sideways|up and down|across|down)/i,
        /(?:items|elements|everything)\s*should\s*(?:go|flow|run|be\s*arranged)?\s*(left to right|right to left|top to bottom|bottom to top|horizontal|vertical)/i,
        /(?:display|show|arrange|organize)\s*(?:items|elements|everything)?\s*(?:going)?\s*(left to right|right to left|top to bottom|bottom to top|horizontal|vertical)/i,
      ],
      flexWrap: [
        /(?:set|make|change)?\s*(?:the)?\s*(?:flex)?\s*wrap\s*(?:to)?\s*(wrap|nowrap|wrap-reverse)/i,
        /(?:enable|disable)\s*(?:flex)?\s*wrap(?:ping)?/i,
        /(?:allow|prevent)\s*(?:items)?\s*(?:to)?\s*wrap(?:ping)?/i,
        /(?:items|elements)\s*should\s*(?:wrap|not wrap)/i,
        /(?:keep|maintain)\s*(?:everything)?\s*(?:on)?\s*(?:one|single)\s*(?:row|line)/i,
        /(?:let|make)\s*(?:items)?\s*(?:flow|move)\s*(?:to)?\s*(?:the)?\s*next\s*(?:row|line)/i,
        /(?:wrap|move)\s*(?:items)?\s*(?:to)?\s*(?:new|next)?\s*(?:row|line)/i,
      ],
      justifyContent: [
        /(?:set|make|change)?\s*(?:the)?\s*justify\s*content\s*(?:to)?\s*(flex-start|flex-end|center|space-between|space-around|space-evenly)/i,
        /(?:justify|space)\s*(?:items)?\s*(?:to|with)?\s*(start|end|center|between|around|evenly)/i,
        /(?:distribute|spread)\s*(?:items)?\s*(evenly|equally)/i,
        /(?:put|place)\s*(?:equal)?\s*space\s*(between|around)\s*(?:items|elements)/i,
        /(?:align|position)\s*(?:items)?\s*(?:to)?\s*(?:the)?\s*(left|right|center)/i,
        /(?:center|middle)\s*(?:align)?\s*(?:items|elements|everything)/i,
        /(?:push|move)\s*(?:items)?\s*(?:to)?\s*(?:the)?\s*(start|end|left|right)/i,
        /(?:make|add)\s*(?:equal)?\s*spacing\s*(between|around)\s*(?:items|elements)/i,
        /(?:i want|i need|i'd like|could you|can you|please)?\s*(?:make|set|put|place)\s*(?:it|everything|the items|the elements)?\s*(?:spread out|spaced evenly|spaced equally|equal gaps|equal spacing|spread apart|centered|in the middle|at the start|at the beginning|at the end)/i,
        /(?:can you|could you|please)?\s*(?:add|put|place|make)\s*(?:some|equal)?\s*(?:space|spacing|gaps)\s*(?:between|around)\s*(?:items|elements|everything)/i,
        /(?:everything|items|elements)\s*should\s*(?:be|have)?\s*(?:spread out|spaced evenly|spaced equally|equal gaps|equal spacing|spread apart|centered|in the middle)/i,
      ],
      alignItems: [
        /(?:set|make|change)?\s*(?:the)?\s*align\s*items\s*(?:to)?\s*(flex-start|flex-end|center|stretch|baseline)/i,
        /(?:align|position)\s*(?:items)?\s*(?:to)?\s*(top|bottom|center|stretch|baseline)/i,
        /(?:vertically)?\s*(?:align|position)\s*(?:items)?\s*(?:to)?\s*(?:the)?\s*(top|bottom|middle|center)/i,
        /(?:stretch|expand)\s*(?:items|elements)\s*(?:to\s*fill|fully)/i,
        /(?:make|set)\s*(?:items|elements)\s*(?:the\s*same|equal)\s*height/i,
        /(?:align|line\s*up)\s*(?:items)?\s*(?:by|at|to)?\s*(?:their)?\s*baseline/i,
        /(?:items|elements)\s*should\s*(?:be|align)?\s*(stretched|centered|at the top|at the bottom)/i,
        /(?:i want|i need|i'd like|could you|can you|please)?\s*(?:make|set|have)\s*(?:it|everything|the items|the elements)?\s*(?:stretch to fit|fill space|full height|same height|at the top|at the bottom|in the center|middle|line up|align text)/i,
        /(?:can you|could you|please)?\s*(?:align|position|put)\s*(?:everything|items|elements)?\s*(?:at the top|at the bottom|in the center|middle|baseline)/i,
        /(?:make|set)\s*(?:all)?\s*(?:items|elements)\s*(?:the same|equal)\s*(?:height|size)/i,
        /(?:make|set|have)?\s*(?:items|elements)?\s*(?:stretch|expand|fill)\s*(?:the)?\s*(?:container|space|width|height)?/i,
        /(?:stretch|expand|fill)\s*(?:items|elements)?\s*(?:to)?\s*(?:fill|fit|match)?\s*(?:container|parent|space)?/i,
        /(?:make|set|have)?\s*(?:everything|all items|all elements)\s*(?:stretch|expand|fill)\s*(?:completely|fully|entirely)?/i,
        /(?:make|set|allow)?\s*(?:items|elements)?\s*(?:to)?\s*(?:auto|automatic)\s*(?:height|width|size)/i,
        /(?:remove|clear)\s*(?:fixed|set|explicit)\s*(?:height|width|size)/i,
        /(?:let|make)\s*(?:items|elements)?\s*(?:fit|adjust)\s*(?:to)?\s*(?:container|parent|available space)/i,
      ],
      alignContent: [
        /(?:set|make|change)?\s*(?:the)?\s*align\s*content\s*(?:to)?\s*(flex-start|flex-end|center|stretch|space-between|space-around)/i,
        /(?:align|position)\s*content\s*(?:to)?\s*(top|bottom|center|stretch|between|around)/i,
        /(?:distribute|spread)\s*(?:rows|lines)\s*(evenly|equally)/i,
        /(?:put|add)\s*(?:equal)?\s*space\s*(between|around)\s*(?:rows|lines)/i,
        /(?:move|push)\s*(?:all)?\s*(?:rows|lines)\s*(?:to)?\s*(?:the)?\s*(top|bottom|center)/i,
        /(?:stretch|expand)\s*(?:rows|lines)\s*(?:to\s*fill|fully)/i,
        /(?:pack|compress)\s*(?:rows|lines)\s*(?:to)?\s*(?:the)?\s*(top|bottom|center)/i,
        /(?:space|gap)\s*(?:between|around)\s*(?:rows|lines)/i,
      ],
    };
  }

  static processCommand(input) {
    console.log("LayoutProcessor received input:", input);
    const lowercaseInput = input.toLowerCase().trim();

    // First check for direct matches in natural language map
    if (this.naturalLanguageMap[lowercaseInput]) {
      const value = this.naturalLanguageMap[lowercaseInput];
      
      // Determine the appropriate property based on the value
      let property;
      if (["row", "column", "row-reverse", "column-reverse"].includes(value)) {
        property = "flexDirection";
      } else if (["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"].includes(value)) {
        // Check input context for vertical alignment
        const isVerticalAlign = lowercaseInput.includes("vertical") || 
                              lowercaseInput.includes("height") ||
                              lowercaseInput.includes("top") ||
                              lowercaseInput.includes("bottom");
        property = isVerticalAlign ? "alignItems" : "justifyContent";
      } else if (["stretch", "baseline"].includes(value)) {
        property = "alignItems";
      }

      if (property) {
        console.log(`Matched layout command: ${property}: ${value}`);
        return {
          style: {
            [property]: value
          }
        };
      }
    }

    // If no direct match, try the patterns
    const patterns = this.getStylePatterns();
    for (const [property, propertyPatterns] of Object.entries(patterns)) {
      for (const pattern of propertyPatterns) {
        const match = lowercaseInput.match(pattern);
        if (match) {
          let value = match[1]?.toLowerCase();
          if (this.naturalLanguageMap[value]) {
            value = this.naturalLanguageMap[value];
          }
          return {
            style: {
              [property]: value
            }
          };
        }
      }
    }

    return null;
  }

  static getPropertyNames() {
    return {
      flexDirection: "flex direction",
      flexWrap: "flex wrap",
      justifyContent: "justify content",
      alignItems: "align items",
      alignContent: "align content",
    };
  }

  static getStretchSuggestions(flexDirection) {
    if (flexDirection === 'row') {
      return [
        "Note: Items must not have fixed height to stretch vertically",
        "Try: 'remove fixed height' or 'auto height' to allow stretching",
        "Items with explicit height values won't stretch"
      ];
    } else {
      return [
        "Note: Items must not have fixed width to stretch horizontally",
        "Try: 'remove fixed width' or 'auto width' to allow stretching",
        "Items with explicit width values won't stretch"
      ];
    }
  }
}
