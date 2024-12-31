import {
  FaArrowsAlt,
  FaExpandAlt,
  FaExpand,
  FaPlus,
  FaTimes,
  FaGripLines,
} from "react-icons/fa";

export class SpacingProcessor {
  static getStylePatterns() {
    return {
      padding: [
        /add\s*(?:some)?\s*padding/i,
        /give\s*(?:it)?\s*(?:some)?\s*padding/i,
        /increase\s*(?:the)?\s*padding/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)(?:\s+(?:all|around))?/i,
        /padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding\s*(?:on\s+)?(?:the\s+)?(top|bottom|left|right)\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*(top|bottom|left|right)\s*padding\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*padding(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:all)?\s*(?:the)?\s*padding/i,
        /(?:make|set)\s*(?:the)?\s*padding\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*padding/i,
        /(?:set|make|use|apply)?\s*(?:the)?\s*(?:padding\s+)?(small|medium|large)\s*padding/i,
      ],
      margin: [
        /add\s*(?:some)?\s*margin/i,
        /give\s*(?:it)?\s*(?:some)?\s*margin/i,
        /increase\s*(?:the)?\s*margin/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)(?:\s+(?:all|around))?/i,
        /margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin\s*(?:on\s+)?(?:the\s+)?(top|bottom|left|right)\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*(top|bottom|left|right)\s*margin\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*margin(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:all)?\s*(?:the)?\s*margin/i,
        /(?:make|set)\s*(?:the)?\s*margin\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*margin/i,
        /(?:set|make|use|apply)?\s*(?:the)?\s*(?:margin\s+)?(small|medium|large)\s*margin/i,
      ],
      gap: [
        /add\s*(?:a)?\s*gap\s*(?:between\s*items)?/i,
        /give\s*(?:it)?\s*(?:a)?\s*gap/i,
        /increase\s*(?:the)?\s*gap/i,
        /add\s*spacing\s*between\s*items/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*gap\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /gap\s*(?:to|=|:)?\s*(\d+(?:px|em|rem|%|vw|vh)?)/i,
        /(?:set|make|change|update|adjust)?\s*(?:the)?\s*gap(?:\s+to|\s+as|\s+should\s+be)?\s*(small|medium|large)/i,
        /(?:remove|clear|delete|eliminate)\s*(?:the)?\s*gap/i,
        /(?:make|set)\s*(?:the)?\s*gap\s*(?:to)?\s*(?:zero|none|0)/i,
        /no\s*gap/i,
        /(?:set|make|use|apply)?\s*(?:the)?\s*(?:gap\s+)?(small|medium|large)\s*gap/i,
      ],
    };
  }

  static getPropertyNames() {
    return {
      padding: "padding",
      margin: "margin",
      gap: "gap",
    };
  }

  static processCommand(input) {
    console.log("SpacingProcessor received input:", input);

    const presetSizes = {
      small: "8px",
      medium: "16px",
      large: "24px",
    };

    // Helper function to parse spacing value
    const parseSpacing = (value) => {
      console.log("Parsing spacing value:", value);
      if (!value || value === "null") return 0;
      const match = String(value).match(/^(-?\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    // Helper function to get unit from value
    const getUnit = (value) => {
      console.log("Getting unit from value:", value);
      if (!value || value === "null") return "px";
      const match = String(value).match(/[a-z%]+$/i);
      return match ? match[0] : "px";
    };

    // Enhanced adjustSpacing function that handles compound values
    const adjustSpacing = (currentValue, increment) => {
      console.log("Adjusting spacing:", { currentValue, increment });

      // If no value exists, start with 0px
      if (!currentValue || currentValue === "null") {
        const newValue = `${Math.max(0, increment)}px`;
        console.log("No current value, returning:", newValue);
        return newValue;
      }

      // Split compound values (e.g. "8px 10px 8px 10px")
      const values = currentValue.split(" ");
      console.log("Split values:", values);

      if (values.length === 1) {
        // Single value - adjust it
        const parsedValue = parseSpacing(values[0]);
        const unit = getUnit(values[0]);
        const newValue = `${Math.max(0, parsedValue + increment)}${unit}`;
        console.log("Adjusted single value:", newValue);
        return newValue;
      } else {
        // Compound value - adjust all sides
        const adjustedValues = values.map((val) => {
          const parsedValue = parseSpacing(val);
          const unit = getUnit(val);
          return `${Math.max(0, parsedValue + increment)}${unit}`;
        });
        const newValue = adjustedValues.join(" ");
        console.log("Adjusted compound value:", newValue);
        return newValue;
      }
    };

    // Get the active section from the UI context
    const getActiveSection = () => {
      console.log("Getting active section");
      const sections = document.querySelectorAll('[class*="text-gray-600"]');
      let activeSection = "padding"; // default

      const clickedButton = document.activeElement;
      if (clickedButton) {
        let currentElement = clickedButton;
        while (currentElement) {
          let prevSibling = currentElement.previousElementSibling;
          while (prevSibling) {
            const text = prevSibling.textContent.toLowerCase();
            if (text === "padding" || text === "margin" || text === "gap") {
              activeSection = text;
              break;
            }
            prevSibling = prevSibling.previousElementSibling;
          }
          if (activeSection !== "padding") break;
          currentElement = currentElement.parentElement;
        }
      }
      console.log("Active section:", activeSection);
      return activeSection;
    };

    // Handle preset sizes first (small, medium, large)
    const presetMatch = input.match(/^(small|medium|large)$/i);
    if (presetMatch) {
      const activeSection = getActiveSection();
      const presetValue = presetSizes[presetMatch[1].toLowerCase()];
      console.log(
        `Applying ${presetMatch[1]} preset (${presetValue}) to ${activeSection}`
      );

      return {
        style: {
          [activeSection]: presetValue,
        },
        message: `Set ${activeSection} to ${presetMatch[1].toLowerCase()}`,
        property: activeSection,
        success: true,
        type: "COMMAND_EXECUTED",
        content: `Set ${activeSection} to ${presetMatch[1].toLowerCase()}`,
      };
    }

    // Handle add/remove 5px commands
    if (input.match(/^add\s*5px$/i)) {
      const activeSection = getActiveSection();
      console.log(`Adding 5px to ${activeSection}`);
      return {
        adjust: (currentStyle) => {
          const currentValue = currentStyle[activeSection] || "0px";
          const newValue = adjustSpacing(currentValue, 5);
          console.log(
            `Adjusting ${activeSection} from ${currentValue} to ${newValue}`
          );
          return {
            style: {
              [activeSection]: newValue,
            },
            message: `Updated ${activeSection} by adding 5px`,
            property: activeSection,
            success: true,
            type: "COMMAND_EXECUTED",
            content: `Updated ${activeSection} by adding 5px`,
          };
        },
      };
    }

    if (input.match(/^remove\s*5px$/i)) {
      const activeSection = getActiveSection();
      console.log(`Removing 5px from ${activeSection}`);
      return {
        adjust: (currentStyle) => {
          const currentValue = currentStyle[activeSection] || "0px";
          const newValue = adjustSpacing(currentValue, -5);
          console.log(
            `Adjusting ${activeSection} from ${currentValue} to ${newValue}`
          );
          return {
            style: {
              [activeSection]: newValue,
            },
            message: `Updated ${activeSection} by removing 5px`,
            property: activeSection,
            success: true,
            type: "COMMAND_EXECUTED",
            content: `Updated ${activeSection} by removing 5px`,
          };
        },
      };
    }

    // Process other patterns
    for (const [property, patterns] of Object.entries(
      this.getStylePatterns()
    )) {
      for (const pattern of patterns) {
        const match = input.match(pattern);

        if (match) {
          let value = match[1]?.toLowerCase();

          // Add 'px' if no unit is specified
          if (value && !value.match(/\d+(?:px|em|rem|%|vw|vh)?$/)) {
            value += "px";
          }

          if (value) {
            console.log(`Matched pattern for ${property}:`, value);
            return {
              style: {
                [property]: value,
              },
            };
          }
        }
      }
    }

    console.log("SpacingProcessor result:", null);
    return null;
  }

  static getSuggestions(headerClass, buttonClass) {
    return {
      text: "Spacing",
      type: "category",
      icon: FaArrowsAlt,
      options: [
        {
          text: "Padding",
          type: "info",
          icon: FaExpandAlt,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-col gap-1",
          options: [
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "small",
                  type: "command",
                  icon: FaExpand,
                  className: buttonClass,
                },
                {
                  text: "medium",
                  type: "command",
                  icon: FaExpand,
                  className: buttonClass,
                },
                {
                  text: "large",
                  type: "command",
                  icon: FaExpand,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "add 5px",
                  type: "command",
                  icon: FaPlus,
                  className: buttonClass,
                },
                {
                  text: "remove 5px",
                  type: "command",
                  icon: FaTimes,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
        {
          text: "Margin",
          type: "info",
          icon: FaArrowsAlt,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-col gap-1",
          options: [
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "small",
                  type: "command",
                  icon: FaArrowsAlt,
                  className: buttonClass,
                },
                {
                  text: "medium",
                  type: "command",
                  icon: FaArrowsAlt,
                  className: buttonClass,
                },
                {
                  text: "large",
                  type: "command",
                  icon: FaArrowsAlt,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "add 5px",
                  type: "command",
                  icon: FaPlus,
                  className: buttonClass,
                },
                {
                  text: "remove 5px",
                  type: "command",
                  icon: FaTimes,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
        {
          text: "Gap",
          type: "info",
          icon: FaGripLines,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-col gap-1",
          options: [
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "small",
                  type: "command",
                  icon: FaGripLines,
                  className: buttonClass,
                },
                {
                  text: "medium",
                  type: "command",
                  icon: FaGripLines,
                  className: buttonClass,
                },
                {
                  text: "large",
                  type: "command",
                  icon: FaGripLines,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "add 5px",
                  type: "command",
                  icon: FaPlus,
                  className: buttonClass,
                },
                {
                  text: "remove 5px",
                  type: "command",
                  icon: FaTimes,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
