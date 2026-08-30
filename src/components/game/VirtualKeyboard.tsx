import { getFingerInfo } from '../../data/levels';

interface VirtualKeyboardProps {
  nextChar: string;
}

interface KeyItem {
  key: string;
  shift?: string;
}

const KEYBOARD_ROWS: KeyItem[][] = [
  [
    { key: '`', shift: '~' },
    { key: '1', shift: '!' },
    { key: '2', shift: '@' },
    { key: '3', shift: '#' },
    { key: '4', shift: '$' },
    { key: '5', shift: '%' },
    { key: '6', shift: '^' },
    { key: '7', shift: '&' },
    { key: '8', shift: '*' },
    { key: '9', shift: '(' },
    { key: '0', shift: ')' },
    { key: '-', shift: '_' },
    { key: '=', shift: '+' },
  ],
  [
    { key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' }, { key: 't' },
    { key: 'y' }, { key: 'u' }, { key: 'i' }, { key: 'o' }, { key: 'p' },
    { key: '[' }, { key: ']' },
  ],
  [
    { key: 'a' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' },
    { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }, { key: ';' },
    { key: "'" },
  ],
  [
    { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' },
    { key: 'n' }, { key: 'm' }, { key: ',' }, { key: '.' }, { key: '/' },
  ],
];

export default function VirtualKeyboard({ nextChar }: VirtualKeyboardProps) {
  const targetChar = nextChar || '';
  const fingerInfo = getFingerInfo(targetChar);
  const lowerTarget = targetChar.toLowerCase();

  return (
    <div className="w-full flex flex-col items-center gap-3 select-none pt-1 pb-3">
      {/* Active Finger Recommendation Hint */}
      {targetChar && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 rounded-full text-xs font-medium text-blue-600 dark:text-blue-300 animate-fade-in shadow-xs">
          <span className="font-bold">👉 Next Key:</span>
          <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-mono font-bold uppercase text-xs">
            {targetChar === ' ' ? 'Space' : targetChar}
          </span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span>
            Use <strong className="text-blue-600 dark:text-blue-300">{fingerInfo.hand} Hand ({fingerInfo.finger} Finger)</strong>
          </span>
        </div>
      )}

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 items-center justify-center p-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
            {row.map((item) => {
              const isMatch =
                lowerTarget === item.key ||
                (item.shift !== undefined && targetChar === item.shift);
              const isHomeBump = item.key === 'f' || item.key === 'j';

              return (
                <div
                  key={item.key}
                  className={`relative h-9 min-w-7 sm:min-w-9 px-1.5 flex flex-col items-center justify-center text-xs font-semibold rounded-lg border transition-all duration-150 ${
                    isMatch
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/40 scale-110 z-10 animate-bounce'
                      : 'bg-white dark:bg-white/5 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <span className="uppercase">{item.key}</span>
                  {isHomeBump && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space Bar Row */}
        <div className="flex gap-1.5 justify-center w-full mt-0.5">
          <div
            className={`h-9 w-52 sm:w-72 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all duration-150 ${
              targetChar === ' '
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/40 scale-105 z-10 animate-bounce'
                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10'
            }`}
          >
            Space (Thumb)
          </div>
        </div>
      </div>
    </div>
  );
}
