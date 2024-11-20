import { TextStyleGenerator } from './textStyleGenerator';

const INTENT_KEYWORDS = {
  emphasis: {
    strong: ['strong', 'bold', 'prominent', 'standout'],
    subtle: ['subtle', 'light', 'soft', 'gentle'],
    highlight: ['highlight', 'marked', 'emphasized']
  },
  size: {
    large: ['large', 'big', 'huge', 'prominent'],
    medium: ['medium', 'normal', 'regular'],
    small: ['small', 'tiny', 'compact']
  },
  pattern: {
    modern: ['modern', 'contemporary', 'clean'],
    classic: ['classic', 'traditional', 'serif'],
    minimal: ['minimal', 'simple', 'clean']
  }
};

export class TextIntentProcessor {
  static extractIntent(prompt) {
    const intent = {
      type: 'body',
      emphasis: null,
      size: 'medium',
      pattern: null
    };

    const words = prompt.toLowerCase().split(' ');

    // Detect text type
    if (words.some(word => word.includes('head') || word.includes('title'))) {
      intent.type = 'heading';
    }

    // Process emphasis
    for (const [emphasisType, keywords] of Object.entries(INTENT_KEYWORDS.emphasis)) {
      if (words.some(word => keywords.includes(word))) {
        intent.emphasis = emphasisType;
        break;
      }
    }

    // Process size
    for (const [sizeType, keywords] of Object.entries(INTENT_KEYWORDS.size)) {
      if (words.some(word => keywords.includes(word))) {
        intent.size = sizeType;
        break;
      }
    }

    // Process pattern
    for (const [patternType, keywords] of Object.entries(INTENT_KEYWORDS.pattern)) {
      if (words.some(word => keywords.includes(word))) {
        intent.pattern = patternType;
        break;
      }
    }

    return intent;
  }

  static processPrompt(prompt) {
    const intent = this.extractIntent(prompt);
    const baseStyle = TextStyleGenerator.generateStyleFromIntent(intent);
    const responsiveStyle = TextStyleGenerator.generateResponsiveStyle(baseStyle);

    return {
      style: baseStyle,
      responsiveStyle,
      intent
    };
  }
} 