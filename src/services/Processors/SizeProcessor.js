import {
  FaExpand,
  FaCompress,
  FaArrowsAltV,
  FaArrowsAltH,
  FaExpandAlt,
  FaCompressAlt,
} from "react-icons/fa";

export class SizeProcessor {
  static getStylePatterns() {
    const units = "(?:px|em|rem|%|vw|vh)";
    const number = "\\d+(?:\\.\\d+)?";

    return {
      width: [
        // Basic patterns
        new RegExp(
          `(?:set|make|change)?\\s*(?:the)?\\s*width\\s*(?:to|=|:)?\\s*(${number}${units})`,
          "i"
        ),
        // Percentage shortcuts
        /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to|=|:)?\s*(25|50|75|100)\s*(?:percent|%)/i,
        // Auto width
        /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to)?\s*auto/i,
        /automatic\s*width/i,
      ],
      height: [
        // Basic patterns
        new RegExp(
          `(?:set|make|change)?\\s*(?:the)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`,
          "i"
        ),
        // Percentage shortcuts
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*(25|50|75|100)\s*(?:percent|%)/i,
        // Auto height - add more variations
        /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to)?\s*auto/i,
        /automatic\s*height/i,
        /make\s*(?:the)?\s*height\s*automatic/i,
        /set\s*(?:to)?\s*auto(?:matic)?\s*height/i,
      ],
      // Min/Max patterns
      minWidth: [
        new RegExp(
          `(?:set|make|change)?\\s*(?:the)?\\s*min(?:imum)?\\s*width\\s*(?:to|=|:)?\\s*(${number}${units})`,
          "i"
        ),
      ],
      maxWidth: [
        new RegExp(
          `(?:set|make|change)?\\s*(?:the)?\\s*max(?:imum)?\\s*width\\s*(?:to|=|:)?\\s*(${number}${units})`,
          "i"
        ),
      ],
      minHeight: [
        new RegExp(
          `(?:set|make|change)?\\s*(?:the)?\\s*min(?:imum)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`,
          "i"
        ),
      ],
      maxHeight: [
        new RegExp(
          `(?:set|make|change)?\\s*(?:the)?\\s*max(?:imum)?\\s*height\\s*(?:to|=|:)?\\s*(${number}${units})`,
          "i"
        ),
      ],
      // Combined width and height patterns for presets
      presets: [
        /(?:make|create|set)?\s*(?:it|this)?\s*(?:a)?\s*square/i,
        /(?:make|create|set)?\s*(?:it|this)?\s*(?:a)?\s*banner/i,
      ],
      // Fit options
      fit: [
        /fit\s*(?:to)?\s*vertical(?:ly)?/i,
        /fit\s*(?:to)?\s*horizontal(?:ly)?/i,
        /fit\s*(?:to)?\s*content/i,
      ],
    };
  }

  static getPropertyNames() {
    return {
      width: "width",
      height: "height",
      minWidth: "minimum width",
      maxWidth: "maximum width",
      minHeight: "minimum height",
      maxHeight: "maximum height",
    };
  }

  static getSuggestions(headerClass, buttonClass) {
    return {
      text: "Size",
      type: "category",
      icon: FaExpand,
      options: [
        {
          text: "Width",
          type: "info",
          icon: FaArrowsAltH,
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
                  text: "25%",
                  command: "set width to 25%",
                  type: "command",
                  icon: FaArrowsAltH,
                  className: buttonClass,
                },
                {
                  text: "50%",
                  command: "set width to 50%",
                  type: "command",
                  icon: FaArrowsAltH,
                  className: buttonClass,
                },
                {
                  text: "100%",
                  command: "set width to 100%",
                  type: "command",
                  icon: FaArrowsAltH,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "200px",
                  command: "set width to 200px",
                  type: "command",
                  icon: FaArrowsAltH,
                  className: buttonClass,
                },
                {
                  text: "300px",
                  command: "set width to 300px",
                  type: "command",
                  icon: FaArrowsAltH,
                  className: buttonClass,
                },
                {
                  text: "fit-content",
                  command: "set width to fit-content",
                  type: "command",
                  icon: FaCompress,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
        {
          text: "Height",
          type: "info",
          icon: FaArrowsAltV,
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
                  text: "auto",
                  command: "set height to auto",
                  type: "command",
                  icon: FaArrowsAltV,
                  className: buttonClass,
                },
                {
                  text: "100%",
                  command: "set height to 100%",
                  type: "command",
                  icon: FaArrowsAltV,
                  className: buttonClass,
                },
                {
                  text: "fit-content",
                  command: "set height to fit-content",
                  type: "command",
                  icon: FaCompress,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "200px",
                  command: "set height to 200px",
                  type: "command",
                  icon: FaArrowsAltV,
                  className: buttonClass,
                },
                {
                  text: "300px",
                  command: "set height to 300px",
                  type: "command",
                  icon: FaArrowsAltV,
                  className: buttonClass,
                },
                {
                  text: "400px",
                  command: "set height to 400px",
                  type: "command",
                  icon: FaArrowsAltV,
                  className: buttonClass,
                },
              ],
            },
          ],
        },
        {
          text: "Quick Adjust",
          type: "info",
          icon: FaExpandAlt,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex gap-1",
          options: [
            {
              text: "bigger",
              command: "make it bigger",
              type: "command",
              icon: FaExpandAlt,
              className: buttonClass,
            },
            {
              text: "smaller",
              command: "make it smaller",
              type: "command",
              icon: FaCompressAlt,
              className: buttonClass,
            },
            {
              text: "fit to content",
              command: "fit to content",
              type: "command",
              icon: FaCompress,
              className: buttonClass,
            },
          ],
        },
      ],
    };
  }

  static processCommand(input, currentStyle = {}) {
    console.log("SizeProcessor received input:", input);
    console.log("Current style:", currentStyle);

    // Add value formatter helper
    const formatValue = (value) => {
      if (!value) return null;
      if (value === "auto" || value === "fit-content") return value;
      // If it's just a number or has % already, handle appropriately
      if (/^\d+%$/.test(value)) return value;
      if (/^\d+$/.test(value)) return `${value}%`;
      // Handle px values
      if (/^\d+px$/.test(value)) return value;
      return value;
    };

    // Handle percentage width commands first (most common for flex containers)
    const percentagePattern =
      /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to|=|:)?\s*(\d+)(?:\s*%|\s*percent)?\s*$/i;
    const percentageMatch = input.match(percentagePattern);
    if (percentageMatch) {
      const value = `${percentageMatch[1]}%`;
      console.log("Setting percentage width to:", value);
      return {
        style: {
          width: value,
        },
        message: `Set width to ${value}`,
        property: "width",
      };
    }

    // Handle fit commands
    const fitPattern = /fit\s*(?:to)?\s*(content|vertical|horizontal)/i;
    const fitMatch = input.match(fitPattern);

    if (fitMatch) {
      const fitType = fitMatch[1].toLowerCase();
      console.log("Matched fit pattern:", fitType);

      switch (fitType) {
        case "content":
          return {
            style: {
              width: "fit-content",
              height: "fit-content",
            },
            message: "Set size to fit content",
          };
        case "vertical":
          return {
            style: {
              height: "fit-content",
            },
            message: "Set height to fit content",
          };
        case "horizontal":
          return {
            style: {
              width: "fit-content",
            },
            message: "Set width to fit content",
          };
      }
    }

    // Handle other width commands
    const widthPattern =
      /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to|=|:)?\s*(\d+(?:px)|fit-content|auto)\s*$/i;
    const widthMatch = input.match(widthPattern);
    if (widthMatch) {
      const value = formatValue(widthMatch[1]);
      if (value) {
        console.log("Setting width to:", value);
        return {
          style: {
            width: value,
          },
          message: `Set width to ${value}`,
          property: "width",
        };
      }
    }

    // Handle height commands
    const heightPattern =
      /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*(\d+(?:px|%)?|fit-content|auto)\s*$/i;
    const heightMatch = input.match(heightPattern);
    if (heightMatch) {
      const value = formatValue(heightMatch[1]);
      if (value) {
        console.log("Setting height to:", value);
        return {
          style: {
            height: value,
          },
          message: `Set height to ${value}`,
          property: "height",
        };
      }
    }

    // Handle make bigger/smaller commands
    const sizeChangePattern =
      /(?:make|set)\s*(?:it|this)?\s*(bigger|larger|smaller)/i;
    const sizeMatch = input.match(sizeChangePattern);

    if (sizeMatch) {
      const isBigger = sizeMatch[1].match(/bigger|larger/i);
      const changes = {};

      // Helper function to calculate new size
      const calculateNewSize = (currentValue, unit, isIncrease) => {
        if (unit === "%") {
          const increment = 10;
          const newValue = isIncrease
            ? currentValue + increment
            : currentValue - increment;
          return `${Math.min(Math.max(newValue, 10), 100)}%`;
        } else if (unit === "px") {
          const increment = 50;
          const newValue = isIncrease
            ? currentValue + increment
            : currentValue - increment;
          return `${Math.max(newValue, 50)}px`;
        }
        return null;
      };

      // Process width
      if (currentStyle.width) {
        const widthMatch = currentStyle.width.match(/^([\d.]+)([%px]+|auto)$/);
        if (widthMatch) {
          const [_, value, unit] = widthMatch;
          const currentValue = parseFloat(value);
          const newSize = calculateNewSize(currentValue, unit, isBigger);
          if (newSize) changes.width = newSize;
        }
      }

      // Process height
      if (currentStyle.height) {
        const heightMatch = currentStyle.height.match(
          /^([\d.]+)([%px]+|auto)$/
        );
        if (heightMatch) {
          const [_, value, unit] = heightMatch;
          const currentValue = parseFloat(value);
          const newSize = calculateNewSize(currentValue, unit, isBigger);
          if (newSize) changes.height = newSize;
        }
      }

      if (Object.keys(changes).length > 0) {
        return {
          style: changes,
          message: `Made component ${isBigger ? "bigger" : "smaller"}`,
        };
      }
    }

    return null;
  }
}
