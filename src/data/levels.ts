export interface LevelConfig {
  level: number;
  targetWpm: number;
  targetAccuracy: number;
  timeLimit: number;
  wordBank: string[];
}

const easyWords = [
  "cat", "dog", "run", "sun", "fun", "car", "map", "tap", "hat", "bat", "sit", "bit", "kit", "fit",
  "let", "get", "set", "met", "net", "pet", "is", "it", "in", "on", "up", "to", "do", "go", "no", 
  "so", "he", "we", "me", "be", "art", "boy", "cow", "day", "eye", "far", "guy", "hot", "ice", "job"
];

const mediumWords = [
  "house", "mouse", "apple", "happy", "party", "smart", "start", "heart", "earth", "water", 
  "fire", "light", "night", "right", "might", "sight", "tight", "flight", "bright", "white", 
  "black", "green", "brown", "color", "music", "paper", "pencil", "school", "ability", "accept",
  "action", "almost", "always", "animal", "answer", "anyone", "appear", "around", "artist"
];

const hardWords = [
  "elephant", "computer", "keyboard", "monitor", "building", "hospital", "mountain", "language", 
  "question", "business", "national", "children", "important", "something", "different", "possible", 
  "remember", "together", "understand", "experience", "development", "technology", "information",
  "administration", "agreement", "American", "analysis", "approach", "beautiful", "community"
];

export function getLevelConfig(level: number): LevelConfig {
  // Cap level at 50 for max difficulty
  const currentLevel = Math.min(Math.max(1, level), 50);
  
  // WPM starts at 15 for level 1, increases by 1.5 per level up to 88 at level 50
  const targetWpm = Math.floor(15 + (currentLevel - 1) * 1.5);
  
  // Accuracy starts at 80% for level 1, increases by 0.3 per level up to ~95%
  const targetAccuracy = Math.floor(80 + (currentLevel - 1) * 0.3);
  
  // Standard time limit
  const timeLimit = 30;
  
  let wordBank: string[] = [];
  
  // Determine word mixture based on level
  if (currentLevel <= 10) {
    // Levels 1-10: Easy only
    wordBank = easyWords;
  } else if (currentLevel <= 25) {
    // Levels 11-25: Easy and Medium mix
    wordBank = [...easyWords, ...mediumWords];
  } else if (currentLevel <= 40) {
    // Levels 26-40: Medium and Hard mix
    wordBank = [...mediumWords, ...hardWords];
  } else {
    // Levels 41-50: Predominantly Hard with some Medium
    wordBank = [...mediumWords, ...hardWords, ...hardWords];
  }
  
  return {
    level: currentLevel,
    targetWpm,
    targetAccuracy,
    timeLimit,
    wordBank
  };
}

export function generateLevelText(levelConfig: LevelConfig, wordCount: number = 30): string {
  const { wordBank } = levelConfig;
  const selectedWords = [];
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  return selectedWords.join(' ');
}
