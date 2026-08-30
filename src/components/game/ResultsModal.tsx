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
    <div className="w-full max-w-md mx-auto p-6 bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/15 rounded-2xl text-center shadow-2xl animate-fade-in transition-colors">
      <h2
        className={`text-2xl font-black uppercase tracking-wider mb-4 ${
          securityFlag
            ? 'text-amber-500 dark:text-amber-400'
            : isPassed
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-rose-600 dark:text-rose-500'
        }`}
      >
        {securityFlag ? '🛡️ Verification Failed' : isPassed ? '🎉 Level Cleared!' : '❌ Level Failed'}
      </h2>

      {securityFlag && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-300 text-xs font-medium">
          <span className="font-bold">Anti-Cheat Alert:</span> {securityFlag}
        </div>
      )}

      <div className="space-y-3 mb-6 text-slate-600 dark:text-gray-300 text-sm">
        <div className="flex justify-between border-b border-slate-100 dark:border-gray-800 pb-2">
          <span>Speed:</span>
          <span className="font-semibold text-slate-900 dark:text-gray-100">
            {wpm} WPM <span className="text-xs text-slate-400 dark:text-gray-500">(Target: {levelConfig.targetWpm})</span>
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-100 dark:border-gray-800 pb-2">
          <span>Accuracy:</span>
          <span className="font-semibold text-slate-900 dark:text-gray-100">
            {accuracy}% <span className="text-xs text-slate-400 dark:text-gray-500">(Target: {levelConfig.targetAccuracy}%)</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span>Max Combo:</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">{maxCombo}x</span>
        </div>
      </div>

      {isPassed ? (
        <button
          onClick={onNextLevel}
          className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-semibold rounded-xl shadow-lg cursor-pointer"
        >
          Next Level →
        </button>
      ) : (
        <button
          onClick={onRetry}
          className="w-full py-3 px-6 bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all text-white font-semibold rounded-xl shadow-lg cursor-pointer"
        >
          Try Again ↺
        </button>
      )}
    </div>
  );
}
