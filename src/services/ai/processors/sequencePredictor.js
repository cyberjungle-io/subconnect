export class SequencePredictor {
  constructor(context) {
    this.context = context;
    this.sequences = [];
    this.maxSequenceLength = 5;
  }

  recordSequence(command) {
    this.sequences.push({
      command,
      timestamp: Date.now(),
      context: this.captureContext()
    });

    if (this.sequences.length > this.maxSequenceLength) {
      this.sequences.shift();
    }
  }

  predictNextActions(currentCommand) {
    const similarSequences = this.findSimilarSequences(currentCommand);
    const predictions = this.analyzePredictions(similarSequences);
    
    return predictions.map(prediction => ({
      command: this.generatePredictedCommand(prediction),
      confidence: this.calculateConfidence(prediction),
      context: prediction.context
    }));
  }

  analyzePredictions(sequences) {
    if (!sequences.length) return [];

    // Group similar commands and calculate their frequency
    const commandGroups = sequences.reduce((groups, seq) => {
      const key = this.getCommandKey(seq.command);
      if (!groups[key]) {
        groups[key] = {
          count: 0,
          command: seq.command,
          context: seq.context,
          lastUsed: seq.timestamp
        };
      }
      groups[key].count++;
      groups[key].lastUsed = Math.max(groups[key].lastUsed, seq.timestamp);
      return groups;
    }, {});

    // Convert to array and sort by frequency and recency
    return Object.values(commandGroups)
      .sort((a, b) => {
        const scoreA = a.count + (a.lastUsed / Date.now());
        const scoreB = b.count + (b.lastUsed / Date.now());
        return scoreB - scoreA;
      });
  }

  findSimilarSequences(currentCommand) {
    return this.sequences
      .filter(seq => this.calculateSequenceSimilarity(seq.command, currentCommand) > 0.7)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  calculateSequenceSimilarity(seq1, seq2) {
    if (!seq1 || !seq2) return 0;

    const compareFields = [
      'type',
      'componentType',
      'parentId'
    ];

    const matches = compareFields.filter(field => 
      seq1[field] === seq2[field]
    ).length;

    return matches / compareFields.length;
  }

  generatePredictedCommand(prediction) {
    return {
      ...prediction.command,
      predicted: true,
      frequency: prediction.count
    };
  }

  calculateConfidence(prediction) {
    const recencyScore = Math.min(
      (Date.now() - prediction.lastUsed) / (24 * 60 * 60 * 1000), // 24 hours
      1
    );
    const frequencyScore = Math.min(prediction.count / 5, 1); // Max 5 occurrences

    return (recencyScore * 0.4) + (frequencyScore * 0.6);
  }

  captureContext() {
    return {
      selectedComponents: this.context.selectedIds || [],
      recentCommands: this.context.history?.slice(-3) || [],
      timestamp: Date.now()
    };
  }

  getCommandKey(command) {
    return `${command.type}_${command.componentType}_${command.parentId || 'root'}`;
  }
} 