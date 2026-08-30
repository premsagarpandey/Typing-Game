import { deepFreeze } from '../utils/security';

export interface LevelInfo {
  readonly title: string;
  readonly category: 'Home Row' | 'Top Row' | 'Bottom Row' | 'Sentences' | 'Numbers & Symbols' | 'Speed Pro';
  readonly instruction: string;
  readonly fingerHint: string;
  readonly samplePattern: readonly string[];
  readonly targetWpm: number;
  readonly targetAccuracy: number;
  readonly timeLimit: number;
}

export interface LevelConfig {
  readonly level: number;
  readonly title: string;
  readonly category: string;
  readonly instruction: string;
  readonly fingerHint: string;
  readonly targetWpm: number;
  readonly targetAccuracy: number;
  readonly timeLimit: number;
  readonly wordBank: readonly string[];
}

export const FINGER_MAP: Record<string, { hand: 'Left' | 'Right'; finger: 'Pinky' | 'Ring' | 'Middle' | 'Index' | 'Thumb'; color: string }> = {
  // Left Hand
  q: { hand: 'Left', finger: 'Pinky', color: 'text-rose-500 bg-rose-500/20 border-rose-500/40' },
  a: { hand: 'Left', finger: 'Pinky', color: 'text-rose-500 bg-rose-500/20 border-rose-500/40' },
  z: { hand: 'Left', finger: 'Pinky', color: 'text-rose-500 bg-rose-500/20 border-rose-500/40' },
  '1': { hand: 'Left', finger: 'Pinky', color: 'text-rose-500 bg-rose-500/20 border-rose-500/40' },

  w: { hand: 'Left', finger: 'Ring', color: 'text-orange-500 bg-orange-500/20 border-orange-500/40' },
  s: { hand: 'Left', finger: 'Ring', color: 'text-orange-500 bg-orange-500/20 border-orange-500/40' },
  x: { hand: 'Left', finger: 'Ring', color: 'text-orange-500 bg-orange-500/20 border-orange-500/40' },
  '2': { hand: 'Left', finger: 'Ring', color: 'text-orange-500 bg-orange-500/20 border-orange-500/40' },

  e: { hand: 'Left', finger: 'Middle', color: 'text-amber-500 bg-amber-500/20 border-amber-500/40' },
  d: { hand: 'Left', finger: 'Middle', color: 'text-amber-500 bg-amber-500/20 border-amber-500/40' },
  c: { hand: 'Left', finger: 'Middle', color: 'text-amber-500 bg-amber-500/20 border-amber-500/40' },
  '3': { hand: 'Left', finger: 'Middle', color: 'text-amber-500 bg-amber-500/20 border-amber-500/40' },

  r: { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  f: { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  v: { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  t: { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  g: { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  b: { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  '4': { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },
  '5': { hand: 'Left', finger: 'Index', color: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40' },

  // Right Hand
  y: { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  u: { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  h: { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  j: { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  n: { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  m: { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  '6': { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },
  '7': { hand: 'Right', finger: 'Index', color: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40' },

  i: { hand: 'Right', finger: 'Middle', color: 'text-blue-500 bg-blue-500/20 border-blue-500/40' },
  k: { hand: 'Right', finger: 'Middle', color: 'text-blue-500 bg-blue-500/20 border-blue-500/40' },
  ',': { hand: 'Right', finger: 'Middle', color: 'text-blue-500 bg-blue-500/20 border-blue-500/40' },
  '8': { hand: 'Right', finger: 'Middle', color: 'text-blue-500 bg-blue-500/20 border-blue-500/40' },

  o: { hand: 'Right', finger: 'Ring', color: 'text-indigo-500 bg-indigo-500/20 border-indigo-500/40' },
  l: { hand: 'Right', finger: 'Ring', color: 'text-indigo-500 bg-indigo-500/20 border-indigo-500/40' },
  '.': { hand: 'Right', finger: 'Ring', color: 'text-indigo-500 bg-indigo-500/20 border-indigo-500/40' },
  '9': { hand: 'Right', finger: 'Ring', color: 'text-indigo-500 bg-indigo-500/20 border-indigo-500/40' },

  p: { hand: 'Right', finger: 'Pinky', color: 'text-purple-500 bg-purple-500/20 border-purple-500/40' },
  ';': { hand: 'Right', finger: 'Pinky', color: 'text-purple-500 bg-purple-500/20 border-purple-500/40' },
  '/': { hand: 'Right', finger: 'Pinky', color: 'text-purple-500 bg-purple-500/20 border-purple-500/40' },
  '0': { hand: 'Right', finger: 'Pinky', color: 'text-purple-500 bg-purple-500/20 border-purple-500/40' },

  ' ': { hand: 'Right', finger: 'Thumb', color: 'text-sky-400 bg-sky-500/20 border-sky-500/40' },
};

export function getFingerInfo(char: string) {
  const lower = char.toLowerCase();
  return FINGER_MAP[lower] || { hand: 'Right', finger: 'Thumb', color: 'text-blue-400 bg-blue-500/20 border-blue-500/40' };
}

const LEVEL_DEFINITIONS: readonly LevelInfo[] = deepFreeze([
  // --- PHASE 1: HOME ROW BASICS (Levels 1 - 10) ---
  {
    title: 'Home Row Anchor: F & J',
    category: 'Home Row',
    instruction: 'Rest Left Index finger on F and Right Index finger on J (feel the small bumps!). Press Space with your thumb.',
    fingerHint: 'Left Index = F | Right Index = J | Thumb = Space',
    samplePattern: ['fff', 'jjj', 'ff', 'jj', 'fj', 'jf', 'fjf', 'jfj', 'ffff', 'jjjj', 'ffjj', 'jjff', 'f', 'j', 'fj', 'jf', 'ff', 'jj'],
    targetWpm: 5,
    targetAccuracy: 60,
    timeLimit: 45,
  },
  {
    title: 'Home Row: D & K',
    category: 'Home Row',
    instruction: 'Place Left Middle finger on D and Right Middle finger on K.',
    fingerHint: 'Left Middle = D | Right Middle = K | Left Index = F | Right Index = J',
    samplePattern: ['ddd', 'kkk', 'dd', 'kk', 'dk', 'kd', 'df', 'jk', 'fd', 'kj', 'ddff', 'kkjj', 'd k', 'f d', 'j k', 'dkfj'],
    targetWpm: 6,
    targetAccuracy: 60,
    timeLimit: 45,
  },
  {
    title: 'Home Row: S & L',
    category: 'Home Row',
    instruction: 'Place Left Ring finger on S and Right Ring finger on L.',
    fingerHint: 'Left Ring = S | Right Ring = L',
    samplePattern: ['sss', 'lll', 'ss', 'll', 'sl', 'ls', 'sld', 'kls', 'sdf', 'jkl', 'sf', 'lj', 'ds', 'lk', 'asdf', 'jkl'],
    targetWpm: 6,
    targetAccuracy: 65,
    timeLimit: 45,
  },
  {
    title: 'Home Row: A & ;',
    category: 'Home Row',
    instruction: 'Place Left Pinky on A and Right Pinky on semicolon (; or l).',
    fingerHint: 'Left Pinky = A | Right Pinky = L / ;',
    samplePattern: ['aaa', 'lll', 'aa', 'll', 'asdf', 'jkl', 'fa', 'ja', 'as', 'la', 'ada', 'ala', 'asdf', 'asdf', 'jkl', 'jkl'],
    targetWpm: 7,
    targetAccuracy: 65,
    timeLimit: 45,
  },
  {
    title: 'Home Row Center Reach: G & H',
    category: 'Home Row',
    instruction: 'Reach Left Index to G, and Right Index to H, then return to F & J.',
    fingerHint: 'Left Index = F, G | Right Index = J, H',
    samplePattern: ['fgf', 'jhj', 'gg', 'hh', 'gh', 'hg', 'fgh', 'gfd', 'hjk', 'jhg', 'asdfg', 'hjkl', 'gash', 'flag', 'half'],
    targetWpm: 8,
    targetAccuracy: 65,
    timeLimit: 45,
  },
  {
    title: 'Full Home Row Drill (ASDF GHJKL)',
    category: 'Home Row',
    instruction: 'Practice fluid motion across all 8 home row keys.',
    fingerHint: 'Keep all 8 fingers resting gently on the Home Row.',
    samplePattern: ['asdf', 'jkl', 'asdfg', 'hjkl', 'fad', 'lad', 'jak', 'gas', 'had', 'hag', 'fall', 'sad', 'glad', 'dash'],
    targetWpm: 9,
    targetAccuracy: 70,
    timeLimit: 45,
  },
  {
    title: 'Home Row Real Words (Level 1)',
    category: 'Home Row',
    instruction: 'Type real 2 & 3 letter words made only from home row keys!',
    fingerHint: 'Words: dad, sad, lad, ask, had, gas, all, fall',
    samplePattern: ['dad', 'sad', 'lad', 'fad', 'ask', 'all', 'had', 'has', 'gas', 'fall', 'hall', 'flag', 'glad', 'flash'],
    targetWpm: 10,
    targetAccuracy: 70,
    timeLimit: 40,
  },
  {
    title: 'Home Row Real Words (Level 2)',
    category: 'Home Row',
    instruction: 'Practice slightly longer home row words.',
    fingerHint: 'Words: flask, salad, glass, alfalfa, shall',
    samplePattern: ['flask', 'salad', 'glass', 'shall', 'falls', 'flags', 'slash', 'flash', 'dadas', 'skald', 'half', 'glass'],
    targetWpm: 11,
    targetAccuracy: 70,
    timeLimit: 40,
  },
  {
    title: 'Home Row Short Phrases',
    category: 'Home Row',
    instruction: 'Type simple phrases using only home row keys.',
    fingerHint: 'Keep your rhythm smooth and steady.',
    samplePattern: ['a sad lad', 'a glad dad', 'had a salad', 'all ask glad flags', 'fall as all ask', 'dad has a glass'],
    targetWpm: 12,
    targetAccuracy: 70,
    timeLimit: 40,
  },
  {
    title: 'Home Row Mastery Test',
    category: 'Home Row',
    instruction: 'Complete the Home Row test to unlock the Top Row!',
    fingerHint: 'Take your time. Accuracy is more important than speed.',
    samplePattern: ['a glad lad has a glass flask', 'all dads ask for fresh salad', 'glad flags fall as lads dash'],
    targetWpm: 13,
    targetAccuracy: 75,
    timeLimit: 40,
  },

  // --- PHASE 2: TOP ROW KEYS (Levels 11 - 20) ---
  {
    title: 'Top Row: E & I',
    category: 'Top Row',
    instruction: 'Reach Left Middle finger UP to E, and Right Middle finger UP to I.',
    fingerHint: 'Left Middle = E (up from D) | Right Middle = I (up from K)',
    samplePattern: ['ded', 'kik', 'ee', 'ii', 'ei', 'ie', 'fee', 'die', 'see', 'lie', 'kid', 'lid', 'file', 'life', 'leaf', 'self'],
    targetWpm: 12,
    targetAccuracy: 70,
    timeLimit: 40,
  },
  {
    title: 'Top Row: R & U',
    category: 'Top Row',
    instruction: 'Reach Left Index UP to R, and Right Index UP to U.',
    fingerHint: 'Left Index = R (up from F) | Right Index = U (up from J)',
    samplePattern: ['frf', 'juj', 'rr', 'uu', 'ru', 'ur', 'fur', 'run', 'red', 'rub', 'rug', 'user', 'rule', 'rush', 'ride', 'sure'],
    targetWpm: 13,
    targetAccuracy: 70,
    timeLimit: 40,
  },
  {
    title: 'Top Row: T & Y',
    category: 'Top Row',
    instruction: 'Reach Left Index UP to T, and Right Index UP to Y.',
    fingerHint: 'Left Index = T (up-right from F) | Right Index = Y (up-left from J)',
    samplePattern: ['ftf', 'jyj', 'tt', 'yy', 'ty', 'yt', 'try', 'tea', 'yet', 'tie', 'you', 'stay', 'they', 'that', 'city', 'duty'],
    targetWpm: 14,
    targetAccuracy: 70,
    timeLimit: 40,
  },
  {
    title: 'Top Row: W & O',
    category: 'Top Row',
    instruction: 'Reach Left Ring UP to W, and Right Ring UP to O.',
    fingerHint: 'Left Ring = W (up from S) | Right Ring = O (up from L)',
    samplePattern: ['sws', 'lol', 'ww', 'oo', 'wo', 'ow', 'who', 'owl', 'raw', 'cow', 'how', 'wow', 'wolf', 'wood', 'work', 'food'],
    targetWpm: 14,
    targetAccuracy: 72,
    timeLimit: 40,
  },
  {
    title: 'Top Row: Q & P',
    category: 'Top Row',
    instruction: 'Reach Left Pinky UP to Q, and Right Pinky UP to P.',
    fingerHint: 'Left Pinky = Q (up from A) | Right Pinky = P (up from ;)',
    samplePattern: ['aqa', 'p;p', 'qq', 'pp', 'qp', 'pq', 'pay', 'pie', 'lip', 'cup', 'pet', 'quit', 'quiet', 'quick', 'pool', 'play'],
    targetWpm: 15,
    targetAccuracy: 72,
    timeLimit: 40,
  },
  {
    title: 'Top + Home Row Common Words',
    category: 'Top Row',
    instruction: 'Practice combining home row and top row keys.',
    fingerHint: 'Keep returning your fingers to the home row after every key press.',
    samplePattern: ['help', 'keep', 'hope', 'walk', 'jump', 'look', 'feel', 'tree', 'like', 'love', 'come', 'play', 'take', 'make'],
    targetWpm: 16,
    targetAccuracy: 74,
    timeLimit: 40,
  },
  {
    title: 'Most Common 3-Letter Words',
    category: 'Top Row',
    instruction: 'Type the most frequently used 3-letter words in English.',
    fingerHint: 'Words: the, and, for, are, but, not, you, all, any, can',
    samplePattern: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'her', 'was', 'one', 'our', 'out', 'day'],
    targetWpm: 17,
    targetAccuracy: 75,
    timeLimit: 40,
  },
  {
    title: 'Most Common 4-Letter Words',
    category: 'Top Row',
    instruction: 'Build muscle memory with common 4-letter English words.',
    fingerHint: 'Words: time, with, this, that, from, they, have, more',
    samplePattern: ['time', 'with', 'this', 'that', 'from', 'they', 'have', 'more', 'some', 'like', 'make', 'know', 'take', 'good'],
    targetWpm: 18,
    targetAccuracy: 75,
    timeLimit: 40,
  },
  {
    title: 'Simple Top-Row Sentences',
    category: 'Top Row',
    instruction: 'Type complete beginner sentences without looking at the keyboard!',
    fingerHint: 'Look at the screen, not at your keyboard.',
    samplePattern: ['the cat is on the mat', 'we see the red tree', 'they like to run and play', 'you can walk to school'],
    targetWpm: 19,
    targetAccuracy: 76,
    timeLimit: 40,
  },
  {
    title: 'Top Row Mastery Test',
    category: 'Top Row',
    instruction: 'Complete the Top Row test to unlock the Bottom Row!',
    fingerHint: 'Aim for smooth, steady rhythm.',
    samplePattern: ['you can learn to type fast with good practice every single day', 'look at the screen and keep your fingers on home row'],
    targetWpm: 20,
    targetAccuracy: 78,
    timeLimit: 40,
  },

  // --- PHASE 3: BOTTOM ROW KEYS (Levels 21 - 30) ---
  {
    title: 'Bottom Row: V & M',
    category: 'Bottom Row',
    instruction: 'Reach Left Index DOWN to V, and Right Index DOWN to M.',
    fingerHint: 'Left Index = V (down from F) | Right Index = M (down from J)',
    samplePattern: ['fvf', 'jmj', 'vv', 'mm', 'vm', 'mv', 'move', 'van', 'make', 'view', 'more', 'much', 'give', 'love', 'farm', 'home'],
    targetWpm: 18,
    targetAccuracy: 75,
    timeLimit: 40,
  },
  {
    title: 'Bottom Row: B & N',
    category: 'Bottom Row',
    instruction: 'Reach Left Index DOWN to B, and Right Index DOWN to N.',
    fingerHint: 'Left Index = B (down-right from F) | Right Index = N (down-left from J)',
    samplePattern: ['fbf', 'jnj', 'bb', 'nn', 'bn', 'nb', 'boat', 'barn', 'bank', 'name', 'nine', 'neck', 'bear', 'born', 'bird', 'note'],
    targetWpm: 19,
    targetAccuracy: 75,
    timeLimit: 40,
  },
  {
    title: 'Bottom Row: C & ,',
    category: 'Bottom Row',
    instruction: 'Reach Left Middle DOWN to C, and Right Middle DOWN to comma (,).',
    fingerHint: 'Left Middle = C (down from D) | Right Middle = , (down from K)',
    samplePattern: ['dcd', 'k,k', 'cc', ',,', 'cat', 'cup', 'cake', 'cool', 'race', 'fact', 'city', 'coin', 'call', 'cook', 'camp', 'rice'],
    targetWpm: 20,
    targetAccuracy: 76,
    timeLimit: 40,
  },
  {
    title: 'Bottom Row: X & Z',
    category: 'Bottom Row',
    instruction: 'Reach Left Ring DOWN to X, and Left Pinky DOWN to Z.',
    fingerHint: 'Left Ring = X (down from S) | Left Pinky = Z (down from A)',
    samplePattern: ['sxs', 'aza', 'xx', 'zz', 'xz', 'box', 'fox', 'six', 'wax', 'mix', 'size', 'zero', 'zone', 'next', 'exam', 'taxi'],
    targetWpm: 20,
    targetAccuracy: 76,
    timeLimit: 40,
  },
  {
    title: 'All Three Rows: Common Words 1',
    category: 'Bottom Row',
    instruction: 'Type words utilizing the full alphabet across all three rows!',
    fingerHint: 'Words: apple, bread, chair, dance, earth, fruit, grass',
    samplePattern: ['apple', 'bread', 'chair', 'dance', 'earth', 'fruit', 'grass', 'heart', 'light', 'music', 'night', 'water'],
    targetWpm: 22,
    targetAccuracy: 78,
    timeLimit: 40,
  },
  {
    title: '100 Most Common Words (Part 1)',
    category: 'Bottom Row',
    instruction: 'Strengthen typing speed on the 100 most frequent English words.',
    fingerHint: 'Words: about, after, again, below, could, every, first, great',
    samplePattern: ['about', 'after', 'again', 'below', 'could', 'every', 'first', 'great', 'house', 'large', 'small', 'water'],
    targetWpm: 23,
    targetAccuracy: 78,
    timeLimit: 40,
  },
  {
    title: '100 Most Common Words (Part 2)',
    category: 'Bottom Row',
    instruction: 'Part 2 of high frequency typing vocabulary.',
    fingerHint: 'Words: never, place, point, right, sound, still, think, under',
    samplePattern: ['never', 'place', 'point', 'right', 'sound', 'still', 'think', 'under', 'water', 'where', 'world', 'through'],
    targetWpm: 24,
    targetAccuracy: 80,
    timeLimit: 40,
  },
  {
    title: 'Everyday Sentences (Part 1)',
    category: 'Bottom Row',
    instruction: 'Type complete natural sentences across all 26 letters.',
    fingerHint: 'Keep a consistent pace. Do not rush.',
    samplePattern: ['make it a habit to practice typing each day without looking at the keys', 'speed will come naturally once your fingers learn the correct positions'],
    targetWpm: 25,
    targetAccuracy: 80,
    timeLimit: 40,
  },
  {
    title: 'Everyday Sentences (Part 2)',
    category: 'Bottom Row',
    instruction: 'Type fluent natural English sentences.',
    fingerHint: 'Relax your shoulders and breathe evenly.',
    samplePattern: ['the quick brown fox jumps over the lazy dog near the river bank', 'typing is a powerful skill that will save you hundreds of hours every year'],
    targetWpm: 26,
    targetAccuracy: 82,
    timeLimit: 40,
  },
  {
    title: 'Full Keyboard Novice Graduation',
    category: 'Bottom Row',
    instruction: 'Graduation test for all lowercase alphabetic keys!',
    fingerHint: 'Congratulations on mastering all letter keys! Target: 28 WPM.',
    samplePattern: ['pack my box with five dozen liquor jugs and deliver them by evening', 'the five boxing wizards jump quickly across the calm blue lake'],
    targetWpm: 28,
    targetAccuracy: 82,
    timeLimit: 40,
  },

  // --- PHASE 4: SENTENCES, CAPITALS & NUMBERS (Levels 31 - 40) ---
  {
    title: 'Capital Letters (Shift Key)',
    category: 'Sentences',
    instruction: 'Use opposite pinky on Shift while typing capital letters (e.g. Right Shift for A, Left Shift for P).',
    fingerHint: 'Left Shift for Right Hand Keys | Right Shift for Left Hand Keys',
    samplePattern: ['Alex', 'Bob', 'Clara', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'India', 'Japan', 'London', 'Paris', 'Tokyo', 'Rome'],
    targetWpm: 25,
    targetAccuracy: 80,
    timeLimit: 40,
  },
  {
    title: 'Sentences with Punctuation (. , !)',
    category: 'Sentences',
    instruction: 'Type sentences with capital letters, commas, and periods.',
    fingerHint: 'Press Space after every punctuation mark.',
    samplePattern: ['The sun rises in the east, and birds sing sweet songs.', 'Learning to type well is exciting, fun, and deeply rewarding.'],
    targetWpm: 27,
    targetAccuracy: 82,
    timeLimit: 40,
  },
  {
    title: 'Apostrophes & Contractions',
    category: 'Sentences',
    instruction: 'Practice contractions: don\'t, can\'t, it\'s, you\'re, we\'ll.',
    fingerHint: 'Reach Right Pinky to the apostrophe key (\').',
    samplePattern: ['Don\'t worry, you\'re doing great! It\'s easy once you practice.', 'We\'ll always support each other as we learn new skills.'],
    targetWpm: 28,
    targetAccuracy: 82,
    timeLimit: 40,
  },
  {
    title: 'Number Row: 1 2 3 4 5',
    category: 'Numbers & Symbols',
    instruction: 'Reach Left fingers up to the number row (1=Pinky, 2=Ring, 3=Middle, 4/5=Index).',
    fingerHint: 'Left Hand Numbers: 1, 2, 3, 4, 5',
    samplePattern: ['1 2 3 4 5', 'room 12', 'team 34', 'order 51', 'page 23', 'year 2025', 'step 123', 'box 45'],
    targetWpm: 22,
    targetAccuracy: 80,
    timeLimit: 40,
  },
  {
    title: 'Number Row: 6 7 8 9 0',
    category: 'Numbers & Symbols',
    instruction: 'Reach Right fingers up to the number row (6/7=Index, 8=Middle, 9=Ring, 0=Pinky).',
    fingerHint: 'Right Hand Numbers: 6, 7, 8, 9, 0',
    samplePattern: ['6 7 8 9 0', 'item 78', 'code 90', 'level 67', 'score 890', 'call 100', 'route 66', 'flight 789'],
    targetWpm: 23,
    targetAccuracy: 80,
    timeLimit: 40,
  },
  {
    title: 'Mixed Numbers and Text',
    category: 'Numbers & Symbols',
    instruction: 'Type natural sentences containing dates, numbers, and quantities.',
    fingerHint: 'Keep your hands centered on home row.',
    samplePattern: ['In 2026, over 100 students completed all 50 levels of the typing course.', 'Chapter 7 has 45 pages and 12 illustrated diagrams.'],
    targetWpm: 28,
    targetAccuracy: 84,
    timeLimit: 40,
  },
  {
    title: 'Common Symbols & Code Chars',
    category: 'Numbers & Symbols',
    instruction: 'Practice typing brackets, equals, plus, and dashes: ( ) [ ] + - =',
    fingerHint: 'Use Shift + number keys for symbols.',
    samplePattern: ['total = x + y', 'score = 100 - 5', 'item[0] = 50', 'price = $25', 'ratio = 10 / 2', 'status = (ready)'],
    targetWpm: 25,
    targetAccuracy: 82,
    timeLimit: 40,
  },
  {
    title: 'Famous Inspirational Quotes',
    category: 'Sentences',
    instruction: 'Type timeless wisdom with perfect accuracy.',
    fingerHint: 'Accuracy is your priority; speed is a natural byproduct.',
    samplePattern: ['Practice makes perfect, and persistence overcomes any obstacle.', 'A journey of a thousand miles begins with a single step.'],
    targetWpm: 32,
    targetAccuracy: 85,
    timeLimit: 40,
  },
  {
    title: 'Conversational Paragraphs',
    category: 'Sentences',
    instruction: 'Type continuous fluid paragraphs.',
    fingerHint: 'Maintain steady cadence and smooth breathing.',
    samplePattern: ['Learning touch typing gives you superpower speed and lets your thoughts flow directly onto the computer screen.'],
    targetWpm: 35,
    targetAccuracy: 86,
    timeLimit: 40,
  },
  {
    title: 'Intermediate Typing Certificate Test',
    category: 'Sentences',
    instruction: 'Achieve 38 WPM with 88% accuracy on mixed text!',
    fingerHint: 'You have reached intermediate typist status!',
    samplePattern: ['The future belongs to those who learn rapidly, adapt continuously, and master the tools of the modern digital age.'],
    targetWpm: 38,
    targetAccuracy: 88,
    timeLimit: 40,
  },

  // --- PHASE 5: SPEED & PROFESSIONAL FLUENCY (Levels 41 - 50) ---
  {
    title: 'Fast Word Bursts (Level 41)',
    category: 'Speed Pro',
    instruction: 'Short high-speed word bursts to train finger reflex agility.',
    fingerHint: 'Type whole words in single rhythmic strokes.',
    samplePattern: ['rapid', 'quick', 'flash', 'speed', 'swift', 'burst', 'glide', 'stream', 'hyper', 'pulse', 'tempo', 'boost'],
    targetWpm: 42,
    targetAccuracy: 88,
    timeLimit: 35,
  },
  {
    title: 'Technology & Computing Vocabulary',
    category: 'Speed Pro',
    instruction: 'Type professional programming and technology terms.',
    fingerHint: 'Words: software, hardware, compiler, network, database',
    samplePattern: ['software', 'hardware', 'compiler', 'network', 'database', 'algorithm', 'interface', 'frontend', 'security', 'framework'],
    targetWpm: 45,
    targetAccuracy: 90,
    timeLimit: 35,
  },
  {
    title: 'Professional Business Correspondence',
    category: 'Speed Pro',
    instruction: 'Type professional emails and workplace communications.',
    fingerHint: 'Clear, crisp, professional phrasing.',
    samplePattern: ['Thank you for your prompt response regarding our upcoming project milestone. We look forward to our meeting on Monday.'],
    targetWpm: 48,
    targetAccuracy: 90,
    timeLimit: 35,
  },
  {
    title: 'Advanced Prose & Literature',
    category: 'Speed Pro',
    instruction: 'Type complex literary sentences with rich vocabulary.',
    fingerHint: 'Keep your eyes 2-3 words ahead of where your fingers are typing.',
    samplePattern: ['The serene tranquility of the morning forest was illuminated by cascading beams of radiant golden sunlight.'],
    targetWpm: 52,
    targetAccuracy: 90,
    timeLimit: 35,
  },
  {
    title: 'Developer Code & Markdown',
    category: 'Speed Pro',
    instruction: 'Type realistic code snippets and Markdown documentation.',
    fingerHint: 'Type code syntax accurately without pausing.',
    samplePattern: ['const calculateSpeed = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));'],
    targetWpm: 55,
    targetAccuracy: 92,
    timeLimit: 35,
  },
  {
    title: 'Speed Sprint: 60 WPM Challenge',
    category: 'Speed Pro',
    instruction: 'Push your typing velocity beyond 60 Words Per Minute!',
    fingerHint: 'Focus on flow and relaxation.',
    samplePattern: ['Consistency and deliberate practice will transform you into an exceptionally fast and accurate keyboard typist.'],
    targetWpm: 60,
    targetAccuracy: 92,
    timeLimit: 30,
  },
  {
    title: 'Speed Sprint: 65 WPM Challenge',
    category: 'Speed Pro',
    instruction: 'High velocity challenge for advanced typists.',
    fingerHint: 'Eliminate hesitation between words.',
    samplePattern: ['True mastery is achieved when your fingers move effortlessly without conscious thought, translating ideas directly into text.'],
    targetWpm: 65,
    targetAccuracy: 93,
    timeLimit: 30,
  },
  {
    title: 'Speed Sprint: 70 WPM Challenge',
    category: 'Speed Pro',
    instruction: 'Elite speed challenge: 70 WPM benchmark.',
    fingerHint: 'Stay completely relaxed. Tension slows you down.',
    samplePattern: ['Building muscle memory requires daily discipline and consistent dedication to proper touch typing finger placement.'],
    targetWpm: 70,
    targetAccuracy: 94,
    timeLimit: 30,
  },
  {
    title: 'Speed Sprint: 78 WPM Challenge',
    category: 'Speed Pro',
    instruction: 'Expert tier typing speed challenge.',
    fingerHint: 'Breathe smoothly and maintain peak focus.',
    samplePattern: ['The highest level of typing performance is a state of deep flow where rhythm, precision, and velocity harmonize together.'],
    targetWpm: 78,
    targetAccuracy: 94,
    timeLimit: 30,
  },
  {
    title: 'Grand Master Championship (Level 50)',
    category: 'Speed Pro',
    instruction: 'The ultimate Typlix Grand Master test! 85+ WPM with 95% Accuracy.',
    fingerHint: 'Showcase your total mastery of all keys on the keyboard!',
    samplePattern: ['Congratulations on reaching Level 50! You have mastered touch typing across the entire keyboard with phenomenal speed and supreme precision.'],
    targetWpm: 85,
    targetAccuracy: 95,
    timeLimit: 30,
  },
]);

export function getLevelConfig(level: number): LevelConfig {
  const currentLevel = Math.min(Math.max(1, Math.floor(level || 1)), 50);
  const def = LEVEL_DEFINITIONS[currentLevel - 1] || LEVEL_DEFINITIONS[0];

  return deepFreeze({
    level: currentLevel,
    title: def.title,
    category: def.category,
    instruction: def.instruction,
    fingerHint: def.fingerHint,
    targetWpm: def.targetWpm,
    targetAccuracy: def.targetAccuracy,
    timeLimit: def.timeLimit,
    wordBank: def.samplePattern,
  });
}

export function generateLevelText(levelConfig: LevelConfig, wordCount: number = 20): string {
  const { wordBank } = levelConfig;
  if (!wordBank || wordBank.length === 0) return 'f j f j';

  // If wordBank contains full sentences (items with multiple words), join them directly or pick
  const isSentenceBank = wordBank.some((item) => item.includes(' '));
  if (isSentenceBank) {
    // Pick sentences
    const sentences: string[] = [];
    const count = Math.min(Math.max(2, Math.floor(wordCount / 6)), 5);
    for (let i = 0; i < count; i++) {
      sentences.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
    }
    return sentences.join(' ');
  }

  // Otherwise pick individual drill words / patterns
  const count = Math.min(Math.max(10, Math.floor(wordCount)), 50);
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    selected.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  return selected.join(' ');
}
