export type QuoteCategory = 'Motivational' | 'Technology' | 'Literature' | 'Philosophy';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Quote {
  readonly id: string;
  readonly text: string;
  readonly author: string;
  readonly source?: string;
  readonly category: QuoteCategory;
  readonly difficulty: Difficulty;
}

export const QUOTE_CATEGORIES: QuoteCategory[] = [
  'Motivational',
  'Technology',
  'Literature',
  'Philosophy',
];

export const QUOTES: readonly Quote[] = [
  // ── Motivational ──────────────────────────────────────────────────────
  {
    id: 'mot-01',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Motivational',
    difficulty: 'easy',
  },
  {
    id: 'mot-02',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'Motivational',
    difficulty: 'easy',
  },
  {
    id: 'mot-03',
    text: 'In the middle of every difficulty lies opportunity. The important thing is not to stop questioning.',
    author: 'Albert Einstein',
    category: 'Motivational',
    difficulty: 'medium',
  },
  {
    id: 'mot-04',
    text: 'It does not matter how slowly you go as long as you do not stop. Every step forward is progress worth celebrating.',
    author: 'Confucius',
    category: 'Motivational',
    difficulty: 'medium',
  },
  {
    id: 'mot-05',
    text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    author: 'Nelson Mandela',
    category: 'Motivational',
    difficulty: 'easy',
  },
  {
    id: 'mot-06',
    text: 'Believe you can and you are halfway there. Your determination shapes the future you will inhabit.',
    author: 'Theodore Roosevelt',
    category: 'Motivational',
    difficulty: 'medium',
  },
  {
    id: 'mot-07',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'Motivational',
    difficulty: 'easy',
  },
  {
    id: 'mot-08',
    text: 'What you get by achieving your goals is not as important as what you become by achieving your goals. Growth is the real reward.',
    author: 'Zig Ziglar',
    category: 'Motivational',
    difficulty: 'medium',
  },
  {
    id: 'mot-09',
    text: 'Hardships often prepare ordinary people for an extraordinary destiny. The struggles you face today are developing the strength you need for tomorrow.',
    author: 'C.S. Lewis',
    category: 'Motivational',
    difficulty: 'hard',
  },
  {
    id: 'mot-10',
    text: 'You are never too old to set another goal or to dream a new dream.',
    author: 'C.S. Lewis',
    category: 'Motivational',
    difficulty: 'easy',
  },
  {
    id: 'mot-11',
    text: 'Do not wait to strike till the iron is hot, but make it hot by striking. Action creates momentum, and momentum creates success.',
    author: 'William Butler Yeats',
    category: 'Motivational',
    difficulty: 'medium',
  },

  // ── Technology ────────────────────────────────────────────────────────
  {
    id: 'tech-01',
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    category: 'Technology',
    difficulty: 'easy',
  },
  {
    id: 'tech-02',
    text: 'Any sufficiently advanced technology is indistinguishable from magic.',
    author: 'Arthur C. Clarke',
    category: 'Technology',
    difficulty: 'easy',
  },
  {
    id: 'tech-03',
    text: 'The best way to predict the future is to invent it. Technology is anything that was invented after you were born.',
    author: 'Alan Kay',
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    id: 'tech-04',
    text: 'Simplicity is the soul of efficiency. A good programmer is someone who always looks both ways before crossing a one-way street.',
    author: 'Austin Freeman',
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    id: 'tech-05',
    text: 'First, solve the problem. Then, write the code. Debugging is twice as hard as writing the code in the first place.',
    author: 'John Johnson',
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    id: 'tech-06',
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
    source: 'SICP',
    category: 'Technology',
    difficulty: 'easy',
  },
  {
    id: 'tech-07',
    text: 'The computer was born to solve problems that did not exist before. Now it solves problems we never knew we had in ways we never imagined.',
    author: 'Bill Gates',
    category: 'Technology',
    difficulty: 'hard',
  },
  {
    id: 'tech-08',
    text: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
    author: 'Bill Gates',
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    id: 'tech-09',
    text: 'The most dangerous phrase in the language is: We have always done it this way.',
    author: 'Grace Hopper',
    category: 'Technology',
    difficulty: 'easy',
  },
  {
    id: 'tech-10',
    text: 'Innovation distinguishes between a leader and a follower. Design is not just what it looks like; design is how it works.',
    author: 'Steve Jobs',
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    id: 'tech-11',
    text: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.',
    author: 'Alan Turing',
    category: 'Technology',
    difficulty: 'easy',
  },

  // ── Literature ────────────────────────────────────────────────────────
  {
    id: 'lit-01',
    text: 'Not all those who wander are lost.',
    author: 'J.R.R. Tolkien',
    source: 'The Lord of the Rings',
    category: 'Literature',
    difficulty: 'easy',
  },
  {
    id: 'lit-02',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    author: 'Jane Austen',
    source: 'Pride and Prejudice',
    category: 'Literature',
    difficulty: 'medium',
  },
  {
    id: 'lit-03',
    text: 'To be, or not to be, that is the question: whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.',
    author: 'William Shakespeare',
    source: 'Hamlet',
    category: 'Literature',
    difficulty: 'hard',
  },
  {
    id: 'lit-04',
    text: 'All that is gold does not glitter, not all those who wander are lost; the old that is strong does not wither.',
    author: 'J.R.R. Tolkien',
    source: 'The Lord of the Rings',
    category: 'Literature',
    difficulty: 'medium',
  },
  {
    id: 'lit-05',
    text: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.',
    author: 'Charles Dickens',
    source: 'A Tale of Two Cities',
    category: 'Literature',
    difficulty: 'medium',
  },
  {
    id: 'lit-06',
    text: 'We are all in the gutter, but some of us are looking at the stars.',
    author: 'Oscar Wilde',
    category: 'Literature',
    difficulty: 'easy',
  },
  {
    id: 'lit-07',
    text: 'Stay gold, Ponyboy. Stay gold. Nothing gold can stay, but the memory of beauty endures forever.',
    author: 'S.E. Hinton',
    source: 'The Outsiders',
    category: 'Literature',
    difficulty: 'medium',
  },
  {
    id: 'lit-08',
    text: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    author: 'F. Scott Fitzgerald',
    source: 'The Great Gatsby',
    category: 'Literature',
    difficulty: 'easy',
  },
  {
    id: 'lit-09',
    text: 'Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, I thought I would sail about a little.',
    author: 'Herman Melville',
    source: 'Moby-Dick',
    category: 'Literature',
    difficulty: 'hard',
  },
  {
    id: 'lit-10',
    text: 'The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved.',
    author: 'Jack Kerouac',
    source: 'On the Road',
    category: 'Literature',
    difficulty: 'medium',
  },

  // ── Philosophy ────────────────────────────────────────────────────────
  {
    id: 'phil-01',
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
    category: 'Philosophy',
    difficulty: 'easy',
  },
  {
    id: 'phil-02',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
    category: 'Philosophy',
    difficulty: 'easy',
  },
  {
    id: 'phil-03',
    text: 'You have power over your mind, not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    source: 'Meditations',
    category: 'Philosophy',
    difficulty: 'easy',
  },
  {
    id: 'phil-04',
    text: 'He who has a why to live can bear almost any how. The struggle itself toward the heights is enough to fill the human heart.',
    author: 'Friedrich Nietzsche',
    category: 'Philosophy',
    difficulty: 'medium',
  },
  {
    id: 'phil-05',
    text: 'The mind is everything. What you think you become. Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: 'Philosophy',
    difficulty: 'medium',
  },
  {
    id: 'phil-06',
    text: 'I think, therefore I am. The reading of all good books is like a conversation with the finest minds of past centuries.',
    author: 'Rene Descartes',
    category: 'Philosophy',
    difficulty: 'medium',
  },
  {
    id: 'phil-07',
    text: 'Happiness is not something ready-made. It comes from your own actions. The root of suffering is attachment.',
    author: 'Dalai Lama',
    category: 'Philosophy',
    difficulty: 'medium',
  },
  {
    id: 'phil-08',
    text: 'No man ever steps in the same river twice, for it is not the same river and he is not the same man.',
    author: 'Heraclitus',
    category: 'Philosophy',
    difficulty: 'medium',
  },
  {
    id: 'phil-09',
    text: 'The only true wisdom is in knowing you know nothing. Wonder is the beginning of wisdom and the path to understanding.',
    author: 'Socrates',
    category: 'Philosophy',
    difficulty: 'medium',
  },
  {
    id: 'phil-10',
    text: 'Waste no more time arguing about what a good man should be. Be one. The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    source: 'Meditations',
    category: 'Philosophy',
    difficulty: 'hard',
  },
];

/**
 * Returns a random quote, optionally filtered by category and/or difficulty.
 * Avoids returning the same quote as `excludeId` when possible.
 */
export function getRandomQuote(
  category?: QuoteCategory | null,
  difficulty?: Difficulty | null,
  excludeId?: string
): Quote {
  let pool = QUOTES as readonly Quote[];

  if (category) {
    pool = pool.filter((q) => q.category === category);
  }
  if (difficulty) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  // Fallback to full list if filters produced nothing
  if (pool.length === 0) {
    pool = QUOTES;
  }

  // Try to avoid repeating the last quote
  if (excludeId && pool.length > 1) {
    pool = pool.filter((q) => q.id !== excludeId);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns a quote by its id, or the first quote as fallback.
 */
export function getQuoteById(id: string): Quote {
  return QUOTES.find((q) => q.id === id) || QUOTES[0];
}
