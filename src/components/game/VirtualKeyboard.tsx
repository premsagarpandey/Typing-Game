import { memo, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  getKeyboardLayout,
  getFingerInfoForLayout,
  type KeyboardLayoutId,
} from '../../data/keyboardLayouts';

interface VirtualKeyboardProps {
  nextChar: string;
}

function VirtualKeyboardComponent({ nextChar }: VirtualKeyboardProps) {
  const [layoutId] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const layout = useMemo(() => getKeyboardLayout(layoutId), [layoutId]);

  const targetChar = nextChar || '';
  const fingerInfo = useMemo(() => getFingerInfoForLayout(targetChar, layoutId), [targetChar, layoutId]);
  const lowerTarget = targetChar.toLowerCase();

  return (
    <div
      className="w-full flex flex-col items-center gap-2.5 select-none pt-3 sm:pt-4 pb-2 sm:pb-3"
      onMouseDown={(e) => {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'BUTTON') e.preventDefault();
      }}
    >
      {/* Top Header: Finger hint + Current Layout Indicator (configured in Settings) */}
      <div className="w-full flex items-center justify-between px-1.5 max-w-2xl md:max-w-3xl">
        {/* Finger hint */}
        <div className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-mono">
          {targetChar ? (
            <span className="animate-fade-in inline-flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold font-mono text-xs sm:text-sm shadow-2xs">
                {targetChar === ' ' ? '␣ Space' : targetChar}
              </span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium text-xs sm:text-sm">
                — {fingerInfo.hand} {fingerInfo.finger}
              </span>
            </span>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600 font-medium">Ready to type</span>
          )}
        </div>

        {/* Read-only Layout badge (configured in Settings) */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span
            className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            title="Keyboard layout can be changed in Settings"
          >
            {layout.name}
          </span>
        </div>
      </div>

      {/* Keyboard Matrix (enlarged & comfortable touch/visual target) */}
      <div className="flex flex-col gap-1.5 sm:gap-2 items-center justify-center p-3 sm:p-4 md:p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 backdrop-blur-xs shadow-xs">
        {layout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 sm:gap-2 justify-center">
            {row.map((item) => {
              const isMatch =
                lowerTarget === item.key.toLowerCase() ||
                (item.shift !== undefined && targetChar === item.shift);
              const isHomeBump = layout.homeBumps.includes(item.key.toLowerCase());

              return (
                <div
                  key={`${item.key}-${item.shift || ''}`}
                  className={`relative h-10 sm:h-11 md:h-12 min-w-8 sm:min-w-10 md:min-w-11 px-1.5 sm:px-2 md:px-2.5 flex flex-col items-center justify-center font-medium rounded-xl transition-all duration-100 ${
                    isMatch
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-105 shadow-md ring-2 ring-neutral-400 dark:ring-neutral-400 z-10'
                      : 'bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 border border-neutral-200/90 dark:border-neutral-700/60 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  {item.shift && (
                    <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] text-neutral-400 dark:text-neutral-500 -mb-0.5 leading-none">
                      {item.shift}
                    </span>
                  )}
                  <span className="uppercase font-mono text-xs sm:text-sm md:text-[15px] font-bold leading-none">
                    {item.key}
                  </span>
                  {isHomeBump && (
                    <span className="absolute bottom-1 w-3 h-[2px] bg-neutral-400 dark:bg-neutral-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space bar (wider & taller) */}
        <div className="flex gap-1.5 sm:gap-2 justify-center w-full mt-1">
          <div
            className={`h-10 sm:h-11 md:h-12 w-64 sm:w-80 md:w-96 flex items-center justify-center text-xs sm:text-sm font-semibold font-mono rounded-xl transition-all duration-100 ${
              targetChar === ' '
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-[1.02] shadow-md ring-2 ring-neutral-400 dark:ring-neutral-400'
                : 'bg-white dark:bg-neutral-800/90 text-neutral-400 dark:text-neutral-500 border border-neutral-200/90 dark:border-neutral-700/60 shadow-2xs'
            }`}
          >
            space
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(VirtualKeyboardComponent);
