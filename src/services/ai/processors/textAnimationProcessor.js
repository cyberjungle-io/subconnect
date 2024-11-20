export class TextAnimationProcessor {
  static ANIMATION_PRESETS = {
    fadeIn: {
      animation: 'fadeIn 0.5s ease-in-out',
      keyframes: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
    },
    slideIn: {
      animation: 'slideIn 0.5s ease-out',
      keyframes: `
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `
    },
    typewriter: {
      animation: 'typewriter 2s steps(40, end)',
      keyframes: `
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
      `
    }
  };

  static processAnimationPrompt(prompt) {
    const words = prompt.toLowerCase().split(' ');
    const animations = [];
    
    // Detect animation types from prompt
    if (words.includes('fade')) animations.push('fadeIn');
    if (words.includes('slide')) animations.push('slideIn');
    if (words.includes('type')) animations.push('typewriter');

    // Generate animation styles
    return animations.map(type => ({
      ...this.ANIMATION_PRESETS[type],
      duration: this.extractDuration(words),
      delay: this.extractDelay(words)
    }));
  }

  static extractDuration(words) {
    const durationIndex = words.findIndex(word => word.includes('second') || word.includes('ms'));
    if (durationIndex > 0) {
      const duration = parseFloat(words[durationIndex - 1]);
      return words[durationIndex].includes('ms') ? duration : duration * 1000;
    }
    return 500; // default duration
  }

  static extractDelay(words) {
    const delayIndex = words.findIndex(word => word.includes('delay'));
    if (delayIndex > 0) {
      return parseFloat(words[delayIndex - 1]) * 1000;
    }
    return 0; // default delay
  }
} 