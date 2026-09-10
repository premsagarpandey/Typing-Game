import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameStatus } from '../../hooks/useTypingGame';
import { antiCheatEngine } from '../../utils/antiCheat';
import { useTheme } from '../../hooks/useTheme';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (shakeTrigger > 0) {
      controls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.3 },
      });
    }
  }, [shakeTrigger, controls]);

  useEffect(() => {
    if (status === 'idle' || status === 'playing') {
      const timer = setTimeout(() => inputRef.current?.focus(), 15);
      return () => clearTimeout(timer);
    }
  }, [status, targetText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    antiCheatEngine.handleKeyEvent(e);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full">
      {securityFlag && (
        <div className="mb-3 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-600 dark:text-neutral-400 text-xs font-medium flex items-center justify-between">
          <span>Flagged: {securityFlag}</span>
        </div>
      )}

      <motion.div
        animate={controls}
        className={`relative p-6 sm:p-8 rounded-lg border ${
          securityFlag
            ? 'border-red-400/50 dark:border-red-500/30'
            : 'border-neutral-200 dark:border-neutral-800'
        } text-xl sm:text-2xl font-mono cursor-text overflow-hidden min-h-[160px] select-none transition-colors bg-neutral-50 dark:bg-neutral-900/50`}
        onClick={() => inputRef.current?.focus()}
      >
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
          className="absolute opacity-0 h-0 w-0 pointer-events-none"
        />

        <div className="flex flex-wrap leading-relaxed tracking-wide select-none">
          {targetText.split('').map((char, index) => {
            const isTyped = index < typedText.length;
            const isCorrect = isTyped && typedText[index] === char;
            const isError = isTyped && !isCorrect;
            const isCurrent = index === typedText.length;
            const isSpace = char === ' ';

            return (
              <span key={index} className="relative inline-flex justify-center items-baseline px-[0.5px]">
                {isCurrent && (
                  <motion.span
                    layoutId="caret"
                    className="absolute left-0 bottom-0.5 w-[2px] h-[60%] bg-neutral-900 dark:bg-neutral-100 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      opacity: { repeat: Infinity, duration: 1 },
                      layout: { type: 'spring', stiffness: 350, damping: 30 },
                    }}
                  />
                )}
                <motion.span
                  initial={false}
                  animate={{
                    color: isError
                      ? (isDark ? '#ef4444' : '#dc2626')
                      : isCorrect
                      ? (isDark ? '#d4d4d4' : '#404040')
                      : isCurrent
                      ? (isDark ? '#e5e5e5' : '#171717')
                      : (isDark ? '#525252' : '#a3a3a3'),
                    scale: isTyped ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.1 }}
                  className={`${
                    isError ? 'bg-red-500/10 dark:bg-red-500/15 rounded-sm px-0.5' : ''
                  } ${
                    isSpace && !isTyped && !isCurrent ? 'opacity-30' : ''
                  }`}
                >
                  {isSpace ? '·' : char}
                </motion.span>
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
