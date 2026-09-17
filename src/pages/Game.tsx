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
  }, [status, handleNextLevel, handleRetry]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-3xl mx-auto gap-5 py-2">
      {/* Mode Specific Controls */}
      {mode === 'lesson' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  📖 Lesson
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
                  {levelConfig.category}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Level {currentLevel}: {levelConfig.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                to="/"
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors"
                title="Back to Home to switch modes"
              >
                ← Modes
              </Link>

              <button
                onClick={handlePrevLevel}
                disabled={currentLevel <= 1}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-neutral-600 dark:text-neutral-400"
              >
                Prev
              </button>

              <select
                aria-label="Select Level"
                value={currentLevel}
                onChange={(e) => handleSelectLevel(Number(e.target.value))}
                className="px-2 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-700 dark:text-neutral-300 cursor-pointer focus:outline-none"
              >
                {LEVEL_OPTIONS.map((item) => (
                  <option key={item.level} value={item.level} className="bg-white dark:bg-neutral-900">
                    {item.level}. {item.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextLevel}
                disabled={currentLevel >= 50}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-neutral-600 dark:text-neutral-400"
              >
                Next
              </button>

              <button
                onClick={handleRetry}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-neutral-600 dark:text-neutral-400"
              >
                Restart
              </button>
            </div>
          </div>

          <div className="p-3 bg-neutral-100/60 dark:bg-neutral-900/60 rounded-md text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-neutral-600 dark:text-neutral-400">
              {levelConfig.instruction}
            </span>
            <span className="text-neutral-500 dark:text-neutral-500 font-mono text-[11px] shrink-0">
              Target: {levelConfig.targetWpm} WPM / {levelConfig.targetAccuracy}%
            </span>
          </div>
        </div>
      )}

      {mode === 'timed' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                ⏱ Timed
              </span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Speed Test — {timedDuration}s
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              Type as fast as you can before time runs out.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors"
              title="Back to Home to switch modes"
            >
              ← Modes
            </Link>

            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden">
              {TIMED_DURATIONS.map((dur) => (
                <button
                  key={dur}
                  onClick={() => handleSelectTimedDuration(dur)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    timedDuration === dur
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>

            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-neutral-600 dark:text-neutral-400"
            >
              New Words
            </button>
          </div>
        </div>
      )}

      {/* ═══ Quotes Mode Controls ═══ */}
      {mode === 'quotes' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 space-y-3 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60">
                  💬 Quotes
                </span>
                {quoteCategory && (
                  <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {quoteCategory}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Famous Quotes
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                Type inspiring quotes from great thinkers and writers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors"
                title="Back to Home to switch modes"
              >
                ← Modes
              </Link>
              <button
                onClick={handleRetry}
                className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next Quote
              </button>
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors"
              >
                Restart
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1">
              Category
            </span>
            <button
              onClick={() => handleQuoteCategoryChange(null)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                quoteCategory === null
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              All
            </button>
            {QUOTE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleQuoteCategoryChange(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  quoteCategory === cat
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1">
              Difficulty
            </span>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff || 'all'}
                onClick={() => handleQuoteDifficultyChange(diff)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                  quoteDifficulty === diff
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {diff || 'All'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Code Mode Controls ═══ */}
      {mode === 'code' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 space-y-3 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  ⌨ Code
                </span>
                {currentSnippetInfo.language && (
                  <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {currentSnippetInfo.language}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {currentSnippetInfo.title || 'Code Snippets'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                {currentSnippetInfo.description || 'Practice typing real-world code with special characters and syntax.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors"
                title="Back to Home to switch modes"
              >
                ← Modes
              </Link>
              <button
                onClick={handleRetry}
                className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next Snippet
              </button>
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors"
              >
                Restart
              </button>
            </div>
          </div>

          {/* Language Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1">
              Language
            </span>
            <button
              onClick={() => handleCodeLanguageChange(null)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                codeLanguage === null
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              All
            </button>
            {CODE_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => handleCodeLanguageChange(lang)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  codeLanguage === lang
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1">
              Difficulty
            </span>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff || 'all'}
                onClick={() => handleCodeDifficultyChange(diff)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                  codeDifficulty === diff
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {diff || 'All'}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'custom' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                ✏ Custom
              </span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Custom Text
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              {customText.trim().split(/\s+/).length} words · {customText.length} chars ·{' '}
              {customTimeLimit > 0 ? `${customTimeLimit}s` : 'No limit'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors"
              title="Back to Home to switch modes"
            >
              ← Modes
            </Link>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
            >
              Edit Text
            </button>
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* Live Stats + Typing Area + Keyboard */}
      <div className="w-full flex flex-col gap-4">
        <GameStats
          timeRemaining={timeRemaining}
          wpm={wpm}
          accuracy={accuracy}
          combo={combo}
          mode={mode}
          level={currentLevel}
          targetWpm={mode === 'lesson' ? levelConfig.targetWpm : undefined}
          targetAccuracy={mode === 'lesson' ? levelConfig.targetAccuracy : undefined}
          initialTime={activeInitialTime}
        />

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
          <div className="w-full text-center animate-fade-in">
            <p className="text-sm text-neutral-500 dark:text-neutral-500 italic">
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
          <div className="w-full flex items-center justify-center gap-2 animate-fade-in">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              {currentSnippetInfo.language}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {currentSnippetInfo.title}
            </span>
          </div>
        )}

        <VirtualKeyboard nextChar={targetText[typedText.length] || ''} />
      </div>

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
