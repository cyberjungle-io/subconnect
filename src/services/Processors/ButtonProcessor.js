import React from 'react';
import { store } from '../../store/store';
import { FaArrowRight } from 'react-icons/fa';

export class ButtonProcessor {
  static colorKeywords = {
    // Common color aliases
    'transparent': 'transparent',
    'clear': 'transparent',
    'invisible': 'transparent',
    'navy': '#000080',
    'sky': '#87CEEB',
    'forest': '#228B22',
    'crimson': '#DC143C',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    // Basic colors
    'blue': '#0000ff',
    'light blue': '#add8e6',
    'dark blue': '#00008b',
    'green': '#008000',
    'light green': '#90ee90',
    'dark green': '#006400',
    'red': '#ff0000',
    'light red': '#ffcccb',
    'dark red': '#8b0000',
    'yellow': '#ffff00',
    'purple': '#800080',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'grey': '#808080'
  };

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
        /remove\s*(?:page)?\s*navigation/i
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
        /(?:i want|please make)?\s*(?:it|the container)?\s*(?:turn|change to|become)\s*(#[0-9a-fA-F]{3,6}|[a-z]+)\s*(?:when|on)?\s*hover/i
      ],

      hoverColor: [
        // Text color changes
        /(?:set|change|make)\s*(?:the)?\s*hover\s*text\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        /when\s*hovering\s*(?:change|make|set)?\s*(?:the)?\s*text\s*color\s*(?:to|=|:)?\s*(#[0-9a-fA-F]{3,6}|[a-z]+)/i,
        // Natural language
        /(?:i want|please make)?\s*(?:the)?\s*text\s*(?:turn|change to|become)\s*(#[0-9a-fA-F]{3,6}|[a-z]+)\s*(?:when|on)?\s*hover/i
      ],

      hoverScale: [
        // Direct scale settings
        /(?:set|change|make)\s*(?:the)?\s*hover\s*scale\s*(?:to|=|:)?\s*(0?\.[0-9]+|1\.?[0-9]*)/i,
        // Natural language - specific values
        /(?:make|set)?\s*(?:it|the container)?\s*(?:scale|grow|shrink)\s*to\s*(0?\.[0-9]+|1\.?[0-9]*)\s*(?:when|on)?\s*hover/i,
        // Natural language - relative
        /(?:make|set)?\s*(?:it|the container)?\s*(bigger|larger|smaller|tiny|huge)\s*(?:when|on)?\s*hover/i
      ],

      cursor: [
        // Direct cursor settings
        /(?:set|change|make)\s*(?:the)?\s*cursor\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
        // Natural language
        /(?:make|set)?\s*(?:the)?\s*mouse\s*(?:cursor|pointer)\s*(?:look like|change to|become)\s*(?:a|an)?\s*(pointer|hand|arrow|grabber|text cursor|copy symbol)/i,
        /(?:show|display)\s*(?:a|an)?\s*(pointer|hand|arrow|grabber|text cursor|copy symbol)\s*(?:cursor|mouse)/i
      ],

      transitionDuration: [
        // Direct duration settings
        /(?:set|change|make)\s*(?:the)?\s*(?:hover)?\s*transition\s*(?:duration|speed|time)\s*(?:to|=|:)?\s*(\d+)(?:\s*ms)?/i,
        // Natural language
        /(?:make|set)?\s*(?:the)?\s*hover\s*(?:effect|animation|transition)\s*(faster|slower|quick|slow|instant|smooth)/i,
        /(?:make|set)?\s*(?:the)?\s*hover\s*(?:effect|animation|transition)\s*(?:take|last)\s*(\d+)(?:\s*ms)?/i
      ],

      // Add patterns for removing effects
      removeEffects: [
        /remove\s*(?:all)?\s*(?:hover|click)?\s*effects?/i,
        /disable\s*(?:all)?\s*(?:hover|click)?\s*effects?/i,
        /turn\s*off\s*(?:all)?\s*(?:hover|click)?\s*effects?/i
      ],
    };
  }

  static processCommand(input) {
    console.log('ButtonProcessor received input:', input);
    const lowercaseInput = input.toLowerCase();
    const patterns = this.getStylePatterns();
    const buttonClass = "text-xs px-1 py-1 rounded-md bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300";

    // Handle page navigation enable/disable
    const navigationMatch = patterns.enablePageNavigation.some(pattern => pattern.test(lowercaseInput));
    console.log('Navigation pattern match:', navigationMatch);
    
    if (navigationMatch) {
      const isEnable = !/(disable|turn\s*off|remove)/i.test(lowercaseInput);
      console.log('Is enabling navigation:', isEnable);
      
      if (isEnable) {
        // Get pages and current component from Redux store
        const state = store.getState();
        console.log('Full Redux State:', state);
        
        const pages = state.w3s?.currentProject?.data?.pages || [];
        const currentPage = state.editor?.currentPage?._id || 
                           state.w3s?.currentProject?.data?.pages?.find(p => p.selected)?._id;
        
        console.log('Pages:', pages);
        console.log('Current page ID:', currentPage);
        console.log('Editor current page:', state.editor?.currentPage);
        
        // Filter out the current page from options
        const availablePages = pages.filter(page => {
          console.log('Comparing page:', page._id, 'with current:', currentPage);
          return page._id !== currentPage;
        });
        console.log('Available pages (excluding current):', availablePages);
        
        // Create page selection options with FaArrowRight component
        const pageOptions = availablePages.map(page => ({
          text: page.name,
          type: "command",
          icon: FaArrowRight,
          command: `set target page to ${page.name}`,
          value: page._id,
          className: buttonClass
        }));
        console.log('Created page options:', pageOptions);

        const result = {
          style: {
            enablePageNavigation: true,
            cursor: 'pointer',
            transition: 'all 200ms ease-in-out',
            hoverBackgroundColor: '#f0f0f0',
            hoverScale: 1.02
          },
          message: "✓ Navigation enabled",
          options: [
            {
              text: "Select Target Page",
              type: "info",
              icon: FaArrowRight,
              className: "text-xs font-small text-gray-200 mt-2"
            },
            ...pageOptions
          ]
        };
        console.log('Returning navigation enable result:', result);
        return result;
      } else {
        return {
          style: {
            enablePageNavigation: false,
            targetPageId: undefined,
            cursor: 'default',
            hoverBackgroundColor: undefined,
            hoverScale: undefined
          },
          message: "Page navigation disabled"
        };
      }
    }

    // Handle target page selection
    const targetPageMatch = lowercaseInput.match(/set\s*target\s*(?:page)?\s*to\s*(.+)/i);
    if (targetPageMatch) {
      const pageName = targetPageMatch[1].trim();
      const state = store.getState();
      const pages = state.w3s?.currentProject?.data?.pages || [];
      const targetPage = pages.find(p => p.name.toLowerCase() === pageName.toLowerCase());

      if (targetPage) {
        return {
          style: {
            targetPageId: targetPage._id
          },
          message: `Target page set to: ${targetPage.name}`
        };
      } else {
        return {
          message: `Page "${pageName}" not found. Available pages:`,
          options: pages.map(page => ({
            text: page.name,
            type: "command",
            command: `set target page to ${page.name}`,
            icon: FaArrowRight
          }))
        };
      }
    }

    // Handle hover scale relative terms
    const scaleMatch = lowercaseInput.match(/(?:make|set)?\s*(?:it|the container)?\s*(bigger|larger|smaller|tiny|huge)\s*(?:when|on)?\s*hover/i);
    if (scaleMatch) {
      const scaleMap = {
        tiny: 0.8,
        smaller: 0.9,
        bigger: 1.1,
        larger: 1.15,
        huge: 1.2
      };
      return {
        style: {
          hoverScale: scaleMap[scaleMatch[1]] || 1.1,
          transition: 'all 200ms ease-in-out'
        }
      };
    }

    // Handle transition speed terms
    const speedMatch = lowercaseInput.match(/(?:make|set)?\s*(?:the)?\s*hover\s*(?:effect|animation|transition)\s*(faster|slower|quick|slow|instant|smooth)/i);
    if (speedMatch) {
      const durationMap = {
        instant: 0,
        faster: 100,
        quick: 150,
        smooth: 300,
        slower: 400,
        slow: 500
      };
      const duration = durationMap[speedMatch[1]] || 200;
      return {
        style: {
          transitionDuration: duration,
          transition: `all ${duration}ms ease-in-out`
        }
      };
    }

    // Handle removing all effects
    if (patterns.removeEffects.some(pattern => pattern.test(lowercaseInput))) {
      return {
        style: {
          cursor: 'default',
          transition: undefined,
          hoverBackgroundColor: undefined,
          hoverColor: undefined,
          hoverScale: undefined,
          hoverShadow: undefined,
          activeScale: undefined,
          activeShadow: undefined,
          activeBackgroundColor: undefined
        }
      };
    }

    // Process other patterns
    let result = { style: {} };
    
    for (const [property, propertyPatterns] of Object.entries(patterns)) {
      for (const pattern of propertyPatterns) {
        const match = input.match(pattern);
        
        if (match) {
          let value = match[1]?.toLowerCase();

          // Handle special cases
          switch (property) {
            case 'transitionDuration':
              value = parseInt(value);
              result.style.transition = `all ${value}ms ease-in-out`;
              break;

            case 'cursor':
              const cursorMap = {
                'hand': 'pointer',
                'arrow': 'default',
                'grabber': 'grab',
                'text cursor': 'text',
                'copy symbol': 'copy'
              };
              value = cursorMap[value] || value;
              break;

            case 'hoverScale':
              value = parseFloat(value);
              if (value < 0.8) value = 0.8;
              if (value > 1.2) value = 1.2;
              break;

            case 'targetPageId':
              result.style.enablePageNavigation = true;
              break;
          }

          if (value !== undefined) {
            result.style[property] = value;
          }
        }
      }
    }

    return Object.keys(result.style).length > 0 ? result : null;
  }

  static getPropertyNames() {
    return {
      hoverBackgroundColor: 'hover background color',
      hoverColor: 'hover text color',
      hoverScale: 'hover scale',
      cursor: 'cursor style',
      transitionDuration: 'transition duration',
      enablePageNavigation: 'page navigation',
      targetPageId: 'target page'
    };
  }
} 