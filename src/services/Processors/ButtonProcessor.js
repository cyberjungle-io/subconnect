import React from "react";
import { store } from "../../store/store";
import {
  FaArrowRight,
  FaPalette,
  FaAdjust,
  FaMousePointer,
  FaHandPointer,
  FaICursor,
  FaArrowsAlt,
  FaTimes,
  FaClock,
  FaDatabase,
  FaBolt,
  FaGlobe,
  FaLock,
} from "react-icons/fa";

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

  static HTTP_METHODS = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "DELETE", label: "DELETE" },
    { value: "PATCH", label: "PATCH" },
  ];

  static AUTH_TYPES = [
    { value: "none", label: "None" },
    { value: "bearer", label: "Bearer Token" },
    { value: "api-key", label: "API Key" },
  ];

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
        // Direct hover text color settings
        /(?:set|change|make)\s*(?:the)?\s*hover\s*text\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        /when\s*hovering\s*(?:change|make|set)?\s*(?:the)?\s*text\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        // Natural language
        /(?:i want|please make)?\s*(?:the)?\s*text\s*(?:turn|change to|become)\s*(#[0-9a-fA-F]{3,6}|[a-z]+)\s*(?:when|on)?\s*hover/i,
        // Simple command
        /change\s*hover\s*text\s*color/i,
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
        /^set\s*(?:the\s+)?cursor\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        // Natural language variations
        /(?:make|change|update)\s*(?:the\s+)?(?:mouse\s+)?cursor\s*(?:to|into|as|like|become)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        // Shorthand commands
        /^cursor\s*(?::|=|to)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)$/i,
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
    // Get current state
    const state = store.getState();
    const currentProject = state.w3s?.currentProject?.data;
    const pages = currentProject?.pages || [];

    // Get current page ID from w3s state
    const currentPageId = state.w3s?.page?._id;

    console.log("W3S State:", state.w3s);
    console.log("Current page from state:", state.w3s?.page);

    // Handle enable/disable navigation
    const enableNavigationPattern = /^enable\s*(?:page)?\s*navigation$/i;
    const disableNavigationPattern = /^disable\s*(?:page)?\s*navigation$/i;
    const changeTargetPagePattern = /^change\s*(?:the)?\s*target\s*page$/i;
    const setTargetPagePattern =
      /^set\s*target\s*page\s*to\s*([a-zA-Z0-9_-]+)$/i;

    // Enable navigation command
    if (enableNavigationPattern.test(input)) {
      // Get current state
      const state = store.getState();
      const currentProject = state.w3s?.currentProject?.data;
      const currentPageId =
        state.w3s?.page?._id || state.editor?.currentPage?._id;

      console.log("Current project:", currentProject);
      console.log("Current page ID:", currentPageId);

      // Filter out current page and ensure we have valid pages
      const availablePages = (currentProject?.pages || []).filter((p) => {
        const isCurrentPage = p._id === currentPageId;
        console.log(
          "Checking page:",
          p.name,
          p._id,
          "Is current?",
          isCurrentPage
        );
        return !isCurrentPage; // Only include pages that aren't the current page
      });

      console.log(
        "Filtered available pages:",
        availablePages.map((p) => p.name)
      );

      // Return prompt with page options if pages exist
      if (availablePages.length > 0) {
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
              text: page.name || `Page ${page._id}`,
              type: "command",
              command: `set target page to ${page._id}`,
              icon: FaArrowRight,
              className:
                "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
            })),
          ],
        };
      }

      // Just enable navigation if no other pages available
      return {
        style: {
          enablePageNavigation: true,
        },
        message: "Enabled page navigation, but no other pages available",
        success: true,
      };
    }

    // Disable navigation command
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

    // Change target page command
    if (changeTargetPagePattern.test(input)) {
      // Use same strict filtering here too
      const availablePages = pages.filter(
        (p) => p._id !== currentPageId && !p.active
      );

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
            text: page.name || `Page ${page._id}`,
            type: "command",
            command: `set target page to ${page._id}`,
            icon: FaArrowRight,
            className:
              "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          })),
        ],
      };
    }

    // Set target page command
    const targetPageMatch = input.match(setTargetPagePattern);
    if (targetPageMatch) {
      const pageId = targetPageMatch[1];
      const currentPageId = pages.find((p) => p.active)?._id;

      if (pageId === currentPageId) {
        return {
          success: false,
          message: "Cannot set target to current page",
        };
      }

      return {
        style: {
          targetPageId: pageId,
          enablePageNavigation: true,
        },
        message: "Set target page",
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

    // Handle hover text color setting
    const hoverTextColorPattern =
      /(?:change|set|show|modify|update|pick|choose|select)\s+(?:the\s+)?hover\s+text\s+color/i;
    const directHoverTextColorPattern =
      /set\s+hover\s+text\s+color\s+to\s+(.+)/i;

    const hoverTextColorMatch = input.match(hoverTextColorPattern);
    const directHoverTextColorMatch = input.match(directHoverTextColorPattern);

    if (directHoverTextColorMatch) {
      const color = directHoverTextColorMatch[1].trim();
      return {
        style: {
          hoverColor: color,
          transition: currentStyle.transition || "all 200ms ease-in-out",
        },
        message: `Set hover text color to ${color}`,
        success: true,
      };
    }

    if (hoverTextColorMatch) {
      return {
        type: "PROMPT",
        message: "Choose a hover text color:",
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
                        command: "set hover text color to black",
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
                        command: "set hover text color to gray",
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
                        command: "set hover text color to blue",
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
                      command: `set hover text color to ${color.value}`,
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
        property: "hoverColor",
        followUp: {
          type: "COLOR_CHANGE",
          command: (color) => `set hover text color to ${color}`,
        },
      };
    }

    // Handle hover animation and scale settings
    const hoverAnimationPattern =
      /^(?:set|customize|change|modify)\s+(?:the\s+)?hover\s+animation$/i;
    const hoverScalePattern =
      /^(?:set|customize|change|modify)\s+(?:the\s+)?hover\s+scale$/i;
    const directHoverScalePattern = /^set\s+hover\s+scale\s+to\s+([\d.]+)$/i;
    const directTransitionPattern =
      /^set\s+transition\s+duration\s+to\s+(\d+)(?:ms)?$/i;

    const hoverAnimationMatch = input.match(hoverAnimationPattern);
    const hoverScaleMatch = input.match(hoverScalePattern);
    const directHoverScaleMatch = input.match(directHoverScalePattern);
    const directTransitionMatch = input.match(directTransitionPattern);

    // Handle direct transition duration setting
    if (directTransitionMatch) {
      const duration = parseInt(directTransitionMatch[1]);
      if (duration >= 0 && duration <= 1000) {
        return {
          style: {
            transitionDuration: `${duration}ms`,
            transition: `all ${duration}ms ease-in-out`,
          },
          message: `Set transition duration to ${duration}ms`,
          success: true,
        };
      }
      return {
        success: false,
        message: "Transition duration must be between 0 and 1000ms",
      };
    }

    // Handle direct hover scale setting
    if (directHoverScaleMatch) {
      const scale = parseFloat(directHoverScaleMatch[1]);
      if (scale >= 0.5 && scale <= 2.0) {
        return {
          style: {
            hoverScale: scale,
            transition: currentStyle.transition || "all 200ms ease-in-out",
          },
          message: `Set hover scale to ${scale}`,
          success: true,
        };
      }
      return {
        success: false,
        message: "Scale value must be between 0.5 and 2.0",
      };
    }

    // Handle hover animation menu
    if (hoverAnimationMatch || hoverScaleMatch) {
      return {
        type: "PROMPT",
        message: "Configure hover animation:",
        context: "hover",
        options: [
          {
            text: "Scale Effect",
            type: "info",
            className: "text-xs font-semibold text-gray-600",
          },
          {
            type: "wrapper",
            className: "flex flex-wrap gap-1",
            options: [
              {
                text: "Tiny (0.8)",
                command: "set hover scale to 0.8",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Small (0.9)",
                command: "set hover scale to 0.9",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Normal (1.0)",
                command: "set hover scale to 1.0",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Large (1.1)",
                command: "set hover scale to 1.1",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Huge (1.2)",
                command: "set hover scale to 1.2",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
            ],
          },
          {
            text: "Or enter a custom scale value (0.5 - 2.0)",
            type: "info",
            className: "text-xs text-gray-600 mt-2",
          },
          {
            text: "Transition Speed",
            type: "info",
            className: "text-xs font-semibold text-gray-600 mt-4",
          },
          {
            type: "wrapper",
            className: "flex flex-wrap gap-1",
            options: [
              {
                text: "Instant (0ms)",
                command: "set transition duration to 0",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Fast (100ms)",
                command: "set transition duration to 100",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Normal (200ms)",
                command: "set transition duration to 200",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Smooth (300ms)",
                command: "set transition duration to 300",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
              {
                text: "Slow (500ms)",
                command: "set transition duration to 500",
                type: "command",
                className:
                  "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
              },
            ],
          },
          {
            text: "Or enter a custom duration (0 - 1000ms)",
            type: "info",
            className: "text-xs text-gray-600 mt-2",
          },
        ],
        property: "hoverAnimation",
        needsInput: true,
        inputType: "number",
        inputProps: {
          min: 0,
          max: 1000,
          step: 50,
        },
        followUp: {
          type: "DURATION_CHANGE",
          command: (duration) => `set transition duration to ${duration}`,
        },
      };
    }

    // Handle direct numeric input for duration
    const numericInput = parseFloat(input);
    if (!isNaN(numericInput)) {
      if (numericInput >= 0 && numericInput <= 1000) {
        return {
          style: {
            transitionDuration: `${numericInput}ms`,
            transition: `all ${numericInput}ms ease-in-out`,
          },
          message: `Set transition duration to ${numericInput}ms`,
          success: true,
        };
      }
      return {
        success: false,
        message: "Duration must be between 0 and 1000ms",
      };
    }

    // Handle cursor style setting
    const cursorPattern = /^set\s+cursor\s+to\s+(pointer|default|move|text)$/i;
    const cursorMatch = input.match(cursorPattern);

    if (cursorMatch) {
      const cursorType = cursorMatch[1].toLowerCase();
      return {
        style: {
          cursor: cursorType,
        },
        message: `Set cursor to ${cursorType}`,
        success: true,
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

    // Handle removing all hover effects
    const removeHoverEffectsPattern = /^remove\s+all\s+hover\s+effects$/i;
    const removeHoverEffectsMatch = input.match(removeHoverEffectsPattern);

    if (removeHoverEffectsMatch) {
      return {
        style: {
          hoverBackgroundColor: undefined,
          hoverColor: undefined,
          hoverScale: undefined,
          cursor: "default",
          transition: undefined,
          transitionDuration: undefined,
        },
        message: "Removed hover effects",
        success: true,
        isCommandExecution: true,
      };
    }

    // Handle web service setup
    const enableWebServicePattern =
      /^(?:enable|configure|setup)\s*web\s*service$/i;
    if (enableWebServicePattern.test(input)) {
      return {
        type: "PROMPT",
        message: "Select service type:",
        context: "webService",
        options: [
          {
            text: "Service Type",
            type: "info",
            className: "text-xs font-semibold text-gray-600",
          },
          {
            text: "Data Service",
            type: "command",
            command: "set service type to data",
            icon: FaDatabase,
            className:
              "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          },
          {
            text: "Action Service",
            type: "command",
            command: "set service type to action",
            icon: FaBolt,
            className:
              "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          },
        ],
      };
    }

    // Handle service type selection
    const serviceTypePattern = /^set\s*service\s*type\s*to\s*(data|action)$/i;
    const serviceTypeMatch = input.match(serviceTypePattern);
    if (serviceTypeMatch) {
      const serviceType = serviceTypeMatch[1].toLowerCase();
      return {
        type: "PROMPT",
        message: "Select HTTP method:",
        context: "webService",
        options: [
          {
            text: "HTTP Method",
            type: "info",
            className: "text-xs font-semibold text-gray-600",
          },
          ...this.HTTP_METHODS.map((method) => ({
            text: method.label,
            type: "command",
            command: `set http method to ${method.value}`,
            icon: FaGlobe,
            className:
              "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          })),
        ],
        style: {
          serviceConfig: {
            ...currentStyle.serviceConfig,
            type: serviceType,
          },
        },
      };
    }

    // Handle HTTP method selection
    const httpMethodPattern =
      /^set\s*(?:http)?\s*method\s*to\s*(GET|POST|PUT|DELETE|PATCH)$/i;
    const httpMethodMatch = input.match(httpMethodPattern);
    if (httpMethodMatch) {
      const method = httpMethodMatch[1].toUpperCase();
      return {
        type: "PROMPT",
        message: "Enter endpoint URL:",
        context: "webService",
        needsInput: true,
        inputType: "url",
        style: {
          serviceConfig: {
            ...currentStyle.serviceConfig,
            method,
          },
        },
      };
    }

    // Handle endpoint URL setting
    const endpointPattern = /^set\s*endpoint\s*(?:url)?\s*to\s*(.+)$/i;
    const endpointMatch = input.match(endpointPattern);
    if (endpointMatch) {
      const endpoint = endpointMatch[1];
      return {
        type: "PROMPT",
        message: "Select authentication type:",
        context: "webService",
        options: [
          {
            text: "Authentication",
            type: "info",
            className: "text-xs font-semibold text-gray-600",
          },
          ...this.AUTH_TYPES.map((auth) => ({
            text: auth.label,
            type: "command",
            command: `set auth type to ${auth.value}`,
            icon: FaLock,
            className:
              "text-xs px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150",
          })),
        ],
        style: {
          serviceConfig: {
            ...currentStyle.serviceConfig,
            endpoint,
          },
        },
      };
    }

    return null;
  }

  // Add this static method to help identify button-related commands
  static canHandle(input) {
    const buttonPatterns = [
      /hover\s+(?:background\s+)?color/i,
      /hover\s+text\s+color/i,
      /(?:page\s+)?navigation/i,
      /set\s+cursor\s+to/i,
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

  static getSuggestions(headerClass, buttonClass) {
    return {
      text: "Button",
      type: "category",
      icon: FaMousePointer,
      options: [
        {
          text: "Page Navigation",
          type: "info",
          icon: FaArrowRight,
          className: headerClass,
        },
        {
          text: "enable page navigation",
          type: "command",
          icon: FaMousePointer,
          className: buttonClass,
          checkEnabled: (component) => !component?.style?.enablePageNavigation,
        },
        {
          text: "change target page",
          type: "command",
          icon: FaArrowRight,
          className: buttonClass,
          checkEnabled: (component) => component?.style?.enablePageNavigation,
          command: "enable page navigation",
        },
        {
          text: "disable page navigation",
          type: "command",
          icon: FaTimes,
          className: buttonClass,
          checkEnabled: (component) => component?.style?.enablePageNavigation,
        },
        {
          text: "Web Service",
          type: "info",
          icon: FaGlobe,
          className: headerClass,
        },
        {
          text: "configure web service",
          type: "command",
          icon: FaDatabase,
          className: buttonClass,
          command: "setup web service",
        },
        {
          text: "remove web service",
          type: "command",
          icon: FaTimes,
          className: `${buttonClass} text-red-600 hover:text-red-700`,
          command: "remove web service",
          checkEnabled: (component) => component?.style?.serviceConfig,
        },
        {
          text: "Hover Effects",
          type: "info",
          icon: FaAdjust,
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
                  text: "set hover animation",
                  type: "command",
                  icon: FaClock,
                  className: buttonClass,
                  command: "set hover animation",
                },
                {
                  text: "change hover color",
                  type: "command",
                  icon: FaPalette,
                  className: buttonClass,
                },
              ],
            },
            {
              type: "wrapper",
              className: "flex gap-1",
              options: [
                {
                  text: "change hover text color",
                  type: "command",
                  icon: FaPalette,
                  className: buttonClass,
                },
                {
                  text: "remove all effects",
                  type: "command",
                  icon: FaTimes,
                  className: `${buttonClass} text-red-600 hover:text-red-700`,
                  command: "remove all hover effects",
                },
              ],
            },
          ],
        },
        {
          text: "Pointer Style",
          type: "info",
          icon: FaMousePointer,
          className: headerClass,
        },
        {
          type: "wrapper",
          className: "flex flex-wrap gap-1",
          options: [
            {
              text: "pointer",
              command: "set cursor to pointer",
              type: "command",
              icon: FaHandPointer,
              className: buttonClass,
            },
            {
              text: "default",
              command: "set cursor to default",
              type: "command",
              icon: FaMousePointer,
              className: buttonClass,
            },
            {
              text: "move",
              command: "set cursor to move",
              type: "command",
              icon: FaArrowsAlt,
              className: buttonClass,
            },
            {
              text: "text",
              command: "set cursor to text",
              type: "command",
              icon: FaICursor,
              className: buttonClass,
            },
          ],
        },
      ],
    };
  }
}
