import {
  FaExpand,
  FaCompress,
  FaArrowsAltV,
  FaArrowsAltH,
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

  static processCommand(input, currentStyle = {}) {
    console.log("SizeProcessor received input:", input);
    console.log("Current style:", currentStyle);

    // Helper function to format values
    const formatValue = (value) => {
      if (!value) return null;
      if (value.match(/^\d+$/)) return `${value}px`;
      return value;
    };

    // Handle fit content commands first
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
          property: "height",
        };
      }
    }

    return null;
  }
}
