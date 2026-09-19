import type { GameMode } from '../../hooks/useTypingGame';

interface GameStatsProps {
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  combo: number;
  mode?: GameMode;
  level?: number;
  levelTitle?: string;
  targetWpm?: number;
  targetAccuracy?: number;
  initialTime?: number;
  onPrevLevel?: () => void;
  onNextLevel?: () => void;
  hasPrevLevel?: boolean;
  hasNextLevel?: boolean;
  selectedDuration?: number;
  onSelectDuration?: (dur: number) => void;
  onOpenCustomModal?: () => void;
}

export default function GameStats({
  timeRemaining,
  wpm,
  accuracy,
  combo,
  mode = 'lesson',
  level = 1,
  levelTitle,
  targetWpm,
  targetAccuracy,
  initialTime,
  onPrevLevel,
  onNextLevel,
  hasPrevLevel = false,
  hasNextLevel = false,
  selectedDuration,
  onSelectDuration,
  onOpenCustomModal,
}: GameStatsProps) {
  const isLesson = mode === 'lesson';

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-1 text-sm select-none">
      {/* ─── LEFT: Level Number + Name + Prev/Next Buttons OR Timed Durations OR Custom Button ─── */}
      <div className="flex items-center gap-2 min-w-0">
        {isLesson ? (
          <div className="flex items-center gap-2 min-w-0">
            {onPrevLevel && (
              <button
                type="button"
                onClick={onPrevLevel}
                disabled={!hasPrevLevel}
                className="px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-25 disabled:pointer-events-none cursor-pointer text-neutral-600 dark:text-neutral-400 transition-colors"
                title="Previous Level"
              >
                ◀
              </button>
            )}

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                Lvl {level}
              </span>
              {levelTitle && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[140px] sm:max-w-[220px] md:max-w-[320px]">
                    {levelTitle}
                  </span>
                </>
              )}
            </div>

            {onNextLevel && (
              <button
                type="button"
                onClick={onNextLevel}
                disabled={!hasNextLevel}
                className="px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-25 disabled:pointer-events-none cursor-pointer text-neutral-600 dark:text-neutral-400 transition-colors"
                title="Next Level"
              >
                ▶
              </button>
            )}
          </div>
        ) : mode === 'timed' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <span>⏱</span>
              <span>Time:</span>
            </span>
            <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-100/60 dark:bg-neutral-800/60 p-0.5">
              {[15, 30, 60, 120].map((dur) => {
                const isSelected = (selectedDuration || initialTime || 30) === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => onSelectDuration?.(dur)}
                    className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-2xs font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50'
                    }`}
                    title={`${dur}s speed test`}
                  >
                    {dur}s
                  </button>
                );
              })}
            </div>
          </div>
        ) : mode === 'custom' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <span>✏</span>
              <span>Custom</span>
            </span>
            {onOpenCustomModal && (
              <button
                type="button"
                onClick={onOpenCustomModal}
                className="px-2.5 py-0.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                title="Enter or edit custom practice text"
              >
                <span className="text-neutral-500 dark:text-neutral-400">✎</span>
                <span>Enter Custom Text</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">
              {mode === 'quotes'
                ? '💬 Quotes'
                : '⌨ Code'}
            </span>
          </div>
        )}
      </div>

      {/* ─── RIGHT: TIME, WPM, ACC, COMBO (Grouped close together) ─── */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Time */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
            Time
          </span>
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
          <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
            WPM
          </span>
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
          <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
            Acc
          </span>
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
          <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
            Combo
          </span>
          <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {combo}x
          </span>
        </div>
      </div>
    </div>
  );
}

