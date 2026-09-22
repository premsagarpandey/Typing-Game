import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTypingGame, type GameMode } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';
import CustomTextModal from '../components/game/CustomTextModal';
import { getLevelConfig } from '../data/levels';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { QUOTES } from '../data/quotes';
import type { QuoteCategory, Difficulty } from '../data/quotes';
import { CODE_SNIPPETS } from '../data/codeSnippets';
import type { CodeLanguage } from '../data/codeSnippets';
import GameSidebar from '../components/game/GameSidebar';


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

  // Code mode state
  const [codeLanguage, setCodeLanguage] = useLocalStorage<CodeLanguage | null>(
    'typlix_code_language',
    null
  );
  const [codeDifficulty, setCodeDifficulty] = useLocalStorage<Difficulty | null>(
    'typlix_code_difficulty',
    null
  );

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

  // Derived quote info from target text
  const currentQuoteInfo = useMemo(() => {
    if (mode === 'quotes' && targetText) {
      const match = QUOTES.find((q) => q.text === targetText);
      if (match) return { author: match.author, source: match.source };
    }
    return { author: '', source: '' };
  }, [mode, targetText]);

  // Derived code snippet info from target text
  const currentSnippetInfo = useMemo(() => {
    if (mode === 'code' && targetText) {
      const match = CODE_SNIPPETS.find((s) => s.code === targetText);
      if (match) {
        return {
          title: match.title,
          language: match.language,
          description: match.description,
        };
      }
    }
    return { title: '', language: '', description: '' };
  }, [mode, targetText]);

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
        <GameSidebar
          mode={mode}
          setIsSidebarOpen={setIsSidebarOpen}
          currentLevel={currentLevel}
          levelConfig={levelConfig}
          handleSelectLevel={handleSelectLevel}
          handlePrevLevel={handlePrevLevel}
          handleNextLevel={handleNextLevel}
          handleRetry={handleRetry}
          showVirtualKeyboard={showVirtualKeyboard}
          setShowVirtualKeyboard={setShowVirtualKeyboard}
          timedDuration={timedDuration}
          handleSelectTimedDuration={handleSelectTimedDuration}
          quoteCategory={quoteCategory}
          handleQuoteCategoryChange={handleQuoteCategoryChange}
          quoteDifficulty={quoteDifficulty}
          handleQuoteDifficultyChange={handleQuoteDifficultyChange}
          codeLanguage={codeLanguage}
          handleCodeLanguageChange={handleCodeLanguageChange}
          codeDifficulty={codeDifficulty}
          handleCodeDifficultyChange={handleCodeDifficultyChange}
          currentSnippetInfo={currentSnippetInfo}
          customText={customText}
          customTimeLimit={customTimeLimit}
          setIsCustomModalOpen={setIsCustomModalOpen}
        />
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
