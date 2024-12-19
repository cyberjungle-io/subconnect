import React from "react";
import { store } from "../../store/store";
import { FaArrowRight } from "react-icons/fa";

// Add isLightColor helper function
const isLightColor = (color) => {
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    return true; // Default to dark text for named colors
  }

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export class ButtonProcessor {
  static colorKeywords = {
    // Common color aliases
    transparent: "transparent",
    clear: "transparent",
    invisible: "transparent",
    navy: "#000080",
    sky: "#87CEEB",
    forest: "#228B22",
    crimson: "#DC143C",
    gold: "#FFD700",
    silver: "#C0C0C0",
    // Basic colors
    blue: "#0000ff",
    "light blue": "#add8e6",
    "dark blue": "#00008b",
    green: "#008000",
    "light green": "#90ee90",
    "dark green": "#006400",
    red: "#ff0000",
    "light red": "#ffcccb",
    "dark red": "#8b0000",
    yellow: "#ffff00",
    purple: "#800080",
    black: "#000000",
    white: "#ffffff",
    gray: "#808080",
    grey: "#808080",
  };

  static getStylePatterns() {
    return {
      // Page Navigation Section
      enablePageNavigation: [
        // Enable patterns
        /^enable\s*(?:page)?\s*navigation$/i,
        /turn\s*on\s*(?:page)?\s*navigation/i,
        /make\s*(?:it|this|the container)?\s*(?:a)?\s*(?:page)?\s*(?:link|navigation)/i,
        /add\s*(?:page)?\s*navigation/i,
        // Disable patterns
        /^disable\s*(?:page)?\s*navigation$/i,
        /turn\s*off\s*(?:page)?\s*navigation/i,
        /remove\s*(?:page)?\s*navigation/i,
      ],

      targetPageId: [
        // Keep existing targetPageId patterns...
      ],

      // Hover Effects Section
      hoverBackgroundColor: [
        // Color changes
        /(?:set|change|make)\s*(?:the)?\s*hover\s*(?:background)?\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        /when\s*(?:I|user)?\s*hover\s*(?:make|set|change)?\s*(?:the)?\s*(?:background)?\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        // Natural language
        /(?:i want|please make)?\s*(?:it|the container)?\s*(?:turn|change to|become)\s*(#[0-9a-fA-F]{3,6}|[a-z]+)\s*(?:when|on)?\s*hover/i,
      ],

      hoverColor: [
        // Text color changes
        /(?:set|change|make)\s*(?:the)?\s*hover\s*text\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        /when\s*hovering\s*(?:change|make|set)?\s*(?:the)?\s*text\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        // Natural language
        /(?:i want|please make)?\s*(?:the)?\s*text\s*(?:turn|change to|become)\s*(#[0-9a-fA-F]{3,6}|[a-z]+)\s*(?:when|on)?\s*hover/i,
      ],

      hoverScale: [
        // Direct scale settings
        /(?:set|change|make)\s*(?:the)?\s*hover\s*scale\s*(?:to|=|:)?\s*(0?\.[0-9]+|1\.?[0-9]*)/i,
        // Natural language - specific values
        /(?:make|set)?\s*(?:it|the container)?\s*(?:scale|grow|shrink)\s*to\s*(0?\.[0-9]+|1\.?[0-9]*)\s*(?:when|on)?\s*hover/i,
        // Natural language - relative
        /(?:make|set)?\s*(?:it|the container)?\s*(bigger|larger|smaller|tiny|huge)\s*(?:when|on)?\s*hover/i,
      ],

      cursor: [
        // Direct cursor settings
        /(?:set|change|make)\s*(?:the)?\s*cursor\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        // Natural language
        /(?:make|set)?\s*(?:the)?\s*mouse\s*(?:cursor|pointer)\s*(?:look like|change to|become)\s*(?:a|an)?\s*(pointer|hand|arrow|grabber|text cursor|copy symbol)/i,
        /(?:show|display)\s*(?:a|an)?\s*(pointer|hand|arrow|grabber|text cursor|copy symbol)\s*(?:cursor|mouse)/i,
      ],

      transitionDuration: [
        // Direct duration settings
        /(?:set|change|make)\s*(?:the)?\s*(?:hover)?\s*transition\s*(?:duration|speed|time)\s*(?:to|=|:)?\s*(\d+)(?:\s*ms)?/i,
        // Natural language
        /(?:make|set)?\s*(?:the)?\s*hover\s*(?:effect|animation|transition)\s*(faster|slower|quick|slow|instant|smooth)/i,
        /(?:make|set)?\s*(?:the)?\s*hover\s*(?:effect|animation|transition)\s*(?:take|last)\s*(\d+)(?:\s*ms)?/i,
      ],

      // Add patterns for removing effects
      removeEffects: [
        /remove\s*(?:all)?\s*(?:hover|click)?\s*effects?/i,
        /disable\s*(?:all)?\s*(?:hover|click)?\s*effects?/i,
        /turn\s*off\s*(?:all)?\s*(?:hover|click)?\s*effects?/i,
      ],

      // Add specific patterns for page navigation
      pageNavigation: [
        /^enable\s*(?:page)?\s*navigation$/i,
        /^disable\s*(?:page)?\s*navigation$/i,
        /^change\s*(?:the)?\s*target\s*page$/i,
        /^set\s*target\s*page\s*to\s*([a-zA-Z0-9]+)$/i,
      ],
    };
  }

  static processCommand(input, currentStyle = {}) {
    // Log incoming command and state
    console.log("ButtonProcessor received input:", input);
    const state = store.getState();

    // Get current page ID from editor state
    const currentPageId = state.editor.currentPage?._id;

    console.log("Current page ID:", currentPageId);

    // Log more detailed state information
    console.log("Current Redux State:", {
      currentPageId,
      pages: state.w3s.currentProject?.data?.pages?.map((p) => ({
        id: p._id,
        name: p.name,
      })),
      currentProject: state.w3s.currentProject.data,
      currentPage: state.editor.currentPage
    });

    // Handle page navigation commands
    const enableNavigationPattern = /^enable\s*(?:page)?\s*navigation$/i;
    const disableNavigationPattern = /^disable\s*(?:page)?\s*navigation$/i;
    const changeTargetPagePattern = /^change\s*(?:the)?\s*target\s*page$/i;
    const setTargetPagePattern = /^set\s*target\s*page\s*to\s*([a-zA-Z0-9]+)$/i;

    // Get current project from Redux store
    const currentProject = state.w3s.currentProject.data;

    if (enableNavigationPattern.test(input)) {
      // If there are no pages, just enable navigation
      if (!currentProject?.pages?.length) {
        console.log("No pages found in project");
        return {
          style: {
            enablePageNavigation: true,
          },
          message: "Enabled page navigation",
          success: true,
        };
      }

      // Filter out the current page from options
      const availablePages = currentProject.pages.filter(page => {
        const isCurrentPage = page._id === currentPageId;
        console.log("Filtering page:", {
          pageId: page._id,
          pageName: page.name,
          currentPageId: currentPageId,
          isCurrentPage
        });
        return !isCurrentPage;
      });

      console.log("Available pages for navigation:", availablePages);

      if (availablePages.length === 0) {
        return {
          style: {
            enablePageNavigation: true,
          },
          message: "No other pages available for navigation",
          success: true,
        };
      }

      // Return the page selection prompt with filtered pages
      return {
        type: "PROMPT",
        message: "Select a target page:",
        context: "navigation",
        options: [
          {
            text: "Available Pages",
            type: "info",
            className: "text-xs font-semibold text-gray-600",
          },
          ...availablePages.map((page) => ({
            text: page.name,
            type: "command",
            command: `set target page to ${page._id}`,
            icon: FaArrowRight,
            className: "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          })),
        ],
        style: {
          enablePageNavigation: true,
        },
      };
    }

    if (disableNavigationPattern.test(input)) {
      return {
        style: {
          enablePageNavigation: false,
          targetPageId: "",
        },
        message: "Disabled page navigation",
        success: true,
      };
    }

    if (changeTargetPagePattern.test(input)) {
      console.log("Processing change target page command");

      if (!currentProject?.pages?.length) {
        console.log("No pages found in project");
        return {
          success: false,
          message: "No pages available in the current project",
        };
      }

      // Filter out the current page from options
      const availablePages = currentProject.pages.filter(page => {
        const isCurrentPage = page._id === currentPageId;
        console.log("Checking page for target change:", {
          pageId: page._id,
          pageName: page.name,
          currentPageId: currentPageId,
          isCurrentPage
        });
        return !isCurrentPage;
      });

      console.log("Available pages for target change:", availablePages);

      if (availablePages.length === 0) {
        return {
          success: false,
          message: "No other pages available for navigation",
        };
      }

      return {
        type: "PROMPT",
        message: "Select a target page:",
        context: "navigation",
        options: [
          {
            text: "Available Pages",
            type: "info",
            className: "text-xs font-semibold text-gray-600",
          },
          ...availablePages.map((page) => ({
            text: page.name,
            type: "command",
            command: `set target page to ${page._id}`,
            icon: FaArrowRight,
            className: "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          })),
        ],
      };
    }

    const targetPageMatch = input.match(setTargetPagePattern);
    if (targetPageMatch) {
      const pageId = targetPageMatch[1];
      return {
        style: {
          targetPageId: pageId,
          enablePageNavigation: true,
        },
        message: `Updated target page`,
        success: true,
      };
    }

    // Handle hover background color setting
    const hoverColorPattern =
      /(?:change|set|show|modify|update|pick|choose|select)\s+(?:the\s+)?hover\s+(?:background\s+)?color/i;
    const directHoverColorPattern =
      /set\s+hover\s+(?:background\s+)?color\s+to\s+(.+)/i;

    const hoverColorMatch = input.match(hoverColorPattern);
    const directHoverColorMatch = input.match(directHoverColorPattern);

    if (directHoverColorMatch) {
      const color = directHoverColorMatch[1].trim();
      return {
        style: {
          hoverBackgroundColor: color,
          // Add transition if not present
          transition: currentStyle.transition || "all 200ms ease-in-out",
        },
        message: `Set hover color to ${color}`,
        success: true,
      };
    }

    if (hoverColorMatch) {
      return {
        type: "PROMPT",
        message: "Choose a hover background color:",
        context: "hover",
        options: [
          {
            text: "Enter color below or select from theme",
            type: "info",
            className: "text-xs text-gray-600",
          },
          {
            text: "#FF0000, rgb(255,0,0), hsl(0,100%,50%)",
            type: "info",
            className: "text-[11px] text-gray-400 italic mb-2",
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-1",
            options: (state) => {
              const colorTheme = state?.colorTheme || [];

              // Create array of theme colors
              const themeButtons =
                colorTheme.length === 0
                  ? [
                      {
                        text: "black",
                        command: "set hover background color to black",
                        type: "command",
                        style: {
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          minWidth: "60px",
                          textAlign: "center",
                        },
                      },
                      {
                        text: "gray",
                        command: "set hover background color to gray",
                        type: "command",
                        style: {
                          backgroundColor: "#808080",
                          color: "#ffffff",
                          minWidth: "60px",
                          textAlign: "center",
                        },
                      },
                      {
                        text: "blue",
                        command: "set hover background color to blue",
                        type: "command",
                        style: {
                          backgroundColor: "#0000ff",
                          color: "#ffffff",
                          minWidth: "60px",
                          textAlign: "center",
                        },
                      },
                    ]
                  : colorTheme.map((color) => ({
                      text: color.name,
                      command: `set hover background color to ${color.value}`,
                      type: "command",
                      style: {
                        backgroundColor: color.value,
                        color: isLightColor(color.value)
                          ? "#000000"
                          : "#ffffff",
                        minWidth: "60px",
                        textAlign: "center",
                      },
                    }));

              return [
                {
                  text: "Theme Colors",
                  type: "info",
                },
                {
                  type: "wrapper",
                  className: "flex flex-wrap gap-1",
                  options: themeButtons,
                },
              ];
            },
          },
        ],
        property: "hoverBackgroundColor",
        followUp: {
          type: "COLOR_CHANGE",
          command: (color) => `set hover background color to ${color}`,
        },
      };
    }

    // Navigation pattern matching
    const navigationPattern =
      /(?:enable|disable|toggle|add|remove)\s+(?:page\s+)?navigation/i;
    const navigationMatch = input.match(navigationPattern);

    if (navigationMatch) {
      const isDisabling = input.toLowerCase().includes("disable");
      return {
        style: {
          enablePageNavigation: !isDisabling,
          targetPageId: !isDisabling ? currentStyle.targetPageId || "" : "",
        },
      };
    }

    return null;
  }

  // Add this static method to help identify button-related commands
  static canHandle(input) {
    const buttonPatterns = [
      /hover\s+(?:background\s+)?color/i,
      /(?:page\s+)?navigation/i,
      /cursor/i,
      /transition/i,
      /change\s+(?:the\s+)?target\s+page/i,
      /set\s+target\s+page\s+to/i,
    ];

    return buttonPatterns.some((pattern) => pattern.test(input));
  }

  static getPropertyNames() {
    return {
      hoverBackgroundColor: "hover background color",
      hoverColor: "hover text color",
      hoverScale: "hover scale",
      cursor: "cursor style",
      transitionDuration: "transition duration",
      enablePageNavigation: "page navigation",
      targetPageId: "target page",
    };
  }
}
