export const COMMON_WORDS: string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'code', 'type', 'speed', 'flow', 'fast', 'quick', 'focus', 'power', 'skill', 'hand',
  'finger', 'light', 'sound', 'system', 'build', 'create', 'learn', 'logic', 'stream', 'game',
  'future', 'space', 'pixel', 'modern', 'clean', 'matrix', 'engine', 'pulse', 'spark', 'zen'
];

export interface CustomPreset {
  id: string;
  name: string;
  category: 'Quotes' | 'Code' | 'Drills' | 'Literature';
  text: string;
}

export const PRESET_CUSTOM_TEXTS: CustomPreset[] = [
  {
    id: 'quote-1',
    name: 'Perseverance & Mastery',
    category: 'Quotes',
    text: 'Continuous effort, not strength or intelligence, is the key to unlocking our potential. Practice every day with calm focus.'
  },
  {
    id: 'quote-2',
    name: 'Technology & Design',
    category: 'Quotes',
    text: 'Simplicity is the ultimate sophistication. When something is designed with purpose and precision, excellence follows naturally.'
  },
  {
    id: 'code-js',
    name: 'JavaScript / React Snippet',
    category: 'Code',
    text: 'const handleTyping = (event) => { const value = event.target.value; if (value === target) completeSession(); };'
  },
  {
    id: 'code-python',
    name: 'Python Logic Snippet',
    category: 'Code',
    text: 'def calculate_wpm(correct_chars, elapsed_seconds): return round((correct_chars / 5) / (elapsed_seconds / 60))'
  },
  {
    id: 'tongue-twister',
    name: 'Fast Finger Drill',
    category: 'Drills',
    text: 'The quick brown fox jumps over the lazy dog while sleek black keyboards rhythmically click under nimble typing fingers.'
  }
];

/**
 * Generates continuous random words for timed typing tests
 */
export function generateTimedWords(wordCount: number = 60): string {
  const words: string[] = [];
  let lastWord = '';
  for (let i = 0; i < wordCount; i++) {
    let randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    while (randomWord === lastWord) {
      randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    }
    words.push(randomWord);
    lastWord = randomWord;
  }
  return words.join(' ');
}
