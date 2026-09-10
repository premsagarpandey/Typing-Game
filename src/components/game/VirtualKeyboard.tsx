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
    <div className="w-full flex flex-col items-center gap-2.5 select-none pt-1 pb-3">
      {/* Finger hint */}
      {targetChar && (
        <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono animate-fade-in">
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            {targetChar === ' ' ? 'Space' : targetChar.toUpperCase()}
          </span>
          {' '}— {fingerInfo.hand} {fingerInfo.finger}
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1 items-center justify-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((item) => {
              const isMatch =
                lowerTarget === item.key ||
                (item.shift !== undefined && targetChar === item.shift);
              const isHomeBump = item.key === 'f' || item.key === 'j';

              return (
                <div
                  key={item.key}
                  className={`relative h-8 min-w-7 sm:min-w-8 px-1 flex flex-col items-center justify-center text-xs font-medium rounded transition-all duration-100 ${
                    isMatch
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700/50'
                  }`}
                >
                  <span className="uppercase font-mono text-[11px]">{item.key}</span>
                  {isHomeBump && (
                    <span className="absolute bottom-0.5 w-2 h-[1.5px] bg-neutral-400 dark:bg-neutral-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space */}
        <div className="flex gap-1 justify-center w-full mt-0.5">
          <div
            className={`h-8 w-48 sm:w-64 flex items-center justify-center text-xs font-medium font-mono rounded transition-all duration-100 ${
              targetChar === ' '
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 scale-[1.02]'
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
