import { textProcessor } from "./textProcessor";

const TEXT_COMMANDS = {
  STYLE: ["style", "format", "make", "set"],
  FONT: ["font", "typeface", "text"],
  SIZE: ["size", "bigger", "smaller", "larger"],
  WEIGHT: ["weight", "bold", "thin", "light", "heavy"],
  ALIGN: ["align", "centered", "left", "right"],
  SPACING: ["spacing", "kerning", "leading"],
  SHADOW: ["shadow", "depth", "effect"],
  TRANSFORM: ["transform", "case", "uppercase", "lowercase"],
};

export const handleTextPrompt = async (prompt, currentStyle = {}) => {
  const words = prompt.toLowerCase().split(" ");
  const updates = {};
  const errors = [];

  // Helper function to check if word matches any command type
  const getCommandType = (word) => {
    return Object.entries(TEXT_COMMANDS).find(([_, keywords]) =>
      keywords.includes(word)
    )?.[0];
  };

  try {
    // Process each word in the prompt
    for (let i = 0; i < words.length; i++) {
      const commandType = getCommandType(words[i]);

      if (commandType) {
        switch (commandType) {
          case "STYLE":
            // Handle general style commands
            if (words[i + 1] === "like" || words[i + 1] === "as") {
              // Process style template
              const template = words[i + 2];
              const templateResult = textProcessor.processTextStyle(template);
              if (templateResult.isValid) {
                Object.assign(updates, templateResult.value);
              }
            }
            break;

          case "FONT":
            // Handle font family changes
            if (words[i + 1]) {
              const fontResult = textProcessor.processFontFamily(words[i + 1]);
              if (fontResult.isValid) {
                updates.fontFamily = fontResult.value;
              } else {
                errors.push(fontResult.message);
              }
            }
            break;

          case "SIZE":
            // Handle font size changes
            let size = words[i + 1];
            if (size) {
              const sizeResult = textProcessor.processFontSize(size);
              if (sizeResult.isValid) {
                updates.fontSize = sizeResult.value;
              } else {
                errors.push(sizeResult.message);
              }
            }
            break;

          // Add more cases for other command types...
        }
      }
    }

    // Return processed updates and any errors
    return {
      success: errors.length === 0,
      updates: updates,
      errors: errors,
      message:
        errors.length === 0
          ? "Successfully processed text style updates"
          : "Some errors occurred while processing text style updates",
    };
  } catch (error) {
    return {
      success: false,
      errors: ["Failed to process text prompt: " + error.message],
      message: "Error processing text prompt",
    };
  }
};
