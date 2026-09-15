import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
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

/** How many visible lines to show at once */
const VISIBLE_LINES = 3;

/**
 * Splits `targetText` into visual word-tokens, each token preserving its
 * original start index in the full text.
 */
function tokenize(text: string) {
  const tokens: { text: string; startIndex: number }[] = [];
  const regex = /\S+|\s+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({ text: match[0], startIndex: match.index });
  }
  return tokens;
}

/**
 * Given word tokens and a container width, compute which tokens belong to each
 * visual line.  Uses a canvas-based measurement so we don't need the DOM to be
 * mounted yet (avoids flicker).
 */
function computeLines(
  tokens: { text: string; startIndex: number }[],
  containerWidth: number,
  fontSize: number,
  font: string
): { text: string; startIndex: number }[][] {
  if (containerWidth <= 0 || tokens.length === 0) return [];

  // Use OffscreenCanvas / fallback Canvas for text measurement
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${fontSize}px ${font}`;

  const lines: { text: string; startIndex: number }[][] = [];
  let currentLine: { text: string; startIndex: number }[] = [];
  let lineWidth = 0;

  for (const token of tokens) {
    const tokenWidth = ctx.measureText(token.text).width;

    // If this token alone exceeds the line AND we already have content, wrap.
    if (lineWidth + tokenWidth > containerWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [];
      lineWidth = 0;
    }

    currentLine.push(token);
    lineWidth += tokenWidth;
  }

  if (currentLine.length > 0) lines.push(currentLine);
  return lines;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Container width for line computation
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width on mount & resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      // Account for padding (p-6 = 24px each side on sm, p-8 = 32px)
      const style = getComputedStyle(el);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      setContainerWidth(el.clientWidth - paddingLeft - paddingRight);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Shake on error
  useEffect(() => {
    if (shakeTrigger > 0) {
      controls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.25 },
      });
    }
  }, [shakeTrigger, controls]);

  // Auto-focus
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

  // Tokenize text
  const tokens = useMemo(() => tokenize(targetText), [targetText]);

  // Compute font metrics – match the monospace font set in CSS
  const fontSize = typeof window !== 'undefined' && window.innerWidth >= 640 ? 24 : 20;
  const fontFamily = "'JetBrains Mono', 'Fira Code', monospace";

  // Break tokens into visual lines
  const lines = useMemo(
    () => computeLines(tokens, containerWidth, fontSize, fontFamily),
    [tokens, containerWidth, fontSize, fontFamily]
  );

  // Determine which line the caret is on
  const activeLineIndex = useMemo(() => {
    const caretPos = typedText.length;
    for (let i = 0; i < lines.length; i++) {
      const lineTokens = lines[i];
      const lastToken = lineTokens[lineTokens.length - 1];
      const lineEnd = lastToken.startIndex + lastToken.text.length;
      if (caretPos < lineEnd) return i;
    }
    return Math.max(0, lines.length - 1);
  }, [lines, typedText.length]);

  // The "scroll offset" line – the first visible line index.
  // We keep the active line at position 0 (top) of the 3-line window,
  // but only start scrolling once the user has finished line 0.
  const scrollLineIndex = useMemo(() => {
    // Keep line 0 visible at start; once caret reaches line 1+, scroll so
    // the active line is always the top visible line.
    if (activeLineIndex <= 0) return 0;
    return activeLineIndex;
  }, [activeLineIndex]);

  // Line height in px – we use this for the scroll transform
  const lineHeightPx = fontSize * 2; // ~2em for comfortable spacing

  // Focus handler
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative w-full">
      {securityFlag && (
        <div className="mb-3 px-4 py-2 border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-700 dark:text-red-400 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>Security Notice: {securityFlag}</span>
        </div>
      )}

      <motion.div
        ref={containerRef}
        animate={controls}
        className={`typing-area-container relative p-6 sm:p-8 rounded-xl border ${
          securityFlag
            ? 'border-red-400/50 dark:border-red-500/30'
            : 'border-neutral-200 dark:border-neutral-800'
        } font-mono select-none transition-all duration-200 bg-white dark:bg-neutral-900/60 shadow-xs backdrop-blur-xs cursor-text`}
        style={{
          height: `${lineHeightPx * VISIBLE_LINES + (fontSize >= 24 ? 64 : 48)}px`,
          overflow: 'hidden',
          fontSize: `${fontSize}px`,
        }}
        onClick={handleContainerClick}
      >
        {/* Transparent input overlay for capturing keystrokes */}
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

        {/* Scrolling lines container */}
        <div
          className="typing-lines-track pointer-events-none select-none"
          style={{
            transform: `translateY(-${scrollLineIndex * lineHeightPx}px)`,
            transition: 'transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {lines.map((lineTokens, lineIdx) => {
            const distFromActive = lineIdx - activeLineIndex;

            return (
              <div
                key={lineIdx}
                className="typing-line flex flex-wrap items-baseline whitespace-pre"
                style={{
                  height: `${lineHeightPx}px`,
                  lineHeight: `${lineHeightPx}px`,
                  opacity:
                    distFromActive < 0
                      ? 0 // already typed lines – hidden
                      : distFromActive === 0
                      ? 1
                      : distFromActive === 1
                      ? 0.5
                      : 0.25,
                  transition: 'opacity 0.28s ease',
                  filter: distFromActive < 0 ? 'blur(2px)' : 'none',
                }}
              >
                {lineTokens.map(({ text: wordText, startIndex }) => (
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
                          {/* Smooth caret */}
                          {isCurrent && (
                            <span
                              className="typing-caret absolute -left-[1px] top-[0.25em] bottom-[0.25em] w-[2.5px] rounded-full"
                              style={{
                                background: 'var(--caret-color, currentColor)',
                              }}
                            />
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
            );
          })}
        </div>

        {/* Top fade mask for scrolled-out lines */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-[5]"
          style={{
            height: '20px',
            background:
              'linear-gradient(to bottom, var(--typing-area-bg, rgba(255,255,255,1)), transparent)',
            opacity: scrollLineIndex > 0 ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </motion.div>
    </div>
  );
}
