import type { LevelConfig } from '../../data/levels';
import type { GameStatus, GameMode } from '../../hooks/useTypingGame';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  status: GameStatus;
  mode?: GameMode;
  levelConfig?: LevelConfig;
  modeLabel?: string;
  securityFlag?: string | null;
  onNextLevel?: () => void;
  onRetry: () => void;
  onOpenCustomModal?: () => void;
}

export default function ResultsModal({
  wpm,
  accuracy,
  maxCombo,
  status,
  mode = 'lesson',
  levelConfig,
  modeLabel,
  securityFlag,
  onNextLevel,
  onRetry,
  onOpenCustomModal,
}: ResultsModalProps) {
  const isLesson = mode === 'lesson';
  const isPassed = status === 'passed' && !securityFlag;

  const getTitle = () => {
    if (securityFlag) return 'Session Flagged';
    if (isLesson) {
      return isPassed
        ? `Level ${levelConfig?.level || 1} Cleared`
        : 'Keep Practicing';
    }
    if (mode === 'timed') return 'Test Complete';
    return 'Practice Complete';
  };

  const getSubtitle = () => {
    if (securityFlag) return 'Suspicious activity was detected during this session.';
    if (isLesson) {
      return isPassed
        ? 'You met the target requirements for this level.'
        : 'Focus on accuracy first, speed will follow.';
    }
    if (mode === 'timed') {
      return `Results for your ${modeLabel || 'timed'} session.`;
    }
    return 'You finished typing the custom text.';
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-center animate-fade-in transition-colors">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
        {getTitle()}
      </h2>

      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-5">{getSubtitle()}</p>

      {securityFlag && (
        <div className="mb-4 p-3 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-600 dark:text-neutral-400 text-xs">
          {securityFlag}
        </div>
      )}

      <div className="space-y-2 mb-5 text-sm">
        <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-neutral-500 dark:text-neutral-500">Speed</span>
          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {wpm} wpm
            {isLesson && levelConfig && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                / {levelConfig.targetWpm}
              </span>
            )}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-neutral-500 dark:text-neutral-500">Accuracy</span>
          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {accuracy}%
            {isLesson && levelConfig && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
                / {levelConfig.targetAccuracy}%
              </span>
            )}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-neutral-500 dark:text-neutral-500">Best Combo</span>
          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {maxCombo}x
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="flex-1 py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 font-medium rounded-md text-sm cursor-pointer flex items-center justify-center gap-2"
        >
          Retry
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-500 rounded">
            R
          </kbd>
        </button>

        {isLesson && onNextLevel ? (
          <button
            onClick={onNextLevel}
            className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-md text-sm cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {levelConfig && levelConfig.level >= 50
              ? isPassed ? 'Done' : 'Replay'
              : isPassed ? 'Next' : 'Skip'}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-neutral-900/20 rounded">
              ↵
            </kbd>
          </button>
        ) : mode === 'custom' && onOpenCustomModal ? (
          <button
            onClick={onOpenCustomModal}
            className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-md text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            Edit Text
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-md text-sm cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Next
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-neutral-900/20 rounded">
              ↵
            </kbd>
          </button>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 dark:text-neutral-600">
        Press <kbd className="px-1 py-0.5 font-mono bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">Enter</kbd> or{' '}
        <kbd className="px-1 py-0.5 font-mono bg-neutral-200 dark:bg-neutral-800 rounded text-[10px]">R</kbd> to continue
      </div>
    </div>
  );
}
