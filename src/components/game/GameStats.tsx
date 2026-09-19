import type { GameMode } from '../../hooks/useTypingGame';

interface GameStatsProps {
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  combo: number;
  mode?: GameMode;
  level?: number;
  targetWpm?: number;
  targetAccuracy?: number;
  initialTime?: number;
}

export default function GameStats({
  timeRemaining,
  wpm,
  accuracy,
  combo,
  mode = 'lesson',
  level = 1,
  targetWpm,
  targetAccuracy,
  initialTime,
}: GameStatsProps) {
  const isLesson = mode === 'lesson';

  return (
    <div className="flex items-center justify-between gap-6 py-2 px-1 border-b border-neutral-200 dark:border-neutral-800 text-sm">
      {/* Mode / Level */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
          {isLesson ? 'Lvl' : mode === 'timed' ? 'Mode' : mode === 'quotes' ? 'Quote' : mode === 'code' ? 'Code' : 'Custom'}
        </span>
        <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          {isLesson ? level : mode === 'timed' ? `${initialTime || 30}s` : mode === 'quotes' ? '💬' : mode === 'code' ? '⌨' : '✏'}
        </span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">Time</span>
        <span
          className={`font-mono font-semibold ${
            timeRemaining <= 5 && timeRemaining > 0
              ? 'text-red-500 dark:text-red-400'
              : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {timeRemaining > 0 ? `${timeRemaining}s` : '∞'}
        </span>
      </div>

      {/* WPM */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">WPM</span>
        <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          {wpm}
          {isLesson && targetWpm ? (
            <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">
              /{targetWpm}
            </span>
          ) : null}
        </span>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">Acc</span>
        <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          {accuracy}%
          {isLesson && targetAccuracy ? (
            <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">
              /{targetAccuracy}%
            </span>
          ) : null}
        </span>
      </div>

      {/* Combo */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">Combo</span>
        <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">{combo}x</span>
      </div>
    </div>
  );
}
