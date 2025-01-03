import {
  FaLayerGroup,
  FaArrowRight,
  FaArrowsAltH,
  FaArrowsAltV,
  FaArrowsAlt,
  FaGripLines,
  FaWrench,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaColumns,
  FaGripLinesVertical,
  FaExpandAlt,
} from "react-icons/fa";
import { LLMProcessor } from "./LLMProcessor";

export class LayoutProcessor {
  // Update natural language mappings to include simpler terms
  static naturalLanguageMap = {
    // Direction mappings
    horizontal: "row",
    vertical: "column",
    "left to right": "row",
    "top to bottom": "column",
    sideways: "row",
    "up and down": "column",
    across: "row",
    down: "column",
    "change to horizontal": "row",
    "change to vertical": "column",
    "set to horizontal": "row",
    "set to vertical": "column",
    row: "row",
    column: "column",

    // Justify content mappings
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
    centered: "center",
    "in the middle": "center",
    "at the start": "flex-start",
    "at the beginning": "flex-start",
    "at the end": "flex-end",
    "push to start": "flex-start",
    "push to end": "flex-end",
    start: "flex-start",
    end: "flex-end",
    center: "center",

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
    stretch: "stretch",
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
    stretch: "stretch",
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

    // Add wrap mappings
    wrap: "wrap",
    nowrap: "nowrap",
    "wrap-reverse": "wrap-reverse",
    "no wrap": "nowrap",
    "don't wrap": "nowrap",
    "enable wrap": "wrap",
    "disable wrap": "nowrap",
    "allow wrap": "wrap",
    "prevent wrap": "nowrap",
    "wrap items": "wrap",
    "wrap content": "wrap",
    "single line": "nowrap",
    "multiple lines": "wrap",
    "reverse wrap": "wrap-reverse",
  };

  // Add metadata for registry
  static getMetadata() {
    return {
      id: "LayoutProcessor",
      name: "Layout Processor",
      priority: 95,
      contextTypes: ["FLEX_CONTAINER", "ALL"],
      patterns: [
        // Direct command patterns
        {
          pattern: /^(horizontal|vertical)$/i,
          type: "LAYOUT",
          priority: 100,
          property: "flexDirection",
          examples: ["horizontal", "vertical"],
        },
        // Direct wrap commands
        {
          pattern: /^(wrap|nowrap|wrap\-reverse)$/i,
          type: "LAYOUT",
          priority: 100,
          property: "flexWrap",
          examples: ["wrap", "nowrap", "wrap-reverse"],
        },
        // Direct justify content commands
        {
          pattern: /^(start|end|center|between|around|evenly)$/i,
          type: "LAYOUT",
          priority: 100,
          property: "justifyContent",
          examples: ["start", "end", "center", "between", "around", "evenly"],
        },
        // Direct align items commands
        {
          pattern: /^(stretch|baseline|top|bottom|middle)$/i,
          type: "LAYOUT",
          priority: 100,
          property: "alignItems",
          examples: ["stretch", "baseline", "top", "bottom", "middle"],
        },
        {
          pattern: /(?:flex|direction|justify|align|gap|wrap)/i,
          type: "LAYOUT",
          priority: 95,
          property: "layout",
          examples: ["set flex direction to row", "align items center"],
        },
        {
          pattern: /(?:horizontal|vertical|row|column)/i,
          type: "LAYOUT",
          priority: 90,
          property: "flexDirection",
          examples: ["make it horizontal", "change to vertical"],
        },
        {
          pattern: /(?:wrap|nowrap)/i,
          type: "LAYOUT",
          priority: 85,
          property: "flexWrap",
          examples: ["enable wrap", "no wrap"],
        },
        {
          pattern: /(?:justify|space|distribute)/i,
          type: "LAYOUT",
          priority: 85,
          property: "justifyContent",
          examples: ["justify content center", "space between items"],
        },
        {
          pattern: /(?:align|stretch|baseline)/i,
          type: "LAYOUT",
          priority: 85,
          property: "alignItems",
          examples: ["align items center", "stretch items"],
        },
      ],
    };
  }

  // Add back the original processCommand with modifications
  static processCommand(input, context) {
    console.log("LayoutProcessor processing:", input, context);
    const lowercaseInput = input.toLowerCase().trim();

    // Direct command handling for flexDirection
    if (lowercaseInput === "horizontal") {
      return {
        props: { flexDirection: "row" },
        confidence: 1.0,
        message: "Set layout to horizontal",
      };
    }

    if (lowercaseInput === "vertical") {
      return {
        props: { flexDirection: "column" },
        confidence: 1.0,
        message: "Set layout to vertical",
      };
    }

    // Direct command handling for flexWrap
    const wrapCommands = {
      wrap: "wrap",
      nowrap: "nowrap",
      "wrap-reverse": "wrap-reverse",
    };
    if (wrapCommands[lowercaseInput]) {
      return {
        props: { flexWrap: wrapCommands[lowercaseInput] },
        confidence: 1.0,
        message: `Updated wrap mode to ${wrapCommands[lowercaseInput]}`,
      };
    }

    // Direct command handling for justifyContent
    const justifyCommands = {
      start: "flex-start",
      end: "flex-end",
      center: "center",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
    };
    if (justifyCommands[lowercaseInput]) {
      return {
        props: { justifyContent: justifyCommands[lowercaseInput] },
        confidence: 1.0,
        message: `Updated justify content to ${justifyCommands[lowercaseInput]}`,
      };
    }

    // Direct command handling for alignItems
    const alignCommands = {
      stretch: "stretch",
      baseline: "baseline",
      top: "flex-start",
      bottom: "flex-end",
      middle: "center",
    };
    if (alignCommands[lowercaseInput]) {
      return {
        props: { alignItems: alignCommands[lowercaseInput] },
        confidence: 1.0,
        message: `Updated align items to ${alignCommands[lowercaseInput]}`,
      };
    }

    // Natural language mapping handling
    if (this.naturalLanguageMap[lowercaseInput]) {
      const value = this.naturalLanguageMap[lowercaseInput];
      let property;

      if (["row", "column"].includes(value)) {
        property = "flexDirection";
      } else if (["wrap", "nowrap", "wrap-reverse"].includes(value)) {
        property = "flexWrap";
      } else if (
        [
          "flex-start",
          "flex-end",
          "center",
          "space-between",
          "space-around",
          "space-evenly",
        ].includes(value)
      ) {
        property = "justifyContent";
      } else if (["stretch", "baseline"].includes(value)) {
        property = "alignItems";
      }

      if (property) {
        return {
          props: { [property]: value },
          confidence: 0.9,
          message: `Updated ${property} to ${value}`,
        };
      }
    }

    return null;
  }

  static getStylePatterns() {
    return {
      flexDirection: [
        /(?:set|make|change)?\s*(?:the)?\s*direction\s*(?:to)?\s*(horizontal|vertical|row|column)/i,
        /(?:set|make|change)?\s*(?:the)?\s*flex\s*direction\s*(?:to)?\s*(horizontal|vertical|row|column)/i,
        /(?:arrange|layout|display)\s*(?:items)?\s*(horizontally|vertically)/i,
        /(?:stack|place)\s*(?:items|elements)?\s*(horizontally|vertically)/i,
        /(?:put|align)\s*(?:items|elements)?\s*(?:in\s*a)?\s*(horizontal|vertical)\s*(?:layout)?/i,
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
    if (flexDirection === "row") {
      return [
        "Note: Items must not have fixed height to stretch vertically",
        "Try: 'remove fixed height' or 'auto height' to allow stretching",
        "Items with explicit height values won't stretch",
      ];
    } else {
      return [
        "Note: Items must not have fixed width to stretch horizontally",
        "Try: 'remove fixed width' or 'auto width' to allow stretching",
        "Items with explicit width values won't stretch",
      ];
    }
  }

  static getSuggestions(headerClass, buttonClass) {
    return {
      text: "Layout",
      type: "category",
      icon: FaLayerGroup,
      className: headerClass,
      options: [
        {
          text: "Direction",
          type: "info",
          icon: FaArrowRight,
          className: headerClass,
        },
        {
          text: "horizontal",
          type: "command",
          icon: FaArrowsAltH,
          className: buttonClass,
        },
        {
          text: "vertical",
          type: "command",
          icon: FaArrowsAltV,
          className: buttonClass,
        },
        {
          text: "Wrap",
          type: "info",
          icon: FaArrowsAlt,
          className: headerClass,
        },
        {
          text: "wrap",
          type: "command",
          icon: FaArrowsAltH,
          className: buttonClass,
        },
        {
          text: "no wrap",
          type: "command",
          icon: FaGripLines,
          className: buttonClass,
        },
        {
          text: "Justify Content",
          type: "info",
          icon: FaWrench,
          className: headerClass,
        },
        {
          text: "start",
          type: "command",
          icon: FaAlignLeft,
          className: buttonClass,
        },
        {
          text: "center",
          type: "command",
          icon: FaAlignCenter,
          className: buttonClass,
        },
        {
          text: "end",
          type: "command",
          icon: FaAlignRight,
          className: buttonClass,
        },
        {
          text: "between",
          type: "command",
          icon: FaGripLines,
          className: buttonClass,
        },
        {
          text: "around",
          type: "command",
          icon: FaColumns,
          className: buttonClass,
        },
        {
          text: "evenly",
          type: "command",
          icon: FaGripLinesVertical,
          className: buttonClass,
        },
        {
          text: "Align Items",
          type: "info",
          icon: FaWrench,
          className: headerClass,
        },
        {
          text: "start",
          type: "command",
          icon: FaAlignLeft,
          className: buttonClass,
        },
        {
          text: "center",
          type: "command",
          icon: FaAlignCenter,
          className: buttonClass,
        },
        {
          text: "end",
          type: "command",
          icon: FaAlignRight,
          className: buttonClass,
        },
        {
          text: "stretch",
          type: "command",
          icon: FaExpandAlt,
          className: buttonClass,
        },
        {
          text: "baseline",
          type: "command",
          icon: FaGripLines,
          className: buttonClass,
        },
        {
          text: "Align Content",
          type: "info",
          icon: FaWrench,
          className: headerClass,
        },
        {
          text: "start",
          type: "command",
          icon: FaAlignLeft,
          className: buttonClass,
        },
        {
          text: "center",
          type: "command",
          icon: FaAlignCenter,
          className: buttonClass,
        },
        {
          text: "end",
          type: "command",
          icon: FaAlignRight,
          className: buttonClass,
        },
        {
          text: "stretch",
          type: "command",
          icon: FaExpandAlt,
          className: buttonClass,
        },
        {
          text: "between",
          type: "command",
          icon: FaGripLines,
          className: buttonClass,
        },
        {
          text: "around",
          type: "command",
          icon: FaColumns,
          className: buttonClass,
        },
      ],
    };
  }

  static getIntentDefinitions() {
    return [
      {
        type: "LAYOUT_UPDATE",
        description: "User wants to modify layout/direction",
        examples: [
          {
            input: "make it vertical",
            output: {
              type: "LAYOUT_UPDATE",
              targetProperty: "flexDirection",
              value: "column",
              confidence: 0.9,
            },
          },
          {
            input: "center items",
            output: {
              type: "LAYOUT_UPDATE",
              targetProperty: "justifyContent",
              value: "center",
              confidence: 0.9,
            },
          },
        ],
      },
    ];
  }

  // Add method to detect layout-specific intents
  static async detectIntent(input) {
    return LLMProcessor.detectIntent(input, this.getIntentDefinitions());
  }
}
