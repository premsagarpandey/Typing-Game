export type KeyboardLayoutId = 'qwerty' | 'dvorak' | 'colemak' | 'azerty';

export interface KeyItem {
  key: string;
  shift?: string;
}

export interface FingerInfo {
  hand: 'Left' | 'Right';
  finger: 'Pinky' | 'Ring' | 'Middle' | 'Index' | 'Thumb';
  color: string;
}

export interface KeyboardLayoutDef {
  id: KeyboardLayoutId;
  name: string;
  shortDesc: string;
  description: string;
  homeRowLeft: string[];
  homeRowRight: string[];
  homeBumps: string[];
  rows: KeyItem[][];
  fingerMap: Record<string, FingerInfo>;
}

// Color presets for touch typing fingers
const COLORS = {
  leftPinky: 'text-rose-500 bg-rose-500/20 border-rose-500/40',
  leftRing: 'text-orange-500 bg-orange-500/20 border-orange-500/40',
  leftMiddle: 'text-amber-500 bg-amber-500/20 border-amber-500/40',
  leftIndex: 'text-emerald-500 bg-emerald-500/20 border-emerald-500/40',
  rightIndex: 'text-cyan-500 bg-cyan-500/20 border-cyan-500/40',
  rightMiddle: 'text-blue-500 bg-blue-500/20 border-blue-500/40',
  rightRing: 'text-indigo-500 bg-indigo-500/20 border-indigo-500/40',
  rightPinky: 'text-purple-500 bg-purple-500/20 border-purple-500/40',
  thumb: 'text-sky-400 bg-sky-500/20 border-sky-500/40',
};

// 1. QWERTY (Standard US)
const QWERTY_ROWS: KeyItem[][] = [
  [
    { key: '`', shift: '~' }, { key: '1', shift: '!' }, { key: '2', shift: '@' }, { key: '3', shift: '#' },
    { key: '4', shift: '$' }, { key: '5', shift: '%' }, { key: '6', shift: '^' }, { key: '7', shift: '&' },
    { key: '8', shift: '*' }, { key: '9', shift: '(' }, { key: '0', shift: ')' }, { key: '-', shift: '_' },
    { key: '=', shift: '+' },
  ],
  [
    { key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' }, { key: 't' },
    { key: 'y' }, { key: 'u' }, { key: 'i' }, { key: 'o' }, { key: 'p' },
    { key: '[' }, { key: ']' },
  ],
  [
    { key: 'a' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' },
    { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }, { key: ';' },
    { key: "'" },
  ],
  [
    { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' },
    { key: 'n' }, { key: 'm' }, { key: ',' }, { key: '.' }, { key: '/' },
  ],
];

const QWERTY_FINGER_MAP: Record<string, FingerInfo> = {
  // Left Hand
  '`': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '~': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '1': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '!': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  q: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  a: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  z: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },

  '2': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  '@': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  w: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  s: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  x: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },

  '3': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  '#': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  e: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  d: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  c: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },

  '4': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '$': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '5': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '%': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  r: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  t: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  f: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  g: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  v: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  b: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },

  // Right Hand
  '6': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '^': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '7': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '&': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  y: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  u: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  h: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  j: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  n: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  m: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },

  '8': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  '*': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  i: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  k: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  ',': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  '<': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },

  '9': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  '(': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  o: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  l: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  '.': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  '>': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },

  '0': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ')': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '-': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '_': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '=': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '+': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  p: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '[': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '{': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ']': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '}': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ';': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ':': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  "'": { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '"': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '/': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '?': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },

  ' ': { hand: 'Right', finger: 'Thumb', color: COLORS.thumb },
};

// 2. DVORAK (Simplified)
const DVORAK_ROWS: KeyItem[][] = [
  [
    { key: '`', shift: '~' }, { key: '1', shift: '!' }, { key: '2', shift: '@' }, { key: '3', shift: '#' },
    { key: '4', shift: '$' }, { key: '5', shift: '%' }, { key: '6', shift: '^' }, { key: '7', shift: '&' },
    { key: '8', shift: '*' }, { key: '9', shift: '(' }, { key: '0', shift: ')' }, { key: '[', shift: '{' },
    { key: ']', shift: '}' },
  ],
  [
    { key: "'", shift: '"' }, { key: ',', shift: '<' }, { key: '.', shift: '>' }, { key: 'p' }, { key: 'y' },
    { key: 'f' }, { key: 'g' }, { key: 'c' }, { key: 'r' }, { key: 'l' },
    { key: '/', shift: '?' }, { key: '=', shift: '+' },
  ],
  [
    { key: 'a' }, { key: 'o' }, { key: 'e' }, { key: 'u' }, { key: 'i' },
    { key: 'd' }, { key: 'h' }, { key: 't' }, { key: 'n' }, { key: 's' },
    { key: '-', shift: '_' },
  ],
  [
    { key: ';' }, { key: 'q' }, { key: 'j' }, { key: 'k' }, { key: 'x' },
    { key: 'b' }, { key: 'm' }, { key: 'w' }, { key: 'v' }, { key: 'z' },
  ],
];

const DVORAK_FINGER_MAP: Record<string, FingerInfo> = {
  // Left Hand
  '`': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '1': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  "'": { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '"': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  a: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  ';': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },

  '2': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  ',': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  '<': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  o: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  q: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },

  '3': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  '.': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  '>': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  e: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  j: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },

  '4': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '5': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  p: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  y: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  u: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  i: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  k: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  x: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },

  // Right Hand
  '6': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '7': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  f: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  g: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  d: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  h: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  b: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  m: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },

  '8': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  c: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  t: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  w: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },

  '9': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  r: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  n: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  v: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },

  '0': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '[': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '{': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ']': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '}': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  l: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '/': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '?': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '=': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '+': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  s: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '-': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '_': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  z: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },

  ' ': { hand: 'Right', finger: 'Thumb', color: COLORS.thumb },
};

// 3. COLEMAK
const COLEMAK_ROWS: KeyItem[][] = [
  [
    { key: '`', shift: '~' }, { key: '1', shift: '!' }, { key: '2', shift: '@' }, { key: '3', shift: '#' },
    { key: '4', shift: '$' }, { key: '5', shift: '%' }, { key: '6', shift: '^' }, { key: '7', shift: '&' },
    { key: '8', shift: '*' }, { key: '9', shift: '(' }, { key: '0', shift: ')' }, { key: '-', shift: '_' },
    { key: '=', shift: '+' },
  ],
  [
    { key: 'q' }, { key: 'w' }, { key: 'f' }, { key: 'p' }, { key: 'g' },
    { key: 'j' }, { key: 'l' }, { key: 'u' }, { key: 'y' }, { key: ';' },
    { key: '[' }, { key: ']' },
  ],
  [
    { key: 'a' }, { key: 'r' }, { key: 's' }, { key: 't' }, { key: 'd' },
    { key: 'h' }, { key: 'n' }, { key: 'e' }, { key: 'i' }, { key: 'o' },
    { key: "'" },
  ],
  [
    { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' },
    { key: 'k' }, { key: 'm' }, { key: ',' }, { key: '.' }, { key: '/' },
  ],
];

const COLEMAK_FINGER_MAP: Record<string, FingerInfo> = {
  // Left Hand
  '`': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '1': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  q: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  a: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  z: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },

  '2': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  w: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  r: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  x: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },

  '3': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  f: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  s: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  c: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },

  '4': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '5': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  p: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  g: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  t: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  d: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  v: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  b: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },

  // Right Hand
  '6': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '7': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  j: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  l: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  h: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  n: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  k: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  m: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },

  '8': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  u: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  e: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  ',': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },

  '9': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  y: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  i: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  '.': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },

  '0': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '-': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '=': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ';': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '[': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ']': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  o: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  "'": { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '/': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },

  ' ': { hand: 'Right', finger: 'Thumb', color: COLORS.thumb },
};

// 4. AZERTY (French Standard)
const AZERTY_ROWS: KeyItem[][] = [
  [
    { key: '²', shift: '' }, { key: '&', shift: '1' }, { key: 'é', shift: '2' }, { key: '"', shift: '3' },
    { key: "'", shift: '4' }, { key: '(', shift: '5' }, { key: '-', shift: '6' }, { key: 'è', shift: '7' },
    { key: '_', shift: '8' }, { key: 'ç', shift: '9' }, { key: 'à', shift: '0' }, { key: ')', shift: '°' },
    { key: '=', shift: '+' },
  ],
  [
    { key: 'a' }, { key: 'z' }, { key: 'e' }, { key: 'r' }, { key: 't' },
    { key: 'y' }, { key: 'u' }, { key: 'i' }, { key: 'o' }, { key: 'p' },
    { key: '^' }, { key: '$' },
  ],
  [
    { key: 'q' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' },
    { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }, { key: 'm' },
    { key: 'ù' }, { key: '*' },
  ],
  [
    { key: 'w' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' },
    { key: 'n' }, { key: ',' }, { key: ';' }, { key: ':' }, { key: '!' },
  ],
];

const AZERTY_FINGER_MAP: Record<string, FingerInfo> = {
  // Left Hand
  '²': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '&': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  '1': { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  a: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  q: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },
  w: { hand: 'Left', finger: 'Pinky', color: COLORS.leftPinky },

  'é': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  '2': { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  z: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  s: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },
  x: { hand: 'Left', finger: 'Ring', color: COLORS.leftRing },

  '"': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  '3': { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  e: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  d: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },
  c: { hand: 'Left', finger: 'Middle', color: COLORS.leftMiddle },

  "'": { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '4': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '(': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  '5': { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  r: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  t: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  f: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  g: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  v: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },
  b: { hand: 'Left', finger: 'Index', color: COLORS.leftIndex },

  // Right Hand
  '-': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '6': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  'è': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  '7': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  y: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  u: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  h: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  j: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  n: { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },
  ',': { hand: 'Right', finger: 'Index', color: COLORS.rightIndex },

  '_': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  '8': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  i: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  k: { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },
  ';': { hand: 'Right', finger: 'Middle', color: COLORS.rightMiddle },

  'ç': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  '9': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  o: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  l: { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },
  ':': { hand: 'Right', finger: 'Ring', color: COLORS.rightRing },

  'à': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '0': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  ')': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '=': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '+': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  p: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '^': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '$': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  m: { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  'ù': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '*': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },
  '!': { hand: 'Right', finger: 'Pinky', color: COLORS.rightPinky },

  ' ': { hand: 'Right', finger: 'Thumb', color: COLORS.thumb },
};

export const KEYBOARD_LAYOUTS: Record<KeyboardLayoutId, KeyboardLayoutDef> = {
  qwerty: {
    id: 'qwerty',
    name: 'QWERTY',
    shortDesc: 'Standard English',
    description: 'The most popular worldwide keyboard layout standard.',
    homeRowLeft: ['A', 'S', 'D', 'F'],
    homeRowRight: ['J', 'K', 'L', ';'],
    homeBumps: ['f', 'j'],
    rows: QWERTY_ROWS,
    fingerMap: QWERTY_FINGER_MAP,
  },
  dvorak: {
    id: 'dvorak',
    name: 'Dvorak',
    shortDesc: 'Ergonomic & Vowel-focused',
    description: 'Places most common vowels & consonants on the home row to reduce finger travel by ~70%.',
    homeRowLeft: ['A', 'O', 'E', 'U'],
    homeRowRight: ['H', 'T', 'N', 'S'],
    homeBumps: ['u', 'h'],
    rows: DVORAK_ROWS,
    fingerMap: DVORAK_FINGER_MAP,
  },
  colemak: {
    id: 'colemak',
    name: 'Colemak',
    shortDesc: 'Modern Ergonomic',
    description: 'Optimized for high-speed typing while keeping familiar QWERTY shortcut keys (ZXCV) in place.',
    homeRowLeft: ['A', 'R', 'S', 'T'],
    homeRowRight: ['N', 'E', 'I', 'O'],
    homeBumps: ['t', 'n'],
    rows: COLEMAK_ROWS,
    fingerMap: COLEMAK_FINGER_MAP,
  },
  azerty: {
    id: 'azerty',
    name: 'AZERTY',
    shortDesc: 'French Standard',
    description: 'Dominant layout used in France, Belgium, and francophone regions.',
    homeRowLeft: ['Q', 'S', 'D', 'F'],
    homeRowRight: ['J', 'K', 'L', 'M'],
    homeBumps: ['f', 'j'],
    rows: AZERTY_ROWS,
    fingerMap: AZERTY_FINGER_MAP,
  },
};

export function getKeyboardLayout(layoutId: KeyboardLayoutId = 'qwerty'): KeyboardLayoutDef {
  return KEYBOARD_LAYOUTS[layoutId] || KEYBOARD_LAYOUTS.qwerty;
}

export function getFingerInfoForLayout(char: string, layoutId: KeyboardLayoutId = 'qwerty'): FingerInfo {
  const layout = getKeyboardLayout(layoutId);
  const lower = (char || '').toLowerCase();
  
  if (layout.fingerMap[lower]) {
    return layout.fingerMap[lower];
  }
  if (layout.fingerMap[char]) {
    return layout.fingerMap[char];
  }
  
  // Default fallback
  return {
    hand: 'Right',
    finger: 'Thumb',
    color: COLORS.thumb,
  };
}
