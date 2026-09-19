import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  getKeyboardLayout,
  getFingerInfoForLayout,
  KEYBOARD_LAYOUTS,
  type KeyboardLayoutId,
} from '../../data/keyboardLayouts';

interface VirtualKeyboardProps {
  nextChar: string;
  showLayoutPicker?: boolean;
}

export default function VirtualKeyboard({ nextChar, showLayoutPicker = true }: VirtualKeyboardProps) {
  const [layoutId, setLayoutId] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const layout = getKeyboardLayout(layoutId);

  const targetChar = nextChar || '';
  const fingerInfo = getFingerInfoForLayout(targetChar, layoutId);
  const lowerTarget = targetChar.toLowerCase();

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none pt-2 pb-1">
      {/* Top Header: Finger hint + Layout Indicator */}
      <div className="w-full flex items-center justify-between px-1 max-w-xl">
        {/* Finger hint */}
        <div className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-mono">
          {targetChar ? (
            <span className="animate-fade-in inline-flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold font-mono text-xs">
                {targetChar === ' ' ? '␣ Space' : targetChar}
              </span>
              <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                — {fingerInfo.hand} {fingerInfo.finger}
              </span>
            </span>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600">Ready to type</span>
          )}
        </div>

        {/* Layout quick switcher */}
        {showLayoutPicker && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Layout:</span>
            <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100/70 dark:bg-neutral-900/70">
              {(Object.keys(KEYBOARD_LAYOUTS) as KeyboardLayoutId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLayoutId(id)}
                  className={`px-2 py-1 text-[11px] uppercase font-mono font-medium rounded-md transition-all cursor-pointer ${
                    layoutId === id
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                  title={`${KEYBOARD_LAYOUTS[id].name} - ${KEYBOARD_LAYOUTS[id].shortDesc}`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Matrix */}
      <div className="flex flex-col gap-1 sm:gap-1.5 items-center justify-center p-2.5 sm:p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/50 backdrop-blur-xs shadow-2xs">
        {layout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
            {row.map((item) => {
              const isMatch =
                lowerTarget === item.key.toLowerCase() ||
                (item.shift !== undefined && targetChar === item.shift);
              const isHomeBump = layout.homeBumps.includes(item.key.toLowerCase());

              return (
                <div
                  key={`${item.key}-${item.shift || ''}`}
                  className={`relative h-8 sm:h-9 min-w-7 sm:min-w-8.5 md:min-w-9 px-1 sm:px-1.5 flex flex-col items-center justify-center font-medium rounded-lg transition-all duration-100 ${
                    isMatch
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-105 shadow-md ring-2 ring-neutral-400 dark:ring-neutral-400 z-10'
                      : 'bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/90 dark:border-neutral-700/60 shadow-2xs'
                  }`}
                >
                  {item.shift && (
                    <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 -mb-0.5 leading-none">
                      {item.shift}
                    </span>
                  )}
                  <span className="uppercase font-mono text-xs sm:text-[13px] font-semibold leading-none">
                    {item.key}
                  </span>
                  {isHomeBump && (
                    <span className="absolute bottom-1 w-2.5 h-[2px] bg-neutral-400 dark:bg-neutral-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space bar */}
        <div className="flex gap-1 sm:gap-1.5 justify-center w-full mt-0.5">
          <div
            className={`h-8 sm:h-9 w-52 sm:w-64 md:w-72 flex items-center justify-center text-xs sm:text-sm font-medium font-mono rounded-lg transition-all duration-100 ${
              targetChar === ' '
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-[1.02] shadow-md ring-2 ring-neutral-400 dark:ring-neutral-400'
                : 'bg-white dark:bg-neutral-800/80 text-neutral-400 dark:text-neutral-500 border border-neutral-200/90 dark:border-neutral-700/60 shadow-2xs'
            }`}
          >
            space
          </div>
        </div>
      </div>
    </div>
  );
}
