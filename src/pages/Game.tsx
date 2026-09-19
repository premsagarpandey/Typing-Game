import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTypingGame, type GameMode } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';
import CustomTextModal from '../components/game/CustomTextModal';
import { getLevelConfig } from '../data/levels';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { QUOTE_CATEGORIES, QUOTES, getRandomQuote } from '../data/quotes';
import type { QuoteCategory, Difficulty } from '../data/quotes';
import { CODE_LANGUAGES, CODE_SNIPPETS } from '../data/codeSnippets';
import type { CodeLanguage } from '../data/codeSnippets';

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

export default function Game() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useLocalStorage<GameMode>('typlix_game_mode', 'lesson');
  const [currentLevel, setCurrentLevel] = useLocalStorage<number>('typingGameLevel', 1);
  const [timedDuration, setTimedDuration] = useLocalStorage<number>('typlix_timed_duration', 30);
  const [customText, setCustomText] = useLocalStorage<string>(
    'typlix_custom_text',
    'The quick brown fox jumps over the lazy dog while sleek keyboards rhythmically click under nimble typing fingers.'
  );
  const [customTimeLimit, setCustomTimeLimit] = useLocalStorage<number>(
    'typlix_custom_time_limit',
    60
  );
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Quotes mode state
  const [quoteCategory, setQuoteCategory] = useLocalStorage<QuoteCategory | null>(
    'typlix_quote_category',
    null
  );
  const [quoteDifficulty, setQuoteDifficulty] = useLocalStorage<Difficulty | null>(
    'typlix_quote_difficulty',
    null
  );
  const [currentQuoteInfo, setCurrentQuoteInfo] = useState(() => {
    const q = getRandomQuote(null, null);
    return { author: q.author, source: q.source };
  });

  // Code mode state
  const [codeLanguage, setCodeLanguage] = useLocalStorage<CodeLanguage | null>(
    'typlix_code_language',
    null
  );
  const [codeDifficulty, setCodeDifficulty] = useLocalStorage<Difficulty | null>(
    'typlix_code_difficulty',
    null
  );
  const [currentSnippetInfo, setCurrentSnippetInfo] = useState({
    title: '',
    language: '' as string,
    description: '',
  });

  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel]);

  // Sidebar & Virtual Keyboard visibility states (persisted)
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage<boolean>('typlix_sidebar_visible', true);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useLocalStorage<boolean>('typlix_keyboard_visible', true);

  const activeInitialTime = useMemo(() => {
    if (mode === 'lesson') return levelConfig.timeLimit;
    if (mode === 'timed') return timedDuration;
    if (mode === 'quotes') return 120; // generous time for quotes
    if (mode === 'code') return 120;   // generous time for code
    return customTimeLimit;
  }, [mode, levelConfig.timeLimit, timedDuration, customTimeLimit]);

  const modeLabel = useMemo(() => {
    if (mode === 'lesson') return `Level ${currentLevel}`;
    if (mode === 'timed') return `Timed (${timedDuration}s)`;
    if (mode === 'quotes') return `Quote${quoteCategory ? ` · ${quoteCategory}` : ''}`;
    if (mode === 'code') return `Code${codeLanguage ? ` · ${codeLanguage}` : ''}`;
    return 'Custom Text';
  }, [mode, currentLevel, timedDuration, quoteCategory, codeLanguage]);

  const {
    status,
    timeRemaining,
    targetText,
    typedText,
    wpm,
    accuracy,
    combo,
    maxCombo,
    shakeTrigger,
    securityFlag,
    handleInput,
    resetGame,
  } = useTypingGame(activeInitialTime, levelConfig, {
    mode,
    customText,
    modeLabel,
    quoteCategory,
    quoteDifficulty,
    codeLanguage,
    codeDifficulty,
  });

  // Synchronize mode from URL search param if present (e.g. /game?mode=quotes)
  useEffect(() => {
    const urlMode = searchParams.get('mode') as GameMode | null;
    if (urlMode && ['lesson', 'timed', 'quotes', 'code', 'custom'].includes(urlMode)) {
      if (urlMode !== mode) {
        setMode(urlMode);
      }
    }
  }, [searchParams, mode, setMode]);

  // When active mode changes, reset game with appropriate text
  const prevModeRef = useRef(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      resetGame();
    }
  }, [mode, resetGame]);


  // Switch timed duration
  const handleSelectTimedDuration = (dur: number) => {
    setTimedDuration(dur);
    setTimeout(() => {
      resetGame();
    }, 0);
  };

  // Select lesson level
  const handleSelectLevel = useCallback(
    (lvl: number) => {
      const next = Math.min(Math.max(1, lvl), 50);
      setCurrentLevel(next);
      resetGame(getLevelConfig(next));
    },
    [setCurrentLevel, resetGame]
  );

  const handleNextLevel = useCallback(() => {
    if (mode === 'lesson') {
      handleSelectLevel(currentLevel + 1);
    } else {
      resetGame();
    }
  }, [mode, currentLevel, handleSelectLevel, resetGame]);

  const handlePrevLevel = useCallback(() => {
    handleSelectLevel(currentLevel - 1);
  }, [currentLevel, handleSelectLevel]);

  const handleRetry = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleApplyCustomText = (text: string, timeLimit: number) => {
    setCustomText(text);
    setCustomTimeLimit(timeLimit);
    resetGame(undefined, text);
  };

  // Quotes filter handlers
  const handleQuoteCategoryChange = (cat: QuoteCategory | null) => {
    setQuoteCategory(cat);
    setTimeout(() => resetGame(), 0);
  };

  const handleQuoteDifficultyChange = (diff: Difficulty | null) => {
    setQuoteDifficulty(diff);
    setTimeout(() => resetGame(), 0);
  };

  // Code filter handlers
  const handleCodeLanguageChange = (lang: CodeLanguage | null) => {
    setCodeLanguage(lang);
    setTimeout(() => resetGame(), 0);
  };

  const handleCodeDifficultyChange = (diff: Difficulty | null) => {
    setCodeDifficulty(diff);
    setTimeout(() => resetGame(), 0);
  };

  // Track current quote/snippet info for display
  useEffect(() => {
    if (mode === 'quotes' && targetText) {
      const match = QUOTES.find((q) => q.text === targetText);
      if (match) {
        setCurrentQuoteInfo({ author: match.author, source: match.source });
      }
    }
    if (mode === 'code' && targetText) {
      const match = CODE_SNIPPETS.find((s) => s.code === targetText);
      if (match) {
        setCurrentSnippetInfo({
          title: match.title,
          language: match.language,
          description: match.description,
        });
      }
    }
  }, [mode, targetText]);

  // Keyboard shortcut handlers for Enter and R when finished
  useEffect(() => {
    if (status !== 'passed' && status !== 'failed' && status !== 'finished') {
      return;
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleNextLevel();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        e.stopPropagation();
        handleRetry();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [status, handleNextLevel, handleRetry]);  return (
    <div className="w-full h-full max-h-[calc(100vh-62px)] flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch overflow-hidden">
      {/* ═══════════════════ LEFT SIDEBAR: Mode & Lesson Controls ═══════════════════ */}
      {isSidebarOpen && (
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
      )}

      {/* ═══════════════════ RIGHT MAIN AREA: Stats + Big Typing Area + Keyboard ═══════════════════ */}
      <section className="flex-1 min-w-0 flex flex-col justify-between gap-2.5 h-full overflow-hidden">
        {/* Live Stats Bar + Unhide Sidebar Button if hidden */}
        <div className="shrink-0 flex items-center gap-2">
          {!isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all animate-fade-in"
              title="Show lesson / practice sidebar"
            >
              <span className="text-blue-500">▶</span>
              <span>Show {mode === 'lesson' ? 'Lesson' : 'Controls'}</span>
            </button>
          )}

          <div className="flex-1 min-w-0 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-1 shadow-2xs">
            <GameStats
              timeRemaining={timeRemaining}
              wpm={wpm}
              accuracy={accuracy}
              combo={combo}
              mode={mode}
              level={currentLevel}
              levelTitle={mode === 'lesson' ? levelConfig.title : undefined}
              targetWpm={mode === 'lesson' ? levelConfig.targetWpm : undefined}
              targetAccuracy={mode === 'lesson' ? levelConfig.targetAccuracy : undefined}
              initialTime={activeInitialTime}
              onPrevLevel={mode === 'lesson' ? handlePrevLevel : undefined}
              onNextLevel={mode === 'lesson' ? handleNextLevel : undefined}
              hasPrevLevel={currentLevel > 1}
              hasNextLevel={currentLevel < 50}
              selectedDuration={timedDuration}
              onSelectDuration={handleSelectTimedDuration}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
            />
          </div>
        </div>

        {/* Large Typing Area Container */}
        <div className="flex-1 min-h-0 flex flex-col justify-center">
          <TypingArea
            targetText={targetText}
            typedText={typedText}
            status={status}
            shakeTrigger={shakeTrigger}
            securityFlag={securityFlag}
            onInput={handleInput}
          />

          {/* Quote attribution */}
          {mode === 'quotes' && currentQuoteInfo.author && (
            <div className="w-full text-center mt-1.5 animate-fade-in">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                — {currentQuoteInfo.author}
                {currentQuoteInfo.source && (
                  <span className="text-neutral-400 dark:text-neutral-600">
                    , {currentQuoteInfo.source}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Code snippet info */}
          {mode === 'code' && currentSnippetInfo.language && (
            <div className="w-full flex items-center justify-center gap-2 mt-1.5 animate-fade-in">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                {currentSnippetInfo.language}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {currentSnippetInfo.title}
              </span>
            </div>
          )}
        </div>

        {/* Virtual Keyboard (toggleable) */}
        {showVirtualKeyboard ? (
          <div className="shrink-0 mt-3 sm:mt-6 pb-2 animate-fade-in">
            <VirtualKeyboard nextChar={targetText[typedText.length] || ''} />
          </div>
        ) : (
          <div className="shrink-0 flex items-center justify-center py-1">
            <button
              type="button"
              onClick={() => setShowVirtualKeyboard(true)}
              className="text-xs text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 transition-colors cursor-pointer"
              title="Show virtual keyboard"
            >
              <span>⌨ Show Virtual Keyboard</span>
            </button>
          </div>
        )}
      </section>

      {/* Results Modal */}
      {(status === 'passed' || status === 'failed' || status === 'finished') && (
        <ResultsModal
          wpm={wpm}
          accuracy={accuracy}
          maxCombo={maxCombo}
          status={status}
          mode={mode}
          levelConfig={levelConfig}
          modeLabel={modeLabel}
          securityFlag={securityFlag}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />
      )}

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        initialText={customText}
        initialTimeLimit={customTimeLimit}
        onClose={() => setIsCustomModalOpen(false)}
        onApply={handleApplyCustomText}
      />
    </div>
  );
}
