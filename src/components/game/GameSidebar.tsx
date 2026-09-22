import { Link } from 'react-router-dom';
import type { GameMode } from '../../hooks/useTypingGame';
import { getLevelConfig } from '../../data/levels';
import { QUOTE_CATEGORIES } from '../../data/quotes';
import type { QuoteCategory, Difficulty } from '../../data/quotes';
import { CODE_LANGUAGES } from '../../data/codeSnippets';
import type { CodeLanguage } from '../../data/codeSnippets';

const LEVEL_OPTIONS = Array.from({ length: 50 }, (_, i) => {
  const lvl = i + 1;
  const conf = getLevelConfig(lvl);
  return {
    level: lvl,
    title: conf.title,
    category: conf.category,
  };
});

const TIMED_DURATIONS = [15, 30, 60, 120];
const DIFFICULTIES: (Difficulty | null)[] = [null, 'easy', 'medium', 'hard'];


interface GameSidebarProps {
  mode: GameMode;
  setIsSidebarOpen: (open: boolean) => void;
  currentLevel: number;
  levelConfig: ReturnType<typeof getLevelConfig>;
  handleSelectLevel: (lvl: number) => void;
  handlePrevLevel: () => void;
  handleNextLevel: () => void;
  handleRetry: () => void;
  showVirtualKeyboard: boolean;
  setShowVirtualKeyboard: (show: boolean) => void;
  timedDuration: number;
  handleSelectTimedDuration: (dur: number) => void;
  quoteCategory: QuoteCategory | null;
  handleQuoteCategoryChange: (cat: QuoteCategory | null) => void;
  quoteDifficulty: Difficulty | null;
  handleQuoteDifficultyChange: (diff: Difficulty | null) => void;
  codeLanguage: CodeLanguage | null;
  handleCodeLanguageChange: (lang: CodeLanguage | null) => void;
  codeDifficulty: Difficulty | null;
  handleCodeDifficultyChange: (diff: Difficulty | null) => void;
  currentSnippetInfo: { language?: string; title?: string; description?: string };
  customText: string;
  customTimeLimit: number;
  setIsCustomModalOpen: (open: boolean) => void;
}

export default function GameSidebar({
  mode,
  setIsSidebarOpen,
  currentLevel,
  levelConfig,
  handleSelectLevel,
  handlePrevLevel,
  handleNextLevel,
  handleRetry,
  showVirtualKeyboard,
  setShowVirtualKeyboard,
  timedDuration,
  handleSelectTimedDuration,
  quoteCategory,
  handleQuoteCategoryChange,
  quoteDifficulty,
  handleQuoteDifficultyChange,
  codeLanguage,
  handleCodeLanguageChange,
  codeDifficulty,
  handleCodeDifficultyChange,
  currentSnippetInfo,
  customText,
  customTimeLimit,
  setIsCustomModalOpen,
}: GameSidebarProps) {
  return (
        <aside className="w-full md:w-72 lg:w-80 xl:w-84 shrink-0 flex flex-col justify-between bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-4.5 shadow-xs overflow-y-auto animate-fade-in">
          {/* ─── Mode: Lesson ─── */}
          {mode === 'lesson' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                {/* Header Badges & Hide Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                      📖 Lesson
                    </span>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
                      {levelConfig.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <span className="text-xs">◀</span>
                  </button>
                </div>

                {/* Level Title */}
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Current Lesson
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                    Level {currentLevel}: {levelConfig.title}
                  </h2>
                </div>

                {/* Target Goals Card */}
                <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Target Goals
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">🎯 Target Speed</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {levelConfig.targetWpm} WPM
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">🎯 Min Accuracy</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {levelConfig.targetAccuracy}%
                    </span>
                  </div>
                </div>

                {/* Lesson Instructions */}
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/25 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                    💡 Instruction
                  </span>
                  {levelConfig.instruction}
                </div>
              </div>

              {/* Navigation & Action Controls */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                {/* Level Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Select Level
                  </label>
                  <select
                    aria-label="Select Level"
                    value={currentLevel}
                    onChange={(e) => handleSelectLevel(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {LEVEL_OPTIONS.map((item) => (
                      <option key={item.level} value={item.level} className="bg-white dark:bg-neutral-900">
                        {item.level}. {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prev / Next Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePrevLevel}
                    disabled={currentLevel <= 1}
                    className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-neutral-700 dark:text-neutral-300 text-center"
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={handleNextLevel}
                    disabled={currentLevel >= 50}
                    className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-neutral-700 dark:text-neutral-300 text-center"
                  >
                    Next ▶
                  </button>
                </div>

                {/* Restart & Switch Modes */}
                <div className="flex gap-2">
                  <button
                    onClick={handleRetry}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center flex items-center justify-center gap-1 shadow-xs"
                  >
                    ↻ Restart
                  </button>
                  <Link
                    to="/"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                    title="Back to Home to switch modes"
                  >
                    ← Modes
                  </Link>
                </div>

                {/* Keyboard Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                  title="Toggle on-screen virtual keyboard"
                >
                  <span>⌨</span>
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Timed ─── */}
          {mode === 'timed' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    ⏱ Timed
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <span className="text-xs">◀</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Speed Test — {timedDuration}s
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Type as fast as you can before time runs out. Maintain high rhythm and accuracy.
                  </p>
                </div>

                {/* Duration Options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Select Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIMED_DURATIONS.map((dur) => (
                      <button
                        key={dur}
                        onClick={() => handleSelectTimedDuration(dur)}
                        className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                          timedDuration === dur
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-xs'
                            : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {dur}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleRetry}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center flex items-center justify-center gap-1 shadow-xs"
                >
                  ↻ Restart Test
                </button>
                <Link
                  to="/"
                  className="block w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                >
                  ← Modes
                </Link>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>⌨</span>
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Quotes ─── */}
          {mode === 'quotes' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60">
                      💬 Quotes
                    </span>
                    {quoteCategory && (
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
                        {quoteCategory}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <span className="text-xs">◀</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Famous Quotes
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Type inspiring passages from great thinkers, authors, and movies.
                  </p>
                </div>

                {/* Category Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => handleQuoteCategoryChange(null)}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                        quoteCategory === null
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      All
                    </button>
                    {QUOTE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleQuoteCategoryChange(cat)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize ${
                          quoteCategory === cat
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff || 'all'}
                        onClick={() => handleQuoteDifficultyChange(diff)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize ${
                          quoteDifficulty === diff
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {diff || 'All'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleRetry}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center shadow-xs"
                >
                  Next Quote ▶
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRetry}
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                  >
                    ↻ Restart
                  </button>
                  <Link
                    to="/"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                  >
                    ← Modes
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>⌨</span>
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Code ─── */}
          {mode === 'code' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      ⌨ Code
                    </span>
                    {currentSnippetInfo.language && (
                      <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        {currentSnippetInfo.language}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <span className="text-xs">◀</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {currentSnippetInfo.title || 'Code Snippets'}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {currentSnippetInfo.description || 'Practice typing real-world code with special characters.'}
                  </p>
                </div>

                {/* Language Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Language
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => handleCodeLanguageChange(null)}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                        codeLanguage === null
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      All
                    </button>
                    {CODE_LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleCodeLanguageChange(lang)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                          codeLanguage === lang
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff || 'all'}
                        onClick={() => handleCodeDifficultyChange(diff)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize ${
                          codeDifficulty === diff
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {diff || 'All'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleRetry}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center shadow-xs"
                >
                  Next Snippet ▶
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRetry}
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                  >
                    ↻ Restart
                  </button>
                  <Link
                    to="/"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                  >
                    ← Modes
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>⌨</span>
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Custom ─── */}
          {mode === 'custom' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                    ✏ Custom
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <span className="text-xs">◀</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Custom Text
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Practice with custom passages, quotes, or exercises.
                  </p>
                </div>

                <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Words</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {customText.trim().split(/\s+/).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Characters</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {customText.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Time Limit</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {customTimeLimit > 0 ? `${customTimeLimit}s` : 'No limit'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center shadow-xs"
                >
                  ✎ Edit Text
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRetry}
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                  >
                    ↻ Restart
                  </button>
                  <Link
                    to="/"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center"
                  >
                    ← Modes
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>⌨</span>
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}
        </aside>
  );
}
