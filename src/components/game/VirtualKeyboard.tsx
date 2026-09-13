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
    <div className="w-full flex flex-col items-center gap-2 select-none pt-1 pb-2">
      {/* Top Header: Finger hint + Layout Indicator */}
      <div className="w-full flex items-center justify-between px-1 max-w-lg">
        {/* Finger hint */}
        <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          {targetChar ? (
            <span className="animate-fade-in inline-flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold">
                {targetChar === ' ' ? '␣ Space' : targetChar}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                — {fingerInfo.hand} {fingerInfo.finger}
              </span>
            </span>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600">Ready to type</span>
          )}
        </div>

        {/* Layout quick switcher */}
        {showLayoutPicker && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600 font-medium">Layout:</span>
            <div className="inline-flex rounded-md border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100/60 dark:bg-neutral-900/60">
              {(Object.keys(KEYBOARD_LAYOUTS) as KeyboardLayoutId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLayoutId(id)}
                  className={`px-1.5 py-0.5 text-[10px] uppercase font-mono font-medium rounded transition-all cursor-pointer ${
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
      <div className="flex flex-col gap-1 items-center justify-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/40 backdrop-blur-xs">
        {layout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((item) => {
              const isMatch =
                lowerTarget === item.key.toLowerCase() ||
                (item.shift !== undefined && targetChar === item.shift);
              const isHomeBump = layout.homeBumps.includes(item.key.toLowerCase());

              return (
                <div
                  key={`${item.key}-${item.shift || ''}`}
                  className={`relative h-8 min-w-7 sm:min-w-8 px-1 flex flex-col items-center justify-center text-xs font-medium rounded transition-all duration-100 ${
                    isMatch
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-105 shadow-sm ring-2 ring-neutral-400 dark:ring-neutral-500'
                      : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50'
                  }`}
                >
                  {item.shift && (
                    <span className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 -mb-1">
                      {item.shift}
                    </span>
                  )}
                  <span className="uppercase font-mono text-[11px] leading-none">
                    {item.key}
                  </span>
                  {isHomeBump && (
                    <span className="absolute bottom-0.5 w-2 h-[1.5px] bg-neutral-400 dark:bg-neutral-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space bar */}
        <div className="flex gap-1 justify-center w-full mt-0.5">
          <div
            className={`h-8 w-48 sm:w-64 flex items-center justify-center text-xs font-medium font-mono rounded transition-all duration-100 ${
              targetChar === ' '
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-[1.02] shadow-sm ring-2 ring-neutral-400 dark:ring-neutral-500'
                : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700/50'
            }`}
          >
            space
          </div>
        </div>
      </div>
    </div>
  );
}
