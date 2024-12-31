import { LLMProcessor } from "./Processors/LLMProcessor";
import LLMService from "./llm/llmService";

export class ProcessorRegistry {
  constructor() {
    this.processors = new Map();
    this.patterns = new Map();
    this.llmService = new LLMService();
  }

  registerProcessor(metadata, processor) {
    if (!metadata.id || !metadata.patterns) {
      throw new Error("Processor metadata must include id and patterns");
    }

    this.processors.set(metadata.id, {
      metadata,
      processor,
      patterns: new Map(
        metadata.patterns.map((pattern) => [pattern.pattern, pattern])
      ),
    });

    // Register patterns for global lookup
    metadata.patterns.forEach((pattern) => {
      this.patterns.set(pattern.pattern, {
        processorId: metadata.id,
        ...pattern,
      });
    });
  }

  async processCommand(input, context) {
    try {
      // Handle direct commands first
      const lowercaseInput = input.toLowerCase().trim();

      // Check for direct layout commands
      const directCommands = {
        // Direction commands
        horizontal: true,
        vertical: true,
        // Wrap commands
        wrap: true,
        nowrap: true,
        "wrap-reverse": true,
        // Justify content commands
        start: true,
        end: true,
        center: true,
        between: true,
        around: true,
        evenly: true,
        // Align items commands
        stretch: true,
        baseline: true,
        top: true,
        bottom: true,
        middle: true,
        // Add spacing presets
        small: true,
        medium: true,
        large: true,
        // Add spacing adjustments
        "add 5px": true,
        "remove 5px": true,
      };

      if (directCommands[lowercaseInput]) {
        // Check for spacing commands first
        if (
          ["small", "medium", "large", "add 5px", "remove 5px"].includes(
            lowercaseInput
          )
        ) {
          const spacingProcessor = this.processors.get("SpacingProcessor");
          if (spacingProcessor) {
            const result = spacingProcessor.processor.processCommand(
              input,
              context
            );
            // Format result for message display
            if (result) {
              if (result.adjust) {
                const adjustedResult = result.adjust(context?.style || {});
                return {
                  style: adjustedResult.style,
                  message: adjustedResult.message,
                  property: adjustedResult.property,
                  success: true,
                  type: "COMMAND_EXECUTED",
                  content: adjustedResult.message || `Updated spacing`,
                };
              }
              return {
                style: result.style,
                message: result.message,
                property: result.property,
                success: true,
                type: "COMMAND_EXECUTED",
                content: result.message || `Updated spacing`,
              };
            }
          }
        }

        // Then check layout commands
        const layoutProcessor = this.processors.get("LayoutProcessor");
        if (layoutProcessor) {
          return layoutProcessor.processor.processCommand(input, context);
        }
      }

      // Get processor-specific intents
      const layoutProcessor = this.processors.get("LayoutProcessor");
      const intentResult = await layoutProcessor.processor.detectIntent(input);
      console.log("LLM Intent detected:", intentResult);

      // 2. Find pattern matches
      const patternMatches = this.findPatternMatches(input);
      console.log("Pattern matches found:", patternMatches);

      // Handle direct commands first
      if (patternMatches.length > 0) {
        const directMatch = patternMatches.find((m) => m.priority === 100);
        if (directMatch) {
          const matchedProcessor = this.processors.get(directMatch.processorId);
          if (matchedProcessor) {
            return matchedProcessor.processor.processCommand(input, context);
          }
        }
      }

      // 3. Score results combining LLM and pattern matching
      const scoredResults = await this.scoreResults(
        patternMatches,
        intentResult,
        context
      );
      console.log("Scored results:", scoredResults);

      // 4. Select best processor
      const bestMatch = this.selectBestMatch(scoredResults);
      if (!bestMatch) {
        return null;
      }

      // 5. Execute selected processor
      const selectedProcessor = this.processors.get(bestMatch.processorId);
      if (!selectedProcessor) {
        throw new Error(`Processor ${bestMatch.processorId} not found`);
      }

      return await selectedProcessor.processor.processCommand(input, context);
    } catch (error) {
      console.error("ProcessorRegistry error:", error);
      return null;
    }
  }

  findPatternMatches(input) {
    const matches = [];
    for (const [pattern, config] of this.patterns.entries()) {
      const match = input.toLowerCase().trim().match(pattern);
      if (match) {
        matches.push({
          pattern: pattern,
          ...config,
          matchedValue: match[1] || match[0],
        });
      }
    }
    return matches;
  }

  async scoreResults(patternMatches, intentResult, context) {
    const scoredResults = [];

    for (const match of patternMatches) {
      const processor = this.processors.get(match.processorId);
      if (!processor) continue;

      // Base pattern match score (0.1-0.4)
      let score = 0.1 + (match.priority / 100) * 0.3;

      // Context relevance (0-0.3)
      if (this.isContextRelevant(processor.metadata, context)) {
        score += 0.3;
      }

      // LLM intent alignment (0-0.3)
      if (intentResult && this.intentMatches(intentResult, match)) {
        score += 0.3;
      }

      scoredResults.push({
        processorId: match.processorId,
        pattern: match.pattern,
        score,
        intentAlignment: intentResult?.type,
      });
    }

    return scoredResults.sort((a, b) => b.score - a.score);
  }

  isContextRelevant(metadata, context) {
    if (!context || !context.componentType) return true;
    return (
      metadata.contextTypes.includes("ALL") ||
      metadata.contextTypes.includes(context.componentType)
    );
  }

  intentMatches(intentResult, match) {
    // Map processor types to LLM intent types
    const intentMap = {
      STYLE: ["STYLE_UPDATE", "MODIFY_STYLE"],
      LAYOUT: ["LAYOUT_UPDATE", "MODIFY_LAYOUT", "STYLE_UPDATE"],
      COMPONENT: ["ADD_COMPONENT", "CREATE_COMPONENT"],
    };

    // Special case for layout commands
    if (
      match.type === "LAYOUT" &&
      intentResult.targetProperty === "flexDirection"
    ) {
      return true;
    }

    return intentMap[match.type]?.includes(intentResult.type);
  }

  selectBestMatch(scoredResults) {
    if (!scoredResults.length) return null;

    // If we have a high confidence match, use it
    if (scoredResults[0].score > 0.7) {
      return scoredResults[0];
    }

    // If multiple results are close in score, use processor priority
    const closeMatches = scoredResults.filter(
      (result) => result.score >= scoredResults[0].score - 0.1
    );

    if (closeMatches.length > 1) {
      return closeMatches.reduce((best, current) => {
        const bestProcessor = this.processors.get(best.processorId);
        const currentProcessor = this.processors.get(current.processorId);
        return currentProcessor.metadata.priority >
          bestProcessor.metadata.priority
          ? current
          : best;
      }, closeMatches[0]);
    }

    return scoredResults[0];
  }
}
