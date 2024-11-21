export class PatternMatcher {
  constructor() {
    this.similarityThreshold = 0.7;
  }

  calculatePatternSimilarity(pattern1, pattern2) {
    const weights = {
      type: 0.2,
      componentType: 0.3,
      style: 0.25,
      props: 0.25
    };

    return Object.entries(weights).reduce((score, [key, weight]) => {
      const similarity = this.compareFields(pattern1[key], pattern2[key]);
      return score + (similarity * weight);
    }, 0);
  }

  compareFields(field1, field2) {
    if (typeof field1 === 'object' && typeof field2 === 'object') {
      const keys1 = Object.keys(field1);
      const keys2 = Object.keys(field2);
      const commonKeys = keys1.filter(key => keys2.includes(key));
      return commonKeys.length / Math.max(keys1.length, keys2.length);
    }
    return field1 === field2 ? 1 : 0;
  }
} 