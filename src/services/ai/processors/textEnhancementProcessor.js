const ENHANCEMENT_PATTERNS = {
  readability: {
    lineHeight: '1.6',
    letterSpacing: '0.2px',
    maxWidth: '65ch'
  },
  emphasis: {
    fontWeight: 'bold',
    color: '#000000'
  },
  hierarchy: {
    marginBottom: '1em',
    marginTop: '0.5em'
  }
};

export class TextEnhancementProcessor {
  static analyzeTextContent(content) {
    const analysis = {
      length: content.length,
      words: content.split(/\s+/).length,
      sentences: content.split(/[.!?]+/).length,
      hasLinks: content.includes('href='),
      hasLists: content.includes('<li>'),
      readingTime: Math.ceil(content.split(/\s+/).length / 200) // words per minute
    };

    return analysis;
  }

  static suggestEnhancements(analysis) {
    const suggestions = [];

    // Readability suggestions
    if (analysis.words > 100) {
      suggestions.push({
        type: 'readability',
        styles: ENHANCEMENT_PATTERNS.readability,
        reason: 'Long text content benefits from improved readability'
      });
    }

    // Hierarchy suggestions
    if (analysis.sentences > 3) {
      suggestions.push({
        type: 'hierarchy',
        styles: ENHANCEMENT_PATTERNS.hierarchy,
        reason: 'Multiple sentences benefit from proper spacing'
      });
    }

    // Emphasis suggestions for important content
    if (analysis.hasLinks || analysis.hasLists) {
      suggestions.push({
        type: 'emphasis',
        styles: ENHANCEMENT_PATTERNS.emphasis,
        reason: 'Content contains important elements that should stand out'
      });
    }

    return suggestions;
  }

  static applyEnhancements(currentStyle, suggestions) {
    let enhancedStyle = { ...currentStyle };

    suggestions.forEach(suggestion => {
      enhancedStyle = {
        ...enhancedStyle,
        ...suggestion.styles
      };
    });

    return enhancedStyle;
  }
} 