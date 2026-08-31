import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';
import { getLevelConfig } from '../data/levels';
import { secureStorage } from '../utils/secureStorage';

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    return secureStorage.getItem<number>('typingGameLevel', 1);
  });

  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel]);

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
  } = useTypingGame(40, levelConfig);

  useEffect(() => {
    secureStorage.setItem('typingGameLevel', currentLevel);
  }, [currentLevel]);

  const handleNextLevel = useCallback(() => {
    setCurrentLevel((prev) => Math.min(prev + 1, 50));
    resetGame();
  }, [resetGame]);

  const handlePrevLevel = useCallback(() => {
    setCurrentLevel((prev) => Math.max(prev - 1, 1));
    resetGame();
  }, [resetGame]);

  const handleSelectLevel = useCallback((lvl: number) => {
    setCurrentLevel(lvl);
    resetGame();
  }, [resetGame]);

  const handleRetry = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Handle Enter key and R key when level finishes (passed/failed)
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
      {/* Level Navigation & Learning Header */}
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
              {Array.from({ length: 50 }, (_, i) => i + 1).map((lvl) => {
                const conf = getLevelConfig(lvl);
                return (
                  <option key={lvl} value={lvl}>
                    Lvl {lvl}: {conf.title} ({conf.category})
                  </option>
                );
              })}
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
              onClick={resetGame}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
              title="Restart Level"
            >
              ↻ Restart
            </button>
          </div>
        </div>

        {/* Beginner Instruction & Finger Hint */}
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

      <div className="w-full flex flex-col gap-4">
        <GameStats
          timeRemaining={timeRemaining}
          wpm={wpm}
          accuracy={accuracy}
          combo={combo}
          level={currentLevel}
          targetWpm={levelConfig.targetWpm}
          targetAccuracy={levelConfig.targetAccuracy}
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

      {(status === 'passed' || status === 'failed') && (
        <ResultsModal
          wpm={wpm}
          accuracy={accuracy}
          maxCombo={maxCombo}
          status={status}
          levelConfig={levelConfig}
          securityFlag={securityFlag}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
