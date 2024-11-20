export class TextLocalizationProcessor {
  static LANGUAGE_SPECIFIC_STYLES = {
    ar: { // Arabic
      direction: 'rtl',
      fontFamily: '"Arial", "Traditional Arabic", sans-serif',
      lineHeight: '1.8'
    },
    zh: { // Chinese
      fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
      lineHeight: '1.7'
    },
    ja: { // Japanese
      fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif',
      lineHeight: '1.7'
    },
    ko: { // Korean
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      lineHeight: '1.7'
    }
  };

  static SCRIPT_SPECIFIC_ADJUSTMENTS = {
    latin: {
      letterSpacing: 'normal',
      wordSpacing: 'normal'
    },
    cjk: {
      letterSpacing: '0.05em',
      wordSpacing: '0.1em'
    },
    arabic: {
      letterSpacing: '0',
      wordSpacing: '0.1em'
    }
  };

  static processLocalization(content, targetLocale) {
    const baseLocale = targetLocale.split('-')[0];
    const languageStyle = this.LANGUAGE_SPECIFIC_STYLES[baseLocale] || {};
    
    // Detect script type
    const scriptType = this.detectScriptType(content);
    const scriptAdjustments = this.SCRIPT_SPECIFIC_ADJUSTMENTS[scriptType] || {};

    return {
      style: {
        ...languageStyle,
        ...scriptAdjustments
      },
      recommendations: this.getLocalizationRecommendations(targetLocale, content)
    };
  }

  static detectScriptType(content) {
    // Simple script detection based on character ranges
    const hasLatin = /[a-zA-Z]/.test(content);
    const hasCJK = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/.test(content);
    const hasArabic = /[\u0600-\u06FF]/.test(content);

    if (hasArabic) return 'arabic';
    if (hasCJK) return 'cjk';
    return 'latin';
  }

  static getLocalizationRecommendations(locale, content) {
    const recommendations = [];

    // Add locale-specific recommendations
    switch (locale.split('-')[0]) {
      case 'ar':
        recommendations.push({
          type: 'direction',
          message: 'Enable RTL text direction for Arabic content'
        });
        break;
      case 'ja':
        if (content.length > 50) {
          recommendations.push({
            type: 'lineBreak',
            message: 'Consider adding line breaks after complete thoughts for better readability in Japanese'
          });
        }
        break;
      // Add more locale-specific recommendations
    }

    return recommendations;
  }
} 