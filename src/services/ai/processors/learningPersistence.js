export class LearningPersistence {
  constructor() {
    this.storageKey = 'ai_learning_data';
    this.maxStorageAge = 90 * 24 * 60 * 60 * 1000; // 90 days
  }

  async saveLearningData(data) {
    try {
      const cleanedData = this.cleanOldData(data);
      const serialized = this.serializeLearningData(cleanedData);
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, serialized);
      
      // Optionally save to backend
      await this.syncWithBackend(cleanedData);
    } catch (error) {
      console.error('Error saving learning data:', error);
    }
  }

  cleanOldData(data) {
    const now = Date.now();
    return {
      patterns: new Map(
        Array.from(data.patterns.entries())
          .filter(([_, pattern]) => 
            (now - pattern.lastUsed) < this.maxStorageAge
          )
      ),
      preferences: data.preferences,
      sequences: data.sequences.filter(seq => 
        (now - seq.timestamp) < this.maxStorageAge
      )
    };
  }

  async syncWithBackend(data) {
    // Implement backend synchronization
    // This could be used to share learning across users
  }

  async loadLearningData() {
    try {
      const serialized = localStorage.getItem(this.storageKey);
      return serialized ? this.deserializeLearningData(serialized) : null;
    } catch (error) {
      console.error('Error loading learning data:', error);
      return null;
    }
  }

  serializeLearningData(data) {
    return JSON.stringify({
      patterns: Array.from(data.patterns.entries()),
      preferences: Array.from(data.preferences.entries()),
      sequences: data.sequences,
      timestamp: Date.now()
    });
  }
} 