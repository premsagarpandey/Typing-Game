import { useRef, useEffect } from 'react';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    antiCheatEngine.handleKeyEvent(e);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    console.warn('[Typlix Anti-Cheat] Paste attempt blocked');
  };

  return (
    <div className="relative w-full">
      {securityFlag && (
        <div className="mb-3 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span>🛡️ Anti-Cheat Alert:</span>
            <span>{securityFlag}</span>
          </div>
          <span className="text-[10px] bg-red-500/30 px-2 py-0.5 rounded">FLAGGED</span>
        </div>
      )}

      <motion.div
        animate={controls}
        className={`relative bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border ${
          securityFlag ? 'border-red-500/50' : 'border-white/20'
        } text-2xl sm:text-3xl font-mono cursor-text shadow-2xl overflow-hidden min-h-[160px] select-none`}
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
    </div>
  );
}

