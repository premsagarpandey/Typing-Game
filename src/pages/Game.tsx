import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTypingGame, type GameMode } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';
import CustomTextModal from '../components/game/CustomTextModal';
import { getLevelConfig } from '../data/levels';
import { useLocalStorage } from '../hooks/useLocalStorage';

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

export default function Game() {
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

  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel]);

  const activeInitialTime = useMemo(() => {
    if (mode === 'lesson') return levelConfig.timeLimit;
    if (mode === 'timed') return timedDuration;
    return customTimeLimit;
  }, [mode, levelConfig.timeLimit, timedDuration, customTimeLimit]);

  const modeLabel = useMemo(() => {
    if (mode === 'lesson') return `Level ${currentLevel}`;
    if (mode === 'timed') return `Timed (${timedDuration}s)`;
    return 'Custom Text';
  }, [mode, currentLevel, timedDuration]);

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
  });

  // Switch game mode
  const handleSwitchMode = (newMode: GameMode) => {
    setMode(newMode);
    setTimeout(() => {
      resetGame();
    }, 0);
  };

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
      {/* Mode Switcher */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800">
          {(['lesson', 'timed', 'custom'] as GameMode[]).map((m) => {
            const labels: Record<GameMode, string> = {
              lesson: 'Lessons',
              timed: 'Timed',
              custom: 'Custom',
            };
            return (
              <button
                key={m}
                onClick={() => handleSwitchMode(m)}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                  mode === m
                    ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100'
                    : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {labels[m]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Specific Controls */}
      {mode === 'lesson' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
                {levelConfig.category}
              </span>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Level {currentLevel}: {levelConfig.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
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
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Speed Test — {timedDuration}s
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              Type as fast as you can before time runs out.
            </p>
          </div>

          <div className="flex items-center gap-2">
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

      {mode === 'custom' && (
        <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Custom Text
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              {customText.trim().split(/\s+/).length} words · {customText.length} chars ·{' '}
              {customTimeLimit > 0 ? `${customTimeLimit}s` : 'No limit'}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
