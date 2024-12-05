export class VideoProcessor {
  static getStylePatterns() {
    return {
      src: [
        /(?:set|change|update|make)\s*(?:the)?\s*(?:video|youtube)?\s*(?:url|link|source)\s*(?:to|=|:)?\s*(https?:\/\/[^\s]+)/i,
        /(?:play|show|display|load)\s*(?:the|this)?\s*video\s*(?:from|at|:)?\s*(https?:\/\/[^\s]+)/i,
        /(?:add|insert|embed)\s*(?:this)?\s*video\s*(?:from|:)?\s*(https?:\/\/[^\s]+)/i
      ],
      autoplay: [
        /(?:set|make|turn)\s*(?:the)?\s*video\s*(?:to)?\s*(?:auto)?play/i,
        /(?:enable|disable|toggle)\s*(?:video)?\s*autoplay/i,
        /(?:video\s*should|make\s*video)\s*(?:auto)?play\s*(?:automatically|by\s*itself)/i
      ],
      controls: [
        /(?:show|hide|toggle|enable|disable)\s*(?:the)?\s*(?:video)?\s*controls/i,
        /(?:add|remove)\s*(?:video)?\s*controls/i,
        /(?:set|make)\s*(?:the)?\s*controls\s*(?:visible|invisible|hidden|shown)/i
      ],
      loop: [
        /(?:set|make|turn)\s*(?:the)?\s*video\s*(?:to)?\s*loop/i,
        /(?:enable|disable|toggle)\s*(?:video)?\s*loop(?:ing)?/i,
        /(?:video\s*should|make\s*video)\s*(?:loop|repeat)/i
      ],
      muted: [
        /(?:mute|unmute)\s*(?:the)?\s*video/i,
        /(?:turn|set)\s*(?:the)?\s*(?:video)?\s*(?:volume|sound|audio)\s*(?:off|on)/i,
        /(?:enable|disable|toggle)\s*(?:video)?\s*(?:mute|sound|audio)/i
      ]
    };
  }

  static getPropertyNames() {
    return {
      youtubeUrl: 'video URL',
      autoplay: 'autoplay',
      controls: 'video controls',
      loop: 'video loop',
      muted: 'mute'
    };
  }

  static processCommand(input, currentStyle = {}) {
    const patterns = this.getStylePatterns();
    const lowercaseInput = input.toLowerCase();

    // Process URL changes
    for (const pattern of patterns.src) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const url = match[1];
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          return {
            props: {
              youtubeUrl: url
            }
          };
        }
      }
    }

    // Process boolean toggles
    const booleanProperties = {
      autoplay: patterns.autoplay,
      controls: patterns.controls,
      loop: patterns.loop,
      muted: patterns.muted
    };

    for (const [property, propertyPatterns] of Object.entries(booleanProperties)) {
      for (const pattern of propertyPatterns) {
        if (pattern.test(lowercaseInput)) {
          let newValue = true;
          if (lowercaseInput.includes('disable') || 
              lowercaseInput.includes('hide') || 
              lowercaseInput.includes('remove') || 
              lowercaseInput.includes('off') || 
              lowercaseInput.includes('unmute')) {
            newValue = false;
          }
          if (lowercaseInput.includes('toggle')) {
            newValue = !currentStyle[property];
          }
          return {
            props: {
              [property]: newValue
            }
          };
        }
      }
    }

    return null;
  }
}