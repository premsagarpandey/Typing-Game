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
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/20 shadow-md transition-colors">
      {/* Mode / Level indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {isLesson ? 'Level' : mode === 'timed' ? 'Mode' : 'Custom'}
        </span>
        <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
          {isLesson ? level : mode === 'timed' ? `${initialTime || 30}s Test` : 'Text'}
        </span>
      </div>

      {/* Time Remaining */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          Time
        </span>
        <span
          className={`text-xl font-bold ${
            timeRemaining <= 5 && timeRemaining > 0
              ? 'text-red-500 dark:text-red-400 animate-pulse'
              : 'text-slate-800 dark:text-gray-100'
          }`}
        >
          {timeRemaining > 0 ? `${timeRemaining}s` : '∞'}
        </span>
      </div>

      {/* WPM */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          WPM
        </span>
        <span className="text-xl font-bold text-slate-800 dark:text-gray-100">
          {wpm}{' '}
          {isLesson && targetWpm ? (
            <span className="text-xs font-normal text-slate-500 dark:text-gray-400">
              / {targetWpm}
            </span>
          ) : null}
        </span>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          Accuracy
        </span>
        <span className="text-xl font-bold text-slate-800 dark:text-gray-100">
          {accuracy}%{' '}
          {isLesson && targetAccuracy ? (
            <span className="text-xs font-normal text-slate-500 dark:text-gray-400">
              / {targetAccuracy}%
            </span>
          ) : null}
        </span>
      </div>

      {/* Combo */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Combo
        </span>
        <span className="text-xl font-bold text-amber-600 dark:text-amber-300">{combo}x</span>
      </div>
    </div>
  );
}
