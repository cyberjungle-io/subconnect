export class TextSEOProcessor {
  static analyzeTextSEO(content, type) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: []
    };

    // Length analysis
    const wordCount = content.split(/\s+/).length;
    if (type === 'heading') {
      if (wordCount > 10) {
        analysis.issues.push({
          type: 'length',
          severity: 'warning',
          message: 'Heading is too long for optimal SEO'
        });
        analysis.suggestions.push({
          type: 'length',
          message: 'Keep headings between 4-10 words for better SEO'
        });
      }
    } else {
      if (wordCount < 300) {
        analysis.suggestions.push({
          type: 'length',
          message: 'Consider adding more content for better SEO (aim for 300+ words)'
        });
      }
    }

    // Keyword density analysis
    const keywords = this.extractKeywords(content);
    const keywordDensity = this.calculateKeywordDensity(content, keywords);
    
    if (keywordDensity > 0.03) {
      analysis.issues.push({
        type: 'keyword_stuffing',
        severity: 'warning',
        message: 'Keyword density is too high'
      });
    }

    // Calculate overall SEO score
    analysis.score = this.calculateSEOScore(content, type, analysis.issues);

    return analysis;
  }

  static extractKeywords(content) {
    // Simple keyword extraction (this could be enhanced with NLP)
    const words = content.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);
    
    return words
      .filter(word => !stopWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
  }

  static calculateKeywordDensity(content, keywords) {
    const totalWords = content.split(/\s+/).length;
    const keywordCount = Object.values(keywords).reduce((sum, count) => sum + count, 0);
    return keywordCount / totalWords;
  }

  static calculateSEOScore(content, type, issues) {
    let score = 100;
    
    // Deduct points for issues
    score -= issues.length * 10;

    // Add points for good practices
    if (type === 'heading') {
      if (/^[A-Z]/.test(content)) score += 5; // Starts with capital letter
      if (content.length < 60) score += 5; // Good heading length
    } else {
      if (content.length > 300) score += 10; // Good content length
      if (/\n\n/.test(content)) score += 5; // Has paragraphs
    }

    return Math.max(0, Math.min(100, score));
  }
} 