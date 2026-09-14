import { useRef, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameStatus } from '../../hooks/useTypingGame';
import { antiCheatEngine } from '../../utils/antiCheat';

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  status: GameStatus;
  shakeTrigger: number;
  securityFlag?: string | null;
  onInput: (value: string) => void;
}

export default function TypingArea({
  targetText,
  typedText,
  status,
  shakeTrigger,
  securityFlag,
  onInput,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (shakeTrigger > 0) {
      controls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.25 },
      });
    }
  }, [shakeTrigger, controls]);

  useEffect(() => {
    if (status === 'idle' || status === 'playing') {
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }
  }, [status, targetText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    antiCheatEngine.handleKeyEvent(e);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  // Group text into words with start indices so words never wrap awkwardly across lines
  const words = useMemo(() => {
    const tokens: { text: string; startIndex: number }[] = [];
    const regex = /\S+|\s+/g;
    let match;
    while ((match = regex.exec(targetText)) !== null) {
      tokens.push({ text: match[0], startIndex: match.index });
    }
    return tokens;
  }, [targetText]);

  return (
    <div className="relative w-full">
      {securityFlag && (
        <div className="mb-3 px-4 py-2 border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-700 dark:text-red-400 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>Security Notice: {securityFlag}</span>
        </div>
      )}

      <motion.div
        animate={controls}
        className={`relative p-6 sm:p-8 rounded-xl border ${
          securityFlag
            ? 'border-red-400/50 dark:border-red-500/30'
            : 'border-neutral-200 dark:border-neutral-800'
        } text-xl sm:text-2xl font-mono min-h-[160px] select-none transition-all duration-200 bg-white dark:bg-neutral-900/60 shadow-xs backdrop-blur-xs`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Full overlay transparent input: guarantees 100% reliable focus on click/tap */}
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onDrop={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          disabled={status !== 'idle' && status !== 'playing'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Typing input field"
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 p-0 m-0"
        />

        {/* Display Text: words wrap naturally as complete units */}
        <div className="flex flex-wrap items-baseline leading-relaxed tracking-wide select-none pointer-events-none gap-y-1.5">
          {words.map(({ text: wordText, startIndex }) => (
            <span key={startIndex} className="inline-flex whitespace-pre">
              {wordText.split('').map((char, i) => {
                const index = startIndex + i;
                const isTyped = index < typedText.length;
                const isCorrect = isTyped && typedText[index] === char;
                const isError = isTyped && !isCorrect;
                const isCurrent = index === typedText.length;
                const isSpace = char === ' ';

                return (
                  <span key={index} className="relative inline-block">
                    {/* Modern active caret */}
                    {isCurrent && (
                      <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-neutral-900 dark:bg-neutral-100 rounded-full animate-pulse" />
                    )}

                    <span
                      className={`transition-colors duration-75 ${
                        isError
                          ? isSpace
                            ? 'bg-red-500/25 border-b-2 border-red-500 text-transparent rounded-xs'
                            : 'text-red-500 dark:text-red-400 bg-red-500/15 rounded-xs'
                          : isCorrect
                          ? 'text-neutral-800 dark:text-neutral-200'
                          : isCurrent
                          ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                          : 'text-neutral-400 dark:text-neutral-600'
                      }`}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

