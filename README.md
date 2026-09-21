# Typlix — Professional Touch Typing Mastery Platform

Typlix is a high-performance, minimalist touch typing application built with React 19, TypeScript, and Vite. Designed for speed enthusiasts, software engineers, and learners who want distraction-free practice paired with instant auditory and visual feedback.

---

## Key Features

### Practice Modes
- **50 Structured Levels**: Progressive curriculum spanning home row mastery, number rows, symbols, common punctuation, and complex vocabulary.
- **Timed Sprint Mode**: Configurable tests (15s, 30s, 60s, 120s) modeled after competitive typing platforms.
- **Quotes Mode**: Curated inspirational and literary quotes categorized by theme and difficulty.
- **Code Snippets Mode**: Real-world programming snippets across TypeScript, JavaScript, Python, Rust, Go, CSS, and HTML.
- **Custom Text Engine**: Load any arbitrary text with optional duration limits.

### Ergonomics & Visuals
- **Multiple Layout Support**: Native visual mapping for QWERTY, Dvorak, Colemak, and AZERTY keyboards.
- **Visual Finger Placement Guides**: High-contrast interactive guide cards and home-row tutorials.
- **Monochromatic Aesthetics**: Crisp, high-contrast dark/light mode interface with fluid CSS transitions and no visual clutter.
- **Responsive 3-Line Scroller**: Active line focus with precise trailing cursor caret and real-time error highlighting.
- **Caps Lock Detection**: Automatic case-lock warnings with one-click case-normalization toggle.

### Audio & Sensory Engine
- **Synthesized Mechanical Switches**: Realistic keystroke audio synthesized via Web Audio API (Cherry MX Blue, Cherry MX Brown, Cherry MX Red, Topre capacitive, Bubble pop, and Vintage Typewriter).
- **Volume & Mute Controls**: Direct slider control with instant sound previews.

### Analytics & Security Suite
- **Comprehensive Analytics**: Real-time WPM, Net WPM, Accuracy %, streak combo counter, and interactive SVG progress charts.
- **Cryptographic Storage (HMAC-SHA256)**: Tamper-resistant persistence for high scores, user preferences, and level completions.
- **Anti-Cheat Cadence Sensor**: Differentiates human multi-finger rolls from synthetic macros and bot injections.
- **Anti-Inspect Guard**: Protects session integrity and prevents accidental browser shortcut disruptions.
- **Data Portability**: Full JSON backup import/export and CSV stats export.

---

## Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/) with code-splitting chunks
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/) (Lazy-loaded routes)
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Linter**: [Oxlint](https://oxc.rs/) (Sub-second static analysis)

---

## Project Structure

```
typing-game-project/
├── public/                  # Static assets & server deployment headers
├── src/
│   ├── components/
│   │   ├── common/          # Modals (Caps Lock, Finger Placement, Security Audit), Theme Toggle
│   │   ├── game/            # TypingArea, VirtualKeyboard, GameStats, ResultsModal, CustomTextModal
│   │   ├── layout/          # Top navigation bar and global header
│   │   └── stats/           # WPM / Accuracy SVG progression charts
│   ├── context/             # ThemeContext (Dark / Light mode state)
│   ├── data/                # Levels, Quotes, Code Snippets, Keyboard Layouts, Words
│   ├── hooks/               # useTypingGame, useLocalStorage, useTheme
│   ├── pages/               # Home, Game, Stats, Leaderboard, Settings
│   ├── utils/               # Sound Engine, Anti-Cheat, Secure Storage, Data Backup, Anti-Inspect
│   ├── App.tsx              # Root router & security initializers
│   ├── index.css            # Custom scrollbars, animations, and Tailwind directives
│   └── main.tsx             # Application bootstrap
├── package.json
├── tsconfig.json
└── vite.config.ts           # Build optimization & manual chunk splitting
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Launch development server
npm run dev
```

### Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement.
- `npm run build`: Type-checks with `tsc` and compiles an optimized production bundle.
- `npm run lint`: Runs `oxlint` across all files for instantaneous verification.
- `npm run preview`: Previews the production build locally.

---

## Keyboard Shortcuts

- **Esc / Tab**: Reset current practice test or level.
- **Enter**: Next level upon passing a lesson.
- **R**: Instant retry upon completing or failing a test.

---

## License

MIT License. Designed with precision for touch typing learners worldwide.
