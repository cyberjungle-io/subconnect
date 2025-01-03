import React, { createContext, useContext, useEffect } from "react";
import ProcessorErrorBoundary from "./ProcessorErrorBoundary";
import { ProcessorRegistry } from "./ProcessorRegistry";
import { FlexContainerProcessor } from "./Processors/FlexContainerProcessor";
import { SizeProcessor } from "./Processors/SizeProcessor";
import { BorderProcessor } from "./Processors/BorderProcessor";
import { ShadowProcessor } from "./Processors/ShadowProcessor";
import { BackgroundProcessor } from "./Processors/BackgroundProcessor";
import { ButtonProcessor } from "./Processors/ButtonProcessor";
import { LayoutProcessor } from "./Processors/LayoutProcessor";
import { SpacingProcessor } from "./Processors/SpacingProcessor";
import { NestProcessor } from "./Processors/NestProcessor";

const ProcessorRegistryContext = createContext(null);

export function ProcessorRegistryProvider({ children }) {
  const registry = new ProcessorRegistry();

  useEffect(() => {
    // Make registry globally available for non-React contexts
    window.processorRegistry = registry;

    return () => {
      delete window.processorRegistry;
    };
  }, [registry]);

  useEffect(() => {
    // Register Layout Processor first
    registry.registerProcessor(LayoutProcessor.getMetadata(), LayoutProcessor);

    // Register FlexContainer Processor
    registry.registerProcessor(
      {
        id: "FlexContainerProcessor",
        name: "Flex Container Processor",
        priority: 90,
        contextTypes: ["FLEX_CONTAINER", "ALL"],
        patterns: [
          {
            pattern: /(?:container|flex|box|layout)/i,
            type: "COMPONENT",
            priority: 90,
            property: "container",
            examples: ["create flex container", "add container"],
          },
        ],
      },
      FlexContainerProcessor
    );

    // Register Size Processor
    registry.registerProcessor(
      {
        id: "SizeProcessor",
        name: "Size Processor",
        priority: 85,
        contextTypes: ["ALL"],
        patterns: [
          {
            pattern: /(?:width|height|size|bigger|smaller|fit)/i,
            type: "STYLE",
            priority: 85,
            examples: ["set width to 200px", "make it bigger"],
          },
        ],
      },
      SizeProcessor
    );

    // Register Border Processor
    registry.registerProcessor(
      {
        id: "BorderProcessor",
        name: "Border Processor",
        priority: 80,
        contextTypes: ["ALL"],
        patterns: [
          {
            pattern: /border\s*(width|style|color)?/i,
            type: "STYLE",
            priority: 80,
            examples: ["add border", "set border width to 2px"],
          },
        ],
      },
      BorderProcessor
    );

    // Register Shadow Processor
    registry.registerProcessor(
      {
        id: "ShadowProcessor",
        name: "Shadow Processor",
        priority: 75,
        contextTypes: ["ALL"],
        patterns: [
          {
            pattern: /shadow/i,
            type: "STYLE",
            priority: 75,
            examples: ["add shadow", "remove shadow"],
          },
        ],
      },
      ShadowProcessor
    );

    // Register Background Processor
    registry.registerProcessor(
      {
        id: "BackgroundProcessor",
        name: "Background Processor",
        priority: 70,
        contextTypes: ["ALL"],
        patterns: [
          {
            pattern: /background|bg/i,
            type: "STYLE",
            priority: 70,
            examples: ["set background color", "change bg to blue"],
          },
        ],
      },
      BackgroundProcessor
    );

    // Register Button Processor with navigation patterns
    registry.registerProcessor(
      {
        id: "ButtonProcessor",
        name: "Button Processor",
        priority: 95,
        contextTypes: ["ALL"],
        patterns: [
          {
            pattern: /^(?:enable|disable)\s*(?:page)?\s*navigation$/i,
            type: "COMMAND",
            priority: 100,
            property: "navigation",
          },
          {
            pattern: /^change\s*(?:the)?\s*target\s*page$/i,
            type: "COMMAND",
            priority: 100,
            property: "navigation",
          },
          {
            pattern: /^set\s*target\s*page\s*to\s*([a-zA-Z0-9_-]+)$/i,
            type: "COMMAND",
            priority: 100,
            property: "navigation",
          },
          {
            pattern: /^(?:enable|configure|setup)\s*web\s*service$/i,
            type: "COMMAND",
            priority: 100,
            property: "webService",
          },
          {
            pattern: /^set\s*service\s*type\s*to\s*(data|action)$/i,
            type: "COMMAND",
            priority: 100,
            property: "serviceType",
          },
          {
            pattern:
              /^set\s*(?:http)?\s*method\s*to\s*(GET|POST|PUT|DELETE|PATCH)$/i,
            type: "COMMAND",
            priority: 100,
            property: "httpMethod",
          },
          {
            pattern: /^set\s*endpoint\s*(?:url)?\s*to\s*(.+)$/i,
            type: "COMMAND",
            priority: 100,
            property: "endpoint",
          },
          {
            pattern: /(?:button|hover|click)/i,
            type: "STYLE",
            priority: 65,
            examples: ["set button color", "change hover effect"],
          },
          {
            pattern:
              /^set\s*(?:the\s+)?cursor\s*(?:to|=|:)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
            type: "STYLE",
            priority: 90,
            property: "cursor",
          },
          {
            pattern:
              /(?:make|change|update)\s*(?:the\s+)?(?:mouse\s+)?cursor\s*(?:to|into|as|like|become)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)/i,
            type: "STYLE",
            priority: 90,
            property: "cursor",
          },
          {
            pattern:
              /^cursor\s*(?::|=|to)?\s*(pointer|default|move|grab|grabbing|not-allowed|wait|progress|help|crosshair|text|copy|cell)$/i,
            type: "STYLE",
            priority: 90,
            property: "cursor",
          },
        ],
      },
      ButtonProcessor
    );

    // Register Spacing Processor
    registry.registerProcessor(
      {
        id: "SpacingProcessor",
        name: "Spacing Processor",
        priority: 85,
        contextTypes: ["ALL"],
        patterns: [
          {
            pattern: /^(small|medium|large)$/i,
            type: "STYLE",
            priority: 100,
            property: "spacing",
            examples: ["small", "medium", "large"],
          },
          {
            pattern: /^(add|remove)\s*5px$/i,
            type: "STYLE",
            priority: 100,
            property: "spacing",
            examples: ["add 5px", "remove 5px"],
          },
        ],
      },
      SpacingProcessor
    );

    // Register NestProcessor
    registry.registerProcessor(NestProcessor.getMetadata(), NestProcessor);
  }, []);

  return (
    <ProcessorErrorBoundary>
      <ProcessorRegistryContext.Provider value={registry}>
        {children}
      </ProcessorRegistryContext.Provider>
    </ProcessorErrorBoundary>
  );
}

export function useProcessorRegistry() {
  const context = useContext(ProcessorRegistryContext);
  if (!context) {
    throw new Error(
      "useProcessorRegistry must be used within a ProcessorRegistryProvider"
    );
  }
  return context;
}
