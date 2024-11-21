import { componentTypes } from '../../../components/Components/componentConfig';

export const parseNaturalLanguage = (message) => {
  console.log('Parsing message:', message); // Debug log
  
  const patterns = {
    command: {
      type: /(create|add|new|insert|modify|update|change|delete|remove)/i
    },
    components: {
      type: new RegExp(`\\b(${Object.keys(componentTypes).join('|')})\\b`, 'i')
    },
    layout: {
      direction: /(vertical|horizontal|row|column)\s*(layout|direction)?/i,
      columns: /(\d+)\s*columns?/i,
      rows: /(\d+)\s*rows?/i,
      alignment: /(center|left|right|top|bottom)\s*(align(?:ed|ment)?)/i,
      gap: /(\d+(?:\.\d+)?)(px|em|rem|%)\s*(?:gap|space)/i,
      wrap: /(wrap|nowrap)/i
    },
    style: {
      colors: /(red|blue|green|yellow|black|white|#[0-9a-f]{3,6})/i,
      size: /(small|medium|large|(\d+)(px|em|rem|%))/i,
      font: /(bold|italic|underline)/i
    },
    position: {
      inside: /(?:in|inside|within)\s+(\w+)/i,
      relative: /(above|below|left|right|next to)\s+(\w+)/i
    },
    content: {
      text: /"([^"]+)"|'([^']+)'/,
      placeholder: /placeholder\s+"([^"]+)"/i
    }
  };

  const processMatches = (patternGroup) => {
    return Object.entries(patternGroup).reduce((acc, [key, pattern]) => {
      const match = message.match(pattern);
      if (match) {
        acc[key] = match;
        console.log(`Found match for ${key}:`, match); // Debug log
      }
      return acc;
    }, {});
  };

  const result = {
    matches: {
      command: processMatches(patterns.command),
      components: processMatches(patterns.components),
      layout: processMatches(patterns.layout),
      style: processMatches(patterns.style),
      position: processMatches(patterns.position),
      content: processMatches(patterns.content)
    }
  };

  console.log('Parse result:', result); // Debug log
  return result;
}; 