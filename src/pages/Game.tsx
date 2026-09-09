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
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-3xl mx-auto gap-4 py-2">
      {/* Top Mode Switcher Bar */}
      <div className="w-full flex items-center justify-center">
        <div className="p-1 bg-slate-200/80 dark:bg-white/10 rounded-2xl flex items-center gap-1 shadow-xs backdrop-blur-md">
          <button
            onClick={() => handleSwitchMode('lesson')}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'lesson'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🎓 Lessons (1-50)
          </button>
          <button
            onClick={() => handleSwitchMode('timed')}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'timed'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⏱️ Timed Test
          </button>
          <button
            onClick={() => handleSwitchMode('custom')}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'custom'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📝 Custom Text
          </button>
        </div>
      </div>

      {/* Mode Specific Controls & Header */}
      {mode === 'lesson' && (
        <div className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-full border border-blue-500/20">
                {levelConfig.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Level {currentLevel}: {levelConfig.title}
              </h2>
            </div>

            {/* Quick Level Selector & Navigation */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handlePrevLevel}
                disabled={currentLevel <= 1}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors text-slate-700 dark:text-gray-200"
                title="Previous Level"
              >
                ← Prev
              </button>

              <select
                aria-label="Select Level"
                value={currentLevel}
                onChange={(e) => handleSelectLevel(Number(e.target.value))}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {LEVEL_OPTIONS.map((item) => (
                  <option
                    key={item.level}
                    value={item.level}
                    className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    Lvl {item.level}: {item.title} ({item.category})
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextLevel}
                disabled={currentLevel >= 50}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors text-slate-700 dark:text-gray-200"
                title="Next Level"
              >
                Next →
              </button>

              <button
                onClick={handleRetry}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
                title="Restart Level"
              >
                ↻ Restart
              </button>
            </div>
          </div>

          {/* Beginner Instruction & Target */}
          <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span className="text-slate-700 dark:text-gray-300 font-medium">
                {levelConfig.instruction}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold rounded text-[11px] border border-emerald-500/20">
                Target: {levelConfig.targetWpm} WPM • {levelConfig.targetAccuracy}% Acc
              </span>
            </div>
          </div>
        </div>
      )}

      {mode === 'timed' && (
        <div className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⏱️</span> Timed Speed Test ({timedDuration}s)
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Type as many words as you can before the clock expires!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
              {TIMED_DURATIONS.map((dur) => (
                <button
                  key={dur}
                  onClick={() => handleSelectTimedDuration(dur)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    timedDuration === dur
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>

            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
            >
              ↻ New Words
            </button>
          </div>
        </div>
      )}

      {mode === 'custom' && (
        <div className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📝</span> Custom Text Practice
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              {customText.trim().split(/\s+/).length} words • {customText.length} characters •{' '}
              {customTimeLimit > 0 ? `${customTimeLimit}s limit` : 'No time limit'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
            >
              ✎ Edit / Choose Text
            </button>
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200 cursor-pointer transition-colors"
            >
              ↻ Restart
            </button>
          </div>
        </div>
      )}

      {/* Live Stats Bar */}
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

        {/* Typing Input Canvas */}
        <TypingArea
          targetText={targetText}
          typedText={typedText}
          status={status}
          shakeTrigger={shakeTrigger}
          securityFlag={securityFlag}
          onInput={handleInput}
        />

        {/* Live Visual Keyboard */}
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

      {/* Custom Text Configuration Modal */}
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
