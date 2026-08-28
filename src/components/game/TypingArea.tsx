import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameStatus } from '../../hooks/useTypingGame';

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  status: GameStatus;
  shakeTrigger: number;
  onInput: (value: string) => void;
}

export default function TypingArea({
  targetText,
  typedText,
  status,
  shakeTrigger,
  onInput,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (shakeTrigger > 0) {
      controls.start({
        x: [0, -10, 10, -8, 8, -4, 4, 0],
        transition: { duration: 0.35 },
      });
    }
  }, [shakeTrigger, controls]);

  useEffect(() => {
    if (status === 'idle' || status === 'playing') {
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <motion.div
      animate={controls}
      className="relative bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-white/20 text-2xl sm:text-3xl font-mono cursor-text shadow-2xl overflow-hidden min-h-[160px]"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={(e) => onInput(e.target.value)}
        disabled={status !== 'idle' && status !== 'playing'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
      />

      <div className="flex flex-wrap leading-relaxed tracking-wider select-none text-gray-400">
        {targetText.split('').map((char, index) => {
          const isTyped = index < typedText.length;
          const isCorrect = isTyped && typedText[index] === char;
          const isError = isTyped && !isCorrect;
          const isCurrent = index === typedText.length;

          return (
            <span key={index} className="relative inline-flex justify-center">
              {isCurrent && (
                <motion.span
                  layoutId="caret"
                  className="absolute left-0 bottom-0.5 w-full h-[3px] bg-blue-400 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    opacity: { repeat: Infinity, duration: 0.9 },
                    layout: { type: 'spring', stiffness: 350, damping: 30 },
                  }}
                />
              )}
              <motion.span
                initial={false}
                animate={{
                  color: isError ? '#f87171' : isCorrect ? '#4ade80' : '#9ca3af',
                  scale: isTyped ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.15 }}
                className={`transition-colors ${isError && char === ' ' ? 'bg-red-500/30' : ''} ${
                  isError ? 'bg-red-500/20 rounded-sm' : ''
                }`}
              >
                {char === ' ' && isError ? '\u00A0' : char}
              </motion.span>
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
