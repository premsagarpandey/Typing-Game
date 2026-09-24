import { useRef, useEffect, useMemo, useState, useCallback, memo } from 'react';
import type { GameStatus } from '../../hooks/useTypingGame';
import CapsLockWarningModal from '../common/CapsLockWarningModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  status: GameStatus;
  shakeTrigger: number;
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

// Cached measure canvas to avoid DOM creation on every line break calculation
let cachedMeasureCtx: CanvasRenderingContext2D | null = null;

/**
 * Given word tokens and a container width, compute which tokens belong to each
 * visual line. Uses a cached canvas context for zero-allocation text measurement.
 */
function computeLines(
  tokens: { text: string; startIndex: number }[],
  containerWidth: number,
  fontSize: number,
  font: string
): { text: string; startIndex: number }[][] {
  if (containerWidth <= 0 || tokens.length === 0) return [];

  if (typeof document !== 'undefined' && !cachedMeasureCtx) {
    const canvas = document.createElement('canvas');
    cachedMeasureCtx = canvas.getContext('2d');
  }
  const ctx = cachedMeasureCtx;
  if (!ctx) return [];
  ctx.font = `${fontSize}px ${font}`;

  const lines: { text: string; startIndex: number }[][] = [];
  let currentLine: { text: string; startIndex: number }[] = [];
  let lineWidth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
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

function TypingAreaComponent({
  targetText,
  typedText,
  status,
  shakeTrigger,
  onInput,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Caps Lock state & warning modal control
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoFixCapsLock, setAutoFixCapsLock] = useLocalStorage<boolean>('typlix_capslock_autofix', true);
  const [isShaking, setIsShaking] = useState(false);

  // Stable refs for event listeners
  const typedTextRef = useRef(typedText);
  const targetTextRef = useRef(targetText);
  const statusRef = useRef(status);
  const capsLockOnRef = useRef(capsLockOn);
  const autoFixCapsLockRef = useRef(autoFixCapsLock);
  const onInputRef = useRef(onInput);

  useEffect(() => {
    typedTextRef.current = typedText;
    targetTextRef.current = targetText;
    statusRef.current = status;
    capsLockOnRef.current = capsLockOn;
    autoFixCapsLockRef.current = autoFixCapsLock;
    onInputRef.current = onInput;
  }, [typedText, targetText, status, capsLockOn, autoFixCapsLock, onInput]);

  // Container width for line computation
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width on mount & resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
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

  // Hardware-accelerated CSS shake on error (zero Framer Motion JS overhead)
  useEffect(() => {
    if (shakeTrigger > 0) {
      const frameId = requestAnimationFrame(() => setIsShaking(true));
      const timer = setTimeout(() => setIsShaking(false), 240);
      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timer);
      };
    }
  }, [shakeTrigger]);

  // Multi-layered Caps Lock Detection (getModifierState + key case heuristic)
  const updateCapsLockState = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent | MouseEvent | React.MouseEvent) => {
      let detected: boolean | null = null;

      if (typeof e.getModifierState === 'function') {
        detected = e.getModifierState('CapsLock');
      } else if ('key' in e && typeof e.key === 'string' && e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        if (e.key >= 'A' && e.key <= 'Z' && !e.shiftKey) {
          detected = true;
        } else if (e.key >= 'a' && e.key <= 'z' && !e.shiftKey) {
          detected = false;
        }
      }

      if (detected !== null && detected !== capsLockOnRef.current) {
        setCapsLockOn(detected);
        capsLockOnRef.current = detected;
      }
    },
    []
  );

  // Direct Keystroke Engine & Auto-Focus Keeper
  useEffect(() => {
    if (status !== 'idle' && status !== 'playing') return;

    const focusInput = () => {
      const el = inputRef.current;
      if (!el) return;
      // Don't steal focus from open text inputs or modals (dialogs, overlays)
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;
      if (document.activeElement?.closest('[role="dialog"]')) return;
      if (document.activeElement !== el) {
        el.focus({ preventScroll: true });
      }
    };

    // Initial focus
    const timer = setTimeout(focusInput, 20);

    // Global keydown: captures EVERY typing key directly using stable refs
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      updateCapsLockState(e);

      const currentStatus = statusRef.current;
      if (currentStatus !== 'idle' && currentStatus !== 'playing') return;

      // Don't intercept if focus is in a dialog/modal or textarea/select or another input
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;
      if (document.activeElement?.closest('[role="dialog"]')) return;
      if (document.activeElement?.tagName === 'INPUT' && document.activeElement !== inputRef.current) return;

      // System shortcuts (Ctrl, Alt, Meta)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        if (e.ctrlKey && e.key === 'Backspace') {
          e.preventDefault();
          const currentTyped = typedTextRef.current;
          const trimmed = currentTyped.trimEnd();
          const lastSpace = trimmed.lastIndexOf(' ');
          const nextVal = lastSpace >= 0 ? trimmed.slice(0, lastSpace + 1) : '';
          onInputRef.current(nextVal);
          if (inputRef.current) {
            inputRef.current.value = nextVal;
          }
        }
        return;
      }

      // Handle Backspace directly
      if (e.key === 'Backspace') {
        e.preventDefault();
        const currentTyped = typedTextRef.current;
        if (currentTyped.length > 0) {
          const nextVal = currentTyped.slice(0, -1);
          onInputRef.current(nextVal);
          if (inputRef.current) {
            inputRef.current.value = nextVal;
          }
        }
        return;
      }

      // Prevent Tab from blurring focus out
      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }

      // Printable single character keystroke (letters, numbers, space, punctuation)
      if (e.key.length === 1) {
        e.preventDefault(); // Prevents Space from scrolling the page
        focusInput();

        let charToType = e.key;
        const currentTyped = typedTextRef.current;
        const currentTarget = targetTextRef.current;

        // Smart Auto-Fix: If Caps Lock is ON and auto-fix enabled, match expected target letter case
        if (capsLockOnRef.current && autoFixCapsLockRef.current && currentTyped.length < currentTarget.length) {
          const expectedChar = currentTarget[currentTyped.length];
          if (expectedChar && expectedChar.toLowerCase() === charToType.toLowerCase()) {
            charToType = expectedChar;
          }
        }

        const nextVal = currentTyped + charToType;
        onInputRef.current(nextVal);
        if (inputRef.current) {
          inputRef.current.value = nextVal;
        }
      }
    };

    const handleWindowKeyUp = (e: KeyboardEvent) => {
      updateCapsLockState(e);
    };

    const handlePointerDown = (e: MouseEvent) => {
      updateCapsLockState(e);
    };

    // Re-focus when the hidden input loses focus or window regains focus
    const handleBlur = () => setTimeout(focusInput, 15);
    const handleWindowFocus = () => setTimeout(focusInput, 30);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') setTimeout(focusInput, 50);
    };

    const el = inputRef.current;
    el?.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleWindowKeyDown, true);
    window.addEventListener('keyup', handleWindowKeyUp, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timer);
      el?.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleWindowKeyDown, true);
      window.removeEventListener('keyup', handleWindowKeyUp, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [status, updateCapsLockState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCapsLockState(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCapsLockState(e);
  };

  // Fallback Input Handler for IME / on-screen keyboards
  const handleInputChange = (rawVal: string) => {
    let finalVal = rawVal;

    // Smart Auto-Fix: If Caps Lock is ON and auto-fix is enabled:
    if (capsLockOn && autoFixCapsLock && rawVal.length > typedText.length) {
      const idx = rawVal.length - 1;
      const targetChar = targetText[idx];
      const typedChar = rawVal[idx];

      if (targetChar && typedChar && targetChar.toLowerCase() === typedChar.toLowerCase()) {
        finalVal = rawVal.slice(0, idx) + targetChar;
      }
    }

    onInputRef.current(finalVal);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Tokenize text
  const tokens = useMemo(() => tokenize(targetText), [targetText]);

  // Compute font metrics – match the monospace font set in CSS
  const fontSize = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 30 : window.innerWidth >= 640 ? 26 : 20;
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
  const scrollLineIndex = useMemo(() => {
    if (activeLineIndex <= 0) return 0;
    return activeLineIndex;
  }, [activeLineIndex]);

  // Line height in px – we use this for the scroll transform
  const lineHeightPx = Math.round(fontSize * 1.85);

  // Focus handler
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* ─── Caps Lock Warning Preferences Modal (only on explicit user request) ─── */}
      <CapsLockWarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        autoFixEnabled={autoFixCapsLock}
        onToggleAutoFix={setAutoFixCapsLock}
      />

      {/* ─── Non-intrusive Caps Lock Warning Banner ─── */}
      {capsLockOn && (status === 'idle' || status === 'playing') && (
        <div className="mb-3 px-3.5 sm:px-4 py-2 sm:py-2.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-100/90 dark:bg-neutral-850/90 rounded-xl text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center justify-between gap-2 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
              ⇪ CAPS LOCK
            </span>
            <span className="truncate text-xs text-neutral-600 dark:text-neutral-300">
              {autoFixCapsLock
                ? 'Active — Auto-matching character case to preserve lesson progress.'
                : 'Active — Uppercase keystrokes may register as errors.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer border border-neutral-300 dark:border-neutral-700 shadow-2xs"
          >
            Preferences
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`typing-area-container relative p-5 sm:p-7 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 font-mono select-none transition-all duration-200 bg-white dark:bg-neutral-900/70 shadow-xs backdrop-blur-xs cursor-text ${
          isShaking ? 'animate-shake' : ''
        }`}
        style={{
          height: `${lineHeightPx * VISIBLE_LINES + (fontSize >= 28 ? 52 : 44)}px`,
          overflow: 'hidden',
          fontSize: `${fontSize}px`,
        }}
        onMouseDown={(e) => {
          if (e.target !== inputRef.current) {
            e.preventDefault();
            inputRef.current?.focus();
            if (inputRef.current) {
              const len = inputRef.current.value.length;
              inputRef.current.setSelectionRange(len, len);
            }
          }
        }}
        onClick={handleContainerClick}
      >
        {/* Transparent input overlay for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onClick={(e) => {
            const el = e.currentTarget;
            el.setSelectionRange(el.value.length, el.value.length);
          }}
          onSelect={(e) => {
            const el = e.currentTarget;
            el.setSelectionRange(el.value.length, el.value.length);
          }}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onCopy={handleCopy}
          onCut={(e) => e.preventDefault()}
          disabled={status !== 'idle' && status !== 'playing'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Typing input field"
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 p-0 m-0 select-none"
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

            // Virtualize distant lines to minimize DOM tree size and garbage collection
            const isOutOfWindow = distFromActive < -1 || distFromActive > VISIBLE_LINES + 1;

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
                {isOutOfWindow ? (
                  <div style={{ height: `${lineHeightPx}px` }} />
                ) : (
                  lineTokens.map(({ text: wordText, startIndex }) => {
                    const isCurrentWord =
                      typedText.length >= startIndex && typedText.length < startIndex + wordText.length;

                    return (
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
                              {/* Smooth caret placed BEFORE current untyped character */}
                              {isCurrent && (
                                <span
                                  className="typing-caret absolute -left-[2px] top-[0.18em] bottom-[0.18em] w-[3px] rounded-full z-20 pointer-events-none"
                                  style={{
                                    background: 'var(--caret-color, currentColor)',
                                  }}
                                />
                              )}

                              {/* Caret after the last character when text is completed */}
                              {index === targetText.length - 1 && typedText.length >= targetText.length && (
                                <span
                                  className="typing-caret absolute -right-[2px] top-[0.18em] bottom-[0.18em] w-[3px] rounded-full z-20 pointer-events-none"
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
                                      : 'text-red-500 dark:text-red-400 bg-red-500/15 rounded-xs font-semibold'
                                    : isCorrect
                                    ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                                    : isCurrent
                                    ? isSpace
                                      ? 'animate-target-char border-b-2 border-neutral-900 dark:border-neutral-100 bg-neutral-900/10 dark:bg-neutral-100/15 rounded-xs text-neutral-800 dark:text-neutral-200 font-bold'
                                      : 'animate-target-char text-neutral-950 dark:text-white font-extrabold bg-neutral-900/10 dark:bg-neutral-100/20 ring-1.5 ring-neutral-900/35 dark:ring-neutral-100/40 rounded-xs'
                                    : isCurrentWord
                                    ? 'text-neutral-700 dark:text-neutral-300 font-medium'
                                    : 'text-neutral-400 dark:text-neutral-500'
                                }`}
                              >
                                {isCurrent && isSpace ? '␣' : char}
                              </span>
                            </span>
                          );
                        })}
                      </span>
                    );
                  })
                )}
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
      </div>
    </div>
  );
}

export default memo(TypingAreaComponent);

