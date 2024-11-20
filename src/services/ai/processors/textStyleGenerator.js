import { textProcessor } from "./textProcessor";

// Predefined text style combinations for different purposes
const TEXT_STYLE_PRESETS = {
  heading: {
    large: {
      fontSize: "32px",
      fontWeight: "bold",
      lineHeight: "1.2",
      letterSpacing: "-0.5px",
      marginBottom: "24px",
    },
    medium: {
      fontSize: "24px",
      fontWeight: "bold",
      lineHeight: "1.3",
      letterSpacing: "-0.3px",
      marginBottom: "20px",
    },
    small: {
      fontSize: "20px",
      fontWeight: "bold",
      lineHeight: "1.4",
      letterSpacing: "-0.2px",
      marginBottom: "16px",
    },
  },
  body: {
    large: {
      fontSize: "18px",
      lineHeight: "1.6",
      letterSpacing: "0.2px",
      marginBottom: "16px",
    },
    medium: {
      fontSize: "16px",
      lineHeight: "1.5",
      letterSpacing: "normal",
      marginBottom: "16px",
    },
    small: {
      fontSize: "14px",
      lineHeight: "1.5",
      letterSpacing: "normal",
      marginBottom: "12px",
    },
  },
  emphasis: {
    strong: {
      fontWeight: "bold",
      color: "#000000",
    },
    subtle: {
      fontWeight: "500",
      color: "#666666",
    },
    highlight: {
      backgroundColor: "#fff3cd",
      padding: "2px 4px",
      borderRadius: "2px",
    },
  },
};

// Text style patterns for AI to recognize and generate
const TEXT_STYLE_PATTERNS = {
  modern: {
    fontFamily: '"Inter", sans-serif',
    letterSpacing: "-0.1px",
    lineHeight: "1.5",
  },
  classic: {
    fontFamily: '"Georgia", serif',
    letterSpacing: "normal",
    lineHeight: "1.6",
  },
  minimal: {
    fontFamily: '"Arial", sans-serif',
    letterSpacing: "normal",
    lineHeight: "1.4",
  },
};

export class TextStyleGenerator {
  static generateStyleFromIntent(intent) {
    const style = {};

    // Process emphasis intents
    if (intent.emphasis) {
      switch (intent.emphasis) {
        case "strong":
          Object.assign(style, TEXT_STYLE_PRESETS.emphasis.strong);
          break;
        case "subtle":
          Object.assign(style, TEXT_STYLE_PRESETS.emphasis.subtle);
          break;
        case "highlight":
          Object.assign(style, TEXT_STYLE_PRESETS.emphasis.highlight);
          break;
      }
    }

    // Process size intents
    if (intent.size) {
      const baseStyle =
        intent.type === "heading"
          ? TEXT_STYLE_PRESETS.heading[intent.size]
          : TEXT_STYLE_PRESETS.body[intent.size];
      Object.assign(style, baseStyle);
    }

    // Process pattern intents
    if (intent.pattern) {
      Object.assign(style, TEXT_STYLE_PATTERNS[intent.pattern]);
    }

    return style;
  }

  static generateResponsiveStyle(baseStyle, breakpoints) {
    const responsiveStyle = {
      base: { ...baseStyle },
      mobile: {},
      tablet: {},
      desktop: {},
    };

    // Calculate responsive font sizes
    if (baseStyle.fontSize) {
      const baseFontSize = parseInt(baseStyle.fontSize);
      responsiveStyle.mobile.fontSize = `${Math.max(
        baseFontSize * 0.875,
        12
      )}px`;
      responsiveStyle.tablet.fontSize = `${baseFontSize}px`;
      responsiveStyle.desktop.fontSize = `${baseFontSize * 1.125}px`;
    }

    // Adjust line height for different screen sizes
    if (baseStyle.lineHeight) {
      const baseLineHeight = parseFloat(baseStyle.lineHeight);
      responsiveStyle.mobile.lineHeight = (baseLineHeight * 0.95).toFixed(2);
      responsiveStyle.tablet.lineHeight = baseLineHeight.toFixed(2);
      responsiveStyle.desktop.lineHeight = (baseLineHeight * 1.05).toFixed(2);
    }

    return responsiveStyle;
  }
}
