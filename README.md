# Typlix — Touch Typing Mastery Platform

Typlix is a high-performance, minimalist touch typing training web application built with **React 19**, **TypeScript**, and **Vite**. Designed with an uncompromising focus on ergonomics, distraction-free aesthetics, sub-millisecond typing feedback, and strict data privacy.

---

## Key Features

### 1. Progressive Practice Modes
- **50 Structured Lessons**: Comprehensive curriculum ranging from home-row fundamentals to complex symbol/code sequences.
- **Speed Sprint Tests**: Configurable timed benchmarks (15s, 30s, 60s, 120s) with live WPM/accuracy telemetry.
- **Curated Quotes**: Inspiring literary and philosophical excerpts categorized by difficulty.
- **Programming Snippets**: Real-world syntaxes across TypeScript, Python, Rust, Go, CSS, and HTML.
- **Custom Text Engine**: Paste or load arbitrary text for targeted muscle memory training.

### 2. Ergonomics & Sensory Feedback
- **Multi-Layout Support**: Visual tactile mapping for QWERTY, Dvorak, Colemak, and AZERTY.
- **Synthesized Mechanical Switches**: Realistic audio synthesized on-the-fly via the Web Audio API (Cherry MX Blue, Brown, Red, Topre, Bubble pop, and Vintage Typewriter).
- **Smooth 3-Line Scroller**: Active line focus with precise trailing cursor caret and real-time error highlighting.
- **Finger Placement Guides**: Interactive on-screen guides and home-row tutorials.

### 3. Data Minimization & Privacy
- **Strict Data Minimization**: Typlix collects **only necessary data** (WPM, accuracy, completed lesson progress, and audio settings).
- **Zero Third-Party Tracking**: No marketing pixels, no cross-site profiling, and no data sales.
- **Cookie Consent Architecture**: Granular controls for Strictly Necessary, Functional, and Analytics storage, fully reconfigurable anytime.
- **Data Portability & Erasure**: Instant JSON/CSV export and one-click data purge ("Right to be Forgotten").
- **Cloud Sync**: Secure, authenticated multi-device sync via Google Firebase Auth & Cloud Firestore.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) |
| **Build & Bundler** | [Vite 8](https://vite.dev/) with automated route-based code splitting |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Cloud & Auth** | [Google Firebase v12](https://firebase.google.com/) (Auth & Firestore) |
| **Motion & Icons** | [Framer Motion](https://www.framer.com/motion/) & [Lucide React](https://lucide.dev/) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## Project Structure

```
typlix/
├── public/                  # Static assets & edge security headers (_headers)
├── src/
│   ├── components/
│   │   ├── common/          # Modals, ThemeToggle, CookieConsent, AuthModal
│   │   ├── game/            # TypingArea, VirtualKeyboard, GameStats, ResultsModal
│   │   ├── layout/          # Navbar, headers
│   │   └── stats/           # Progression graphs & SVG metrics
│   ├── context/             # AuthContext, ThemeContext
│   ├── data/                # Lessons, Quotes, Code Snippets, Keyboard Layouts
│   ├── hooks/               # Custom game, local storage, auth hooks
│   ├── pages/               # Home, Game, Stats, Leaderboard, Settings, Profile,
│   │                        # PrivacyPolicy, TermsOfService, CookiesPolicy, RefundPolicy
│   ├── services/            # Firestore cloud synchronization
│   ├── utils/               # Sound engine, data backup, cookie consent state
│   ├── App.tsx              # Root application router & layout
│   ├── index.css            # Design tokens & Tailwind directives
│   └── main.tsx             # Application bootstrap
├── .env.example             # Safe template for environment variables
├── .gitignore               # Enterprise-grade git ignore configuration
├── firebase.json            # Hosting & firestore configuration
├── firestore.rules          # Granular security rules for Cloud Firestore
├── package.json             # Scripts & dependency definitions
├── tsconfig.json            # Strict TypeScript configuration
└── vite.config.ts           # Build optimization & chunking
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/typlix.git
   cd typlix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your Firebase credentials (optional for offline-only practice):
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement |
| `npm run build` | Compiles TypeScript and creates an optimized production bundle |
| `npm run lint` | Runs sub-second static analysis with `oxlint` |
| `npm run type-check` | Validates TypeScript types across the entire project |
| `npm run preview` | Serves the production build locally for verification |

---

## Security & Deployment

- **Environment Security**: Real secrets and `.env` files are strictly excluded from version control via `.gitignore`.
- **Content Security Policy (CSP)**: Strict headers are configured in `public/_headers`, `vercel.json`, and `netlify.toml` to prevent cross-site scripting and unauthorized frame embedding.
- **Firestore Security**: User documents can only be written by the authenticated owner (`request.auth.uid == userId`).

---

## License

This project is licensed under the MIT License.
