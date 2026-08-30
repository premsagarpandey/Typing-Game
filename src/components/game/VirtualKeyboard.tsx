interface VirtualKeyboardProps {
  nextChar: string;
}

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default function VirtualKeyboard({ nextChar }: VirtualKeyboardProps) {
  const targetKey = nextChar?.toLowerCase();

  return (
    <div className="flex flex-col gap-1.5 items-center justify-center select-none py-2">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const isHighlighted = targetKey === key;
            return (
              <div
                key={key}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-semibold uppercase rounded-lg border transition-all ${
                  isHighlighted
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10 shadow-xs dark:shadow-none'
                }`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
      <div
        className={`w-48 sm:w-64 h-8 sm:h-9 flex items-center justify-center text-xs font-semibold uppercase rounded-lg border transition-all ${
          targetKey === ' '
            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30 scale-105'
            : 'bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10 shadow-xs dark:shadow-none'
        }`}
      >
        Space
      </div>
    </div>
  );
}
