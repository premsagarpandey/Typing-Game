export type CodeLanguage = 'JavaScript' | 'Python' | 'HTML/CSS' | 'SQL' | 'Rust' | 'Go';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CodeSnippet {
  readonly id: string;
  readonly code: string;
  readonly language: CodeLanguage;
  readonly title: string;
  readonly description: string;
  readonly difficulty: Difficulty;
}

export const CODE_LANGUAGES: CodeLanguage[] = [
  'JavaScript',
  'Python',
  'HTML/CSS',
  'SQL',
  'Rust',
  'Go',
];

export const CODE_SNIPPETS: readonly CodeSnippet[] = [
  // ── JavaScript / TypeScript ───────────────────────────────────────────
  {
    id: 'js-01',
    code: 'const greet = (name) => `Hello, ${name}!`;',
    language: 'JavaScript',
    title: 'Arrow Function',
    description: 'Template literal with arrow function',
    difficulty: 'easy',
  },
  {
    id: 'js-02',
    code: 'const [count, setCount] = useState(0);',
    language: 'JavaScript',
    title: 'React useState',
    description: 'React state hook destructuring',
    difficulty: 'easy',
  },
  {
    id: 'js-03',
    code: 'const result = arr.filter((x) => x > 10).map((x) => x * 2).reduce((a, b) => a + b, 0);',
    language: 'JavaScript',
    title: 'Array Chain',
    description: 'Chained filter, map, and reduce',
    difficulty: 'medium',
  },
  {
    id: 'js-04',
    code: 'async function fetchData(url) { const res = await fetch(url); return res.json(); }',
    language: 'JavaScript',
    title: 'Async Fetch',
    description: 'Async/await with fetch API',
    difficulty: 'medium',
  },
  {
    id: 'js-05',
    code: 'const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };',
    language: 'JavaScript',
    title: 'Debounce',
    description: 'Debounce utility function',
    difficulty: 'hard',
  },
  {
    id: 'js-06',
    code: 'export default function App() { return <div className="container">{children}</div>; }',
    language: 'JavaScript',
    title: 'React Component',
    description: 'Simple React functional component with JSX',
    difficulty: 'medium',
  },
  {
    id: 'js-07',
    code: 'const { data, error, loading } = useSWR("/api/user", fetcher);',
    language: 'JavaScript',
    title: 'useSWR Hook',
    description: 'Data fetching with SWR destructuring',
    difficulty: 'easy',
  },
  {
    id: 'js-08',
    code: 'const memoized = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
    language: 'JavaScript',
    title: 'useMemo',
    description: 'React memoization hook',
    difficulty: 'medium',
  },
  {
    id: 'js-09',
    code: 'try { const parsed = JSON.parse(input); validate(parsed); } catch (err) { console.error("Parse failed:", err.message); }',
    language: 'JavaScript',
    title: 'Try-Catch JSON',
    description: 'Error handling with JSON parsing',
    difficulty: 'hard',
  },
  {
    id: 'js-10',
    code: 'const unique = [...new Set(array)];',
    language: 'JavaScript',
    title: 'Unique Array',
    description: 'Remove duplicates with Set spread',
    difficulty: 'easy',
  },

  // ── Python ────────────────────────────────────────────────────────────
  {
    id: 'py-01',
    code: 'result = [x ** 2 for x in range(10) if x % 2 == 0]',
    language: 'Python',
    title: 'List Comprehension',
    description: 'Filtered list comprehension with squares',
    difficulty: 'easy',
  },
  {
    id: 'py-02',
    code: 'def fibonacci(n): a, b = 0, 1; return [a := b, b := a + b for _ in range(n)]',
    language: 'Python',
    title: 'Fibonacci',
    description: 'Fibonacci sequence generator',
    difficulty: 'medium',
  },
  {
    id: 'py-03',
    code: 'with open("data.json", "r") as f: data = json.load(f)',
    language: 'Python',
    title: 'File Read',
    description: 'Context manager for JSON file reading',
    difficulty: 'easy',
  },
  {
    id: 'py-04',
    code: 'class User: def __init__(self, name: str, age: int): self.name = name; self.age = age',
    language: 'Python',
    title: 'Class Definition',
    description: 'Python class with typed constructor',
    difficulty: 'medium',
  },
  {
    id: 'py-05',
    code: 'from functools import lru_cache; @lru_cache(maxsize=128) def expensive(n): return sum(i ** 2 for i in range(n))',
    language: 'Python',
    title: 'LRU Cache',
    description: 'Memoized function with decorator',
    difficulty: 'hard',
  },
  {
    id: 'py-06',
    code: 'sorted_data = sorted(items, key=lambda x: x["score"], reverse=True)',
    language: 'Python',
    title: 'Lambda Sort',
    description: 'Sort with lambda key function',
    difficulty: 'medium',
  },
  {
    id: 'py-07',
    code: 'async def fetch_all(urls): tasks = [asyncio.create_task(fetch(u)) for u in urls]; return await asyncio.gather(*tasks)',
    language: 'Python',
    title: 'Async Gather',
    description: 'Concurrent async task execution',
    difficulty: 'hard',
  },

  // ── HTML / CSS ────────────────────────────────────────────────────────
  {
    id: 'html-01',
    code: '<div class="container"><h1>Hello World</h1><p>Welcome to my page.</p></div>',
    language: 'HTML/CSS',
    title: 'Basic HTML',
    description: 'Simple container with heading and paragraph',
    difficulty: 'easy',
  },
  {
    id: 'html-02',
    code: '<nav class="flex items-center justify-between"><a href="/">Home</a><a href="/about">About</a></nav>',
    language: 'HTML/CSS',
    title: 'Navbar',
    description: 'Flex navigation bar with links',
    difficulty: 'medium',
  },
  {
    id: 'html-03',
    code: 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; align-items: center;',
    language: 'HTML/CSS',
    title: 'CSS Grid',
    description: 'Three-column grid layout with gap',
    difficulty: 'medium',
  },
  {
    id: 'html-04',
    code: '<button type="submit" class="btn btn-primary" disabled={!isValid} onClick={handleSubmit}>Submit</button>',
    language: 'HTML/CSS',
    title: 'Button Element',
    description: 'Interactive button with attributes',
    difficulty: 'medium',
  },
  {
    id: 'html-05',
    code: '@media (max-width: 768px) { .sidebar { display: none; } .content { width: 100%; padding: 1rem; } }',
    language: 'HTML/CSS',
    title: 'Media Query',
    description: 'Responsive breakpoint with hiding sidebar',
    difficulty: 'hard',
  },

  // ── SQL ───────────────────────────────────────────────────────────────
  {
    id: 'sql-01',
    code: 'SELECT name, email FROM users WHERE active = true ORDER BY created_at DESC;',
    language: 'SQL',
    title: 'Basic SELECT',
    description: 'Filtered and sorted query',
    difficulty: 'easy',
  },
  {
    id: 'sql-02',
    code: 'SELECT u.name, COUNT(o.id) AS order_count FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name HAVING COUNT(o.id) > 5;',
    language: 'SQL',
    title: 'JOIN + GROUP BY',
    description: 'Aggregation with join and having clause',
    difficulty: 'hard',
  },
  {
    id: 'sql-03',
    code: 'INSERT INTO products (name, price, category) VALUES ("Widget", 29.99, "Tools");',
    language: 'SQL',
    title: 'INSERT',
    description: 'Insert a new row into products table',
    difficulty: 'easy',
  },
  {
    id: 'sql-04',
    code: 'UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE id = 42;',
    language: 'SQL',
    title: 'UPDATE',
    description: 'Update with increment and function call',
    difficulty: 'medium',
  },
  {
    id: 'sql-05',
    code: 'SELECT department, AVG(salary) AS avg_salary FROM employees WHERE hire_date >= "2023-01-01" GROUP BY department ORDER BY avg_salary DESC;',
    language: 'SQL',
    title: 'Aggregation',
    description: 'Average salary by department with filters',
    difficulty: 'hard',
  },

  // ── Rust ──────────────────────────────────────────────────────────────
  {
    id: 'rs-01',
    code: 'fn main() { let x: i32 = 42; println!("The answer is {}", x); }',
    language: 'Rust',
    title: 'Hello Rust',
    description: 'Basic variable and print macro',
    difficulty: 'easy',
  },
  {
    id: 'rs-02',
    code: 'fn sum(nums: &[i32]) -> i32 { nums.iter().fold(0, |acc, &x| acc + x) }',
    language: 'Rust',
    title: 'Iterator Fold',
    description: 'Sum with iterator and fold',
    difficulty: 'medium',
  },
  {
    id: 'rs-03',
    code: 'let result: Result<i32, String> = Ok(42); match result { Ok(v) => println!("{}", v), Err(e) => eprintln!("{}", e) }',
    language: 'Rust',
    title: 'Pattern Match',
    description: 'Result type with match expression',
    difficulty: 'hard',
  },

  // ── Go ────────────────────────────────────────────────────────────────
  {
    id: 'go-01',
    code: 'func main() { fmt.Println("Hello, World!") }',
    language: 'Go',
    title: 'Hello Go',
    description: 'Basic Go main function',
    difficulty: 'easy',
  },
  {
    id: 'go-02',
    code: 'func add(a, b int) int { return a + b }',
    language: 'Go',
    title: 'Function',
    description: 'Simple Go function with return type',
    difficulty: 'easy',
  },
  {
    id: 'go-03',
    code: 'ch := make(chan string); go func() { ch <- "hello" }(); msg := <-ch; fmt.Println(msg)',
    language: 'Go',
    title: 'Goroutine Channel',
    description: 'Goroutine with channel communication',
    difficulty: 'hard',
  },
];

/**
 * Returns a random code snippet, optionally filtered by language and/or difficulty.
 * Avoids returning the same snippet as `excludeId` when possible.
 */
export function getRandomSnippet(
  language?: CodeLanguage | null,
  difficulty?: Difficulty | null,
  excludeId?: string
): CodeSnippet {
  let pool = CODE_SNIPPETS as readonly CodeSnippet[];

  if (language) {
    pool = pool.filter((s) => s.language === language);
  }
  if (difficulty) {
    pool = pool.filter((s) => s.difficulty === difficulty);
  }

  // Fallback to full list if filters produced nothing
  if (pool.length === 0) {
    pool = CODE_SNIPPETS;
  }

  // Try to avoid repeating the last snippet
  if (excludeId && pool.length > 1) {
    pool = pool.filter((s) => s.id !== excludeId);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns a snippet by its id, or the first snippet as fallback.
 */
export function getSnippetById(id: string): CodeSnippet {
  return CODE_SNIPPETS.find((s) => s.id === id) || CODE_SNIPPETS[0];
}
