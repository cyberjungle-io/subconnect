export class ImageProcessor {
  static imagePatterns = [
    /(?:zoom|scale)\s+(?:in|out|to)\s*(\d*\.?\d+)?/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:zoom|scale)\s+(?:level|to|by)?\s*(\d*\.?\d+)?/i,
    /(?:move|position|set)\s+(?:image)?\s*(?:to)?\s*(?:x|horizontal)?\s*(?:position)?\s*(?:to)?\s*(\d+)(?:\s*%)?/i,
    /(?:move|position|set)\s+(?:image)?\s*(?:to)?\s*(?:y|vertical)?\s*(?:position)?\s*(?:to)?\s*(\d+)(?:\s*%)?/i,
    /(?:set|change|update)\s+(?:the\s+)?(?:fit|object\s*fit)\s+(?:mode|to)?\s*(cover|contain|fill|none)/i,
    /(?:upload|set|change)\s+(?:the\s+)?(?:image|picture|photo)/i,
    /(?:paste|insert|add)\s+(?:new\s+)?svg/i,
    /(?:center|align)\s+(?:the\s+)?image/i
  ];

  static isImageCommand(input) {
    return this.imagePatterns.some(pattern => pattern.test(input.toLowerCase()));
  }

  static getSuggestions() {
    return [
      {
        text: "Image Zoom",
        type: "category",
        options: [
          { text: "zoom in", type: "command" },
          { text: "zoom out", type: "command" },
          { text: "set zoom to 1", type: "command" },
          { text: "reset zoom", type: "command" }
        ]
      },
      {
        text: "Position Control",
        type: "category",
        options: [
          { text: "center image", type: "command" },
          { text: "move x position to 50%", type: "command" },
          { text: "move y position to 50%", type: "command" }
        ]
      },
      {
        text: "Fit Mode",
        type: "category",
        options: [
          { text: "set fit mode to cover", type: "command" },
          { text: "set fit mode to contain", type: "command" },
          { text: "set fit mode to fill", type: "command" },
          { text: "set fit mode to none", type: "command" }
        ]
      },
      {
        text: "Image Source",
        type: "category",
        options: [
          { text: "upload new image", type: "command", action: "triggerUpload" },
          { text: "paste SVG code", type: "command" }
        ]
      }
    ];
  }

  static processCommand(input, currentProps = {}) {
    const lowercaseInput = input.toLowerCase();

    // Handle upload/SVG commands
    if (/(?:upload|set|change)\s+(?:the\s+)?(?:image|picture|photo)/i.test(lowercaseInput)) {
      // Find the existing file input in ImageControls
      const existingFileInput = document.querySelector(`input[type="file"][accept="image/*"][data-component-id="${currentProps.id}"]`);
      
      if (existingFileInput) {
        existingFileInput.click();
        return {
          message: "Please select an image file to upload",
          options: [
            { text: "You can select any image file from your device", type: "info" }
          ]
        };
      }
      
      return {
        message: "Please use the image controls panel to upload an image",
        options: [
          { text: "The upload functionality is available in the image controls panel", type: "info" }
        ]
      };
    }

    // Handle zoom/scale commands
    const zoomMatch = lowercaseInput.match(/(?:zoom|scale)\s+(?:in|out|to)\s*(\d*\.?\d+)?/i) ||
                     lowercaseInput.match(/(?:set|change|update)\s+(?:the\s+)?(?:zoom|scale)\s+(?:level|to|by)?\s*(\d*\.?\d+)?/i);
    
    if (zoomMatch) {
      let newScale = currentProps.scale || 1;
      if (zoomMatch[1]) {
        newScale = parseFloat(zoomMatch[1]);
      } else if (lowercaseInput.includes('in')) {
        newScale = Math.min(3, newScale + 0.1);
      } else if (lowercaseInput.includes('out')) {
        newScale = Math.max(0.1, newScale - 0.1);
      } else if (lowercaseInput.includes('reset')) {
        newScale = 1;
      }
      
      return {
        props: { scale: newScale },
        message: `Set image zoom to ${newScale.toFixed(1)}x`
      };
    }

    // Handle position commands
    const xPosMatch = lowercaseInput.match(/(?:move|position|set)\s+(?:image)?\s*(?:to)?\s*(?:x|horizontal)?\s*(?:position)?\s*(?:to)?\s*(\d+)(?:\s*%)?/i);
    const yPosMatch = lowercaseInput.match(/(?:move|position|set)\s+(?:image)?\s*(?:to)?\s*(?:y|vertical)?\s*(?:position)?\s*(?:to)?\s*(\d+)(?:\s*%)?/i);
    const centerMatch = /(?:center|align)\s+(?:the\s+)?image/i.test(lowercaseInput);

    if (xPosMatch || yPosMatch || centerMatch) {
      const updates = { ...currentProps };
      let message = [];

      if (centerMatch) {
        updates.objectPosition = '50% 50%';
        message.push('centered image');
      } else {
        if (xPosMatch) {
          const xPos = Math.min(100, Math.max(0, parseInt(xPosMatch[1])));
          const currentYPos = currentProps.objectPosition?.split(' ')[1] || '50%';
          updates.objectPosition = `${xPos}% ${currentYPos}`;
          message.push(`x position to ${xPos}%`);
        }
        if (yPosMatch) {
          const yPos = Math.min(100, Math.max(0, parseInt(yPosMatch[1])));
          const currentXPos = currentProps.objectPosition?.split(' ')[0] || '50%';
          updates.objectPosition = `${currentXPos} ${yPos}%`;
          message.push(`y position to ${yPos}%`);
        }
      }

      return {
        props: updates,
        message: `Set ${message.join(' and ')}`
      };
    }

    // Handle fit mode commands
    const fitMatch = lowercaseInput.match(/(?:set|change|update)\s+(?:the\s+)?(?:fit|object\s*fit)\s+(?:mode|to)?\s*(cover|contain|fill|none)/i);
    
    if (fitMatch) {
      const fitMode = fitMatch[1].toLowerCase();
      return {
        props: { objectFit: fitMode },
        message: `Set fit mode to ${fitMode}`
      };
    }

    // Handle paste/SVG commands
    if (/(?:paste|insert|add)\s+(?:new\s+)?svg/i.test(lowercaseInput)) {
      return {
        message: "Please paste your SVG code",
        needsInput: true,
        inputType: "svg",
        options: [
          { text: "Paste SVG code starting with <svg>", type: "info" }
        ]
      };
    }

    return null;
  }
} 