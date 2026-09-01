import type { LevelConfig } from '../../data/levels';
import type { GameStatus } from '../../hooks/useTypingGame';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  status: GameStatus;
  levelConfig: LevelConfig;
  securityFlag?: string | null;
  onNextLevel: () => void;
  onRetry: () => void;
}

export default function ResultsModal({
  wpm,
  accuracy,
  maxCombo,
  status,
  levelConfig,
  securityFlag,
  onNextLevel,
  onRetry,
}: ResultsModalProps) {
  const isPassed = status === 'passed' && !securityFlag;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/15 rounded-2xl text-center shadow-2xl animate-fade-in transition-colors">
      <div className="text-3xl mb-1">
        {securityFlag ? '🛡️' : isPassed ? '🎉' : '💪'}
      </div>
      <h2
        className={`text-xl sm:text-2xl font-black uppercase tracking-wider mb-2 ${
          securityFlag
            ? 'text-amber-500 dark:text-amber-400'
            : isPassed
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-blue-600 dark:text-blue-400'
        }`}
      >
        {securityFlag
          ? 'Verification Flagged'
          : isPassed
          ? `Level ${levelConfig.level} Cleared!`
          : `Keep Going! Practice Makes Perfect`}
      </h2>

      <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
        {isPassed
          ? 'Awesome job! You achieved the target score for this lesson.'
          : 'Do not worry about speed. Focus on feeling the keys and building muscle memory!'}
      </p>

      {securityFlag && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-300 text-xs font-medium">
          <span className="font-bold">Anti-Cheat Alert:</span> {securityFlag}
        </div>
      )}

      <div className="space-y-2.5 mb-5 text-slate-600 dark:text-gray-300 text-sm bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
          <span>Your Speed:</span>
          <span className="font-semibold text-slate-900 dark:text-gray-100 font-mono">
            {wpm} WPM <span className="text-xs text-slate-400 dark:text-gray-500">(Goal: {levelConfig.targetWpm})</span>
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
          <span>Your Accuracy:</span>
          <span className="font-semibold text-slate-900 dark:text-gray-100 font-mono">
            {accuracy}% <span className="text-xs text-slate-400 dark:text-gray-500">(Goal: {levelConfig.targetAccuracy}%)</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span>Highest Combo:</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">{maxCombo}x</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onRetry}
          className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 transition-all text-slate-800 dark:text-white font-semibold rounded-xl text-sm border border-slate-300 dark:border-white/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Practice Again ↺</span>
          <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-200 dark:bg-white/15 text-slate-600 dark:text-gray-300 rounded border border-slate-300 dark:border-white/10">
            R
          </kbd>
        </button>

        <button
          onClick={onNextLevel}
          className={`flex-1 py-3 px-4 active:scale-95 transition-all text-white font-semibold rounded-xl text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 ${
            isPassed
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25 ring-2 ring-emerald-400/40'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25 ring-2 ring-blue-400/40'
          }`}
        >
          <span>
            {levelConfig.level >= 50
              ? isPassed
                ? 'Completed Course! 🏆'
                : 'Replay Level 50'
              : isPassed
              ? 'Next Level →'
              : 'Continue Anyway →'}
          </span>
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-white/25 text-white rounded border border-white/30 shadow-xs">
            ↵ Enter
          </kbd>
        </button>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-gray-400">
        <span>⚡</span>
        <span>
          Press <kbd className="px-1.5 py-0.5 font-mono text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-white/15 rounded text-[10px] font-bold">Enter ↵</kbd> on your keyboard to instantly play next level
        </span>
      </div>
    </div>
  );
}
