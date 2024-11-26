export class LayoutProcessor {
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
        /(?:flow|arrange)\s*(?:from)?\s*(left to right|top to bottom)/i
      ],
      flexWrap: [
        /(?:set|make|change)?\s*(?:the)?\s*(?:flex)?\s*wrap\s*(?:to)?\s*(wrap|nowrap|wrap-reverse)/i,
        /(?:enable|disable)\s*(?:flex)?\s*wrap(?:ping)?/i,
        /(?:allow|prevent)\s*(?:items)?\s*(?:to)?\s*wrap(?:ping)?/i,
        /(?:items|elements)\s*should\s*(?:wrap|not wrap)/i,
        /(?:keep|maintain)\s*(?:everything)?\s*(?:on)?\s*(?:one|single)\s*(?:row|line)/i,
        /(?:let|make)\s*(?:items)?\s*(?:flow|move)\s*(?:to)?\s*(?:the)?\s*next\s*(?:row|line)/i,
        /(?:wrap|move)\s*(?:items)?\s*(?:to)?\s*(?:new|next)?\s*(?:row|line)/i
      ],
      justifyContent: [
        /(?:set|make|change)?\s*(?:the)?\s*justify\s*content\s*(?:to)?\s*(flex-start|flex-end|center|space-between|space-around|space-evenly)/i,
        /(?:justify|space)\s*(?:items)?\s*(?:to|with)?\s*(start|end|center|between|around|evenly)/i,
        /(?:distribute|spread)\s*(?:items)?\s*(evenly|equally)/i,
        /(?:put|place)\s*(?:equal)?\s*space\s*(between|around)\s*(?:items|elements)/i,
        /(?:align|position)\s*(?:items)?\s*(?:to)?\s*(?:the)?\s*(left|right|center)/i,
        /(?:center|middle)\s*(?:align)?\s*(?:items|elements|everything)/i,
        /(?:push|move)\s*(?:items)?\s*(?:to)?\s*(?:the)?\s*(start|end|left|right)/i,
        /(?:make|add)\s*(?:equal)?\s*spacing\s*(between|around)\s*(?:items|elements)/i
      ],
      alignItems: [
        /(?:set|make|change)?\s*(?:the)?\s*align\s*items\s*(?:to)?\s*(flex-start|flex-end|center|stretch|baseline)/i,
        /(?:align|position)\s*(?:items)?\s*(?:to)?\s*(top|bottom|center|stretch|baseline)/i,
        /(?:vertically)?\s*(?:align|position)\s*(?:items)?\s*(?:to)?\s*(?:the)?\s*(top|bottom|middle|center)/i,
        /(?:stretch|expand)\s*(?:items|elements)\s*(?:to\s*fill|fully)/i,
        /(?:make|set)\s*(?:items|elements)\s*(?:the\s*same|equal)\s*height/i,
        /(?:align|line\s*up)\s*(?:items)?\s*(?:by|at|to)?\s*(?:their)?\s*baseline/i,
        /(?:items|elements)\s*should\s*(?:be|align)?\s*(stretched|centered|at the top|at the bottom)/i
      ],
      alignContent: [
        /(?:set|make|change)?\s*(?:the)?\s*align\s*content\s*(?:to)?\s*(flex-start|flex-end|center|stretch|space-between|space-around)/i,
        /(?:align|position)\s*content\s*(?:to)?\s*(top|bottom|center|stretch|between|around)/i,
        /(?:distribute|spread)\s*(?:rows|lines)\s*(evenly|equally)/i,
        /(?:put|add)\s*(?:equal)?\s*space\s*(between|around)\s*(?:rows|lines)/i,
        /(?:move|push)\s*(?:all)?\s*(?:rows|lines)\s*(?:to)?\s*(?:the)?\s*(top|bottom|center)/i,
        /(?:stretch|expand)\s*(?:rows|lines)\s*(?:to\s*fill|fully)/i,
        /(?:pack|compress)\s*(?:rows|lines)\s*(?:to)?\s*(?:the)?\s*(top|bottom|center)/i,
        /(?:space|gap)\s*(?:between|around)\s*(?:rows|lines)/i
      ]
    };
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

  static processCommand(input) {
    console.log("LayoutProcessor received input:", input);

    const stylePatterns = this.getStylePatterns();
    let matchFound = false;
    let result = null;

    for (const [property, patterns] of Object.entries(stylePatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);

        if (match && !matchFound) {
          matchFound = true;
          let value = match[1]?.toLowerCase();

          // Handle special cases for more natural language
          switch (value) {
            case "horizontally":
              value = "row";
              break;
            case "vertically":
              value = "column";
              break;
            case "top":
              value = "flex-start";
              break;
            case "bottom":
              value = "flex-end";
              break;
            case "between":
              value = "space-between";
              break;
            case "around":
              value = "space-around";
              break;
            case "evenly":
              value = "space-evenly";
              break;
            case "start":
              value = "flex-start";
              break;
            case "end":
              value = "flex-end";
              break;
          }

          // Handle enable/disable wrap
          if (property === "flexWrap" && input.match(/enable/i)) {
            value = "wrap";
          } else if (property === "flexWrap" && input.match(/disable/i)) {
            value = "nowrap";
          }

          console.log(`Matched pattern for ${property}:`, value);
          result = {
            style: {
              [property]: value,
            },
          };
        }
      }
    }

    console.log("LayoutProcessor result:", result);
    return result;
  }
}
