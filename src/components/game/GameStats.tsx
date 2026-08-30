interface GameStatsProps {
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  combo: number;
  level: number;
  targetWpm: number;
  targetAccuracy: number;
}

export default function GameStats({
  timeRemaining,
  wpm,
  accuracy,
  combo,
  level,
  targetWpm,
  targetAccuracy,
}: GameStatsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/20 shadow-md transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Level</span>
        <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{level}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">Time</span>
        <span className={`text-xl font-bold ${timeRemaining <= 5 ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-slate-800 dark:text-gray-100'}`}>
          {timeRemaining}s
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">WPM</span>
        <span className="text-xl font-bold text-slate-800 dark:text-gray-100">
          {wpm} <span className="text-xs font-normal text-slate-500 dark:text-gray-400">/ {targetWpm}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">Accuracy</span>
        <span className="text-xl font-bold text-slate-800 dark:text-gray-100">
          {accuracy}% <span className="text-xs font-normal text-slate-500 dark:text-gray-400">/ {targetAccuracy}%</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Combo</span>
        <span className="text-xl font-bold text-amber-600 dark:text-amber-300">{combo}x</span>
      </div>
    </div>
  );
}
