import { deepFreeze } from '../utils/security';

export interface LevelConfig {
  readonly level: number;
  readonly targetWpm: number;
  readonly targetAccuracy: number;
  readonly timeLimit: number;
  readonly wordBank: readonly string[];
}

const easyWords = deepFreeze([
  "cat", "dog", "run", "sun", "fun", "car", "map", "tap", "hat", "bat", "sit", "bit", "kit", "fit",
  "let", "get", "set", "met", "net", "pet", "is", "it", "in", "on", "up", "to", "do", "go", "no", 
  "so", "he", "we", "me", "be", "art", "boy", "cow", "day", "eye", "far", "guy", "hot", "ice", "job"
]);

const mediumWords = deepFreeze([
  "house", "mouse", "apple", "happy", "party", "smart", "start", "heart", "earth", "water", 
  "fire", "light", "night", "right", "might", "sight", "tight", "flight", "bright", "white", 
  "black", "green", "brown", "color", "music", "paper", "pencil", "school", "ability", "accept",
  "action", "almost", "always", "animal", "answer", "anyone", "appear", "around", "artist"
]);

const hardWords = deepFreeze([
  "elephant", "computer", "keyboard", "monitor", "building", "hospital", "mountain", "language", 
  "question", "business", "national", "children", "important", "something", "different", "possible", 
  "remember", "together", "understand", "experience", "development", "technology", "information",
  "administration", "agreement", "American", "analysis", "approach", "beautiful", "community"
]);

export function getLevelConfig(level: number): LevelConfig {
  // Cap level at 50 for max difficulty and minimum 1
  const currentLevel = Math.min(Math.max(1, Math.floor(level || 1)), 50);
  
  // WPM starts at 15 for level 1, increases by 1.5 per level up to 88 at level 50
  const targetWpm = Math.floor(15 + (currentLevel - 1) * 1.5);
  
  // Accuracy starts at 80% for level 1, increases by 0.3 per level up to ~95%
  const targetAccuracy = Math.floor(80 + (currentLevel - 1) * 0.3);
  
  // Standard time limit
  const timeLimit = 30;
  
  let wordBank: readonly string[] = [];
  
  // Determine word mixture based on level
  if (currentLevel <= 10) {
    wordBank = easyWords;
  } else if (currentLevel <= 25) {
    wordBank = deepFreeze([...easyWords, ...mediumWords]);
  } else if (currentLevel <= 40) {
    wordBank = deepFreeze([...mediumWords, ...hardWords]);
  } else {
    wordBank = deepFreeze([...mediumWords, ...hardWords, ...hardWords]);
  }
  
  return deepFreeze({
    level: currentLevel,
    targetWpm,
    targetAccuracy,
    timeLimit,
    wordBank
  });
}

export function generateLevelText(levelConfig: LevelConfig, wordCount: number = 30): string {
  const { wordBank } = levelConfig;
  const count = Math.min(Math.max(5, Math.floor(wordCount)), 100);
  const selectedWords: string[] = [];
  for (let i = 0; i < count; i++) {
    selectedWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  return selectedWords.join(' ');
}

