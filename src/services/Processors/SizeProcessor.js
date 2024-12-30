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
      ],
    };
  }

  static processCommand(input, context) {
    console.log("SizeProcessor received input:", input);
    console.log("Current style:", context);

    // Extract style from context correctly
    const currentStyle = context?.style || {};

    // Helper function to format values
    const formatValue = (value) => {
      if (!value) return null;
      // If it's just a number, add px
      if (value.match(/^\d+$/)) return `${value}px`;
      // If it already has units or is a special value, return as is
      if (
        value.match(/^(\d+)(px|%|em|rem|vh|vw)$/) ||
        value === "auto" ||
        value === "fit-content"
      ) {
        return value;
      }
      return null;
    };

    // Handle make bigger/smaller commands
    const sizeChangePattern =
      /(?:make|set)\s*(?:it|this)?\s*(bigger|larger|smaller)/i;
    const sizeMatch = input.match(sizeChangePattern);

    if (sizeMatch) {
      const isBigger = sizeMatch[1].match(/bigger|larger/i);
      const changes = {};

      // Helper function to calculate new size
      const calculateNewSize = (
        currentValue,
        unit,
        isIncrease,
        dimension = "width"
      ) => {
        // Handle percentage values
        if (unit === "%") {
          const increment = dimension === "width" ? 10 : 5; // Smaller increment for height
          const newValue = isIncrease
            ? Math.min(currentValue + increment, 100)
            : Math.max(currentValue - increment, 10);
          return {
            [dimension]: `${newValue}%`,
            [`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
              "0",
            [`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
              dimension === "width" ? "100%" : "none",
          };
        }
        // Handle pixel values
        else if (unit === "px") {
          const baseIncrement = Math.max(Math.floor(currentValue * 0.1), 20); // 10% of current size or minimum 20px
          const newValue = isIncrease
            ? currentValue + baseIncrement
            : Math.max(currentValue - baseIncrement, 50);
          return {
            [dimension]: `${newValue}px`,
            [`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
              "0",
            [`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
              "none",
          };
        }
        // Handle fit-content or auto
        else if (currentValue === "fit-content" || currentValue === "auto") {
          return {
            [dimension]: isIncrease ? "100%" : "75%",
            [`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
              "0",
            [`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
              "100%",
          };
        }
        // Default fallback - use percentages for width, pixels for height
        return {
          [dimension]:
            dimension === "width"
              ? isIncrease
                ? "100%"
                : "75%"
              : isIncrease
              ? "300px"
              : "200px",
          [`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]: "0",
          [`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]:
            dimension === "width" ? "100%" : "none",
        };
      };

      // Process width
      if (currentStyle.width) {
        const widthMatch = currentStyle.width.match(/^([\d.]+)([%px]+|auto)$/);
        if (widthMatch) {
          const [_, value, unit] = widthMatch;
          const currentValue = parseFloat(value);
          const newSize = calculateNewSize(
            currentValue,
            unit,
            isBigger,
            "width"
          );
          Object.assign(changes, newSize);
        } else if (
          currentStyle.width === "fit-content" ||
          currentStyle.width === "auto"
        ) {
          const newSize = calculateNewSize(
            currentStyle.width,
            null,
            isBigger,
            "width"
          );
          Object.assign(changes, newSize);
        }
      } else {
        // Default width behavior if no width is set
        Object.assign(changes, calculateNewSize(100, "%", isBigger, "width"));
      }

      // Process height
      if (currentStyle.height) {
        const heightMatch = currentStyle.height.match(
          /^([\d.]+)([%px]+|auto)$/
        );
        if (heightMatch) {
          const [_, value, unit] = heightMatch;
          const currentValue = parseFloat(value);
          const newSize = calculateNewSize(
            currentValue,
            unit,
            isBigger,
            "height"
          );
          Object.assign(changes, newSize);
        } else if (
          currentStyle.height === "fit-content" ||
          currentStyle.height === "auto"
        ) {
          const newSize = calculateNewSize(
            currentStyle.height,
            null,
            isBigger,
            "height"
          );
          Object.assign(changes, newSize);
        }
      } else {
        // Default height behavior if no height is set
        Object.assign(changes, calculateNewSize(200, "px", isBigger, "height"));
      }

      if (Object.keys(changes).length > 0) {
        return {
          style: changes,
          message: `${isBigger ? "Increased" : "Decreased"} size`,
          type: "COMMAND_EXECUTED",
          property: "size",
        };
      }
    }

    // Handle fit content commands
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
              minWidth: "auto",
              maxWidth: "100%",
              minHeight: "0",
              maxHeight: "none",
            },
            message: "Set size to fit content",
            property: "size",
          };
        case "vertical":
          return {
            style: {
              height: "fit-content",
              minHeight: "0",
              maxHeight: "none",
            },
            message: "Set height to fit content",
            property: "height",
          };
        case "horizontal":
          return {
            style: {
              width: "fit-content",
              minWidth: "auto",
              maxWidth: "100%",
            },
            message: "Set width to fit content",
            property: "width",
          };
      }
    }

    // Handle width commands with comprehensive pattern
    const widthPattern =
      /(?:set|make|change)?\s*(?:the)?\s*width\s*(?:to|=|:)?\s*(\d+(?:px|%)?|fit-content|auto)\s*$/i;
    const widthMatch = input.match(widthPattern);
    if (widthMatch) {
      const value = widthMatch[1];
      // Add % if it's just a number and less than or equal to 100
      const formattedValue =
        value.match(/^\d+$/) && parseInt(value) <= 100
          ? `${value}%`
          : formatValue(value);

      if (formattedValue) {
        console.log("Setting width to:", formattedValue);
        return {
          style: {
            width: formattedValue,
            minWidth:
              formattedValue === "fit-content" || formattedValue === "auto"
                ? "auto"
                : "0",
            maxWidth: "100%",
          },
          message: `Set width to ${formattedValue}`,
          type: "COMMAND_EXECUTED",
          property: "width",
        };
      }
    }

    // Handle height commands with comprehensive pattern
    const heightPattern =
      /(?:set|make|change)?\s*(?:the)?\s*height\s*(?:to|=|:)?\s*(\d+(?:px|%)?|fit-content|auto)\s*$/i;
    const heightMatch = input.match(heightPattern);
    if (heightMatch) {
      const value = heightMatch[1];
      const formattedValue = formatValue(value);

      if (formattedValue) {
        console.log("Setting height to:", formattedValue);
        return {
          style: {
            height: formattedValue,
            minHeight:
              formattedValue === "fit-content" || formattedValue === "auto"
                ? "auto"
                : "0",
            maxHeight:
              formattedValue === "fit-content" || formattedValue === "auto"
                ? "none"
                : "100%",
          },
          message: `Set height to ${formattedValue}`,
          type: "COMMAND_EXECUTED",
          property: "height",
        };
      }
    }

    return null;
  }
}
