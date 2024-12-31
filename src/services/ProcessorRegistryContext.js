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

    // Register Button Processor
    registry.registerProcessor(
      {
        id: "ButtonProcessor",
        name: "Button Processor",
        priority: 65,
        contextTypes: ["BUTTON"],
        patterns: [
          {
            pattern: /(?:button|hover|click)/i,
            type: "STYLE",
            priority: 65,
            examples: ["set button color", "change hover effect"],
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
