import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getKeyboardLayout, type KeyboardLayoutId } from '../../data/keyboardLayouts';

interface FingerPlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPath?: string;
  durationSeconds?: number;
}

export default function FingerPlacementModal({
  isOpen,
  onClose,
  targetPath = '/game?mode=lesson',
  durationSeconds = 3,
}: FingerPlacementModalProps) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [layoutId] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const layout = getKeyboardLayout(layoutId);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(durationSeconds);

    const stepMs = 100;
    const totalSteps = (durationSeconds * 1000) / stepMs;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const remaining = Math.max(0, durationSeconds - (stepCount * stepMs) / 1000);
      setTimeLeft(Number(remaining.toFixed(1)));

      if (stepCount >= totalSteps) {
        clearInterval(interval);
        navigate(targetPath);
      }
    }, stepMs);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearInterval(interval);
        onClose();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clearInterval(interval);
        handleStartNow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, navigate, onClose, targetPath, durationSeconds, dontShowAgain]);

  if (!isOpen) return null;

  const handleStartNow = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('typlix_skip_finger_guide', 'true');
      } catch {}
    }
    navigate(targetPath);
  };

  const progressPercent = Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100));

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-modal-title"
        className="relative w-full max-w-[540px] max-h-[92vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col text-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-sm"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Minimal Monochromatic Header */}
        <div className="mb-4 text-center">
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
            Home Row Guide · {layout.name}
          </span>
          <h2
            id="placement-modal-title"
            className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1"
          >
            Position Your Fingers
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
            Rest your fingertips on the home row keys. Feel the raised bumps on{' '}
            <strong className="text-neutral-900 dark:text-neutral-100 font-semibold font-mono">F</strong>{' '}
            and{' '}
            <strong className="text-neutral-900 dark:text-neutral-100 font-semibold font-mono">J</strong>.
          </p>
        </div>

        {/* Large Clean Keyboard Image */}
        <div className="w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-4 bg-neutral-950">
          <img
            src="/tutorial-image.jpg"
            alt="Touch typing home row finger placement guide"
            className="w-full h-auto max-h-[250px] object-cover"
            loading="eager"
          />
        </div>

        {/* Monochromatic Key Guides */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-left">
          {/* Left Hand */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              <span>Left Hand</span>
              <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">Pinky → Index</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {layout.homeRowLeft.map((k, idx) => {
                const isBump = layout.homeBumps?.includes(k.toLowerCase()) || k.toLowerCase() === 'f';
                const fingerNames = ['Pinky', 'Ring', 'Mid', 'Index'];
                return (
                  <div key={k} className="flex flex-col items-center">
                    <span
                      className={`relative w-full py-1.5 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                        isBump
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-2xs'
                          : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 shadow-2xs'
                      }`}
                    >
                      {k.toUpperCase()}
                      {isBump && (
                        <span className="absolute bottom-0.5 w-1 h-0.5 bg-neutral-400 dark:bg-neutral-500 rounded-full" />
                      )}
                    </span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1">
                      {fingerNames[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Hand */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              <span>Right Hand</span>
              <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">Index → Pinky</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {layout.homeRowRight.map((k, idx) => {
                const isBump = layout.homeBumps?.includes(k.toLowerCase()) || k.toLowerCase() === 'j';
                const fingerNames = ['Index', 'Mid', 'Ring', 'Pinky'];
                return (
                  <div key={k} className="flex flex-col items-center">
                    <span
                      className={`relative w-full py-1.5 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                        isBump
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-2xs'
                          : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 shadow-2xs'
                      }`}
                    >
                      {k.toUpperCase()}
                      {isBump && (
                        <span className="absolute bottom-0.5 w-1 h-0.5 bg-neutral-400 dark:bg-neutral-500 rounded-full" />
                      )}
                    </span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1">
                      {fingerNames[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Minimal Countdown Bar */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1.5">
            <span>Starting lesson automatically...</span>
            <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
              {Math.ceil(timeLeft)}s
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 dark:bg-neutral-100 h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Monochromatic Action Buttons */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartNow}
            className="flex-1 py-2.5 px-5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Start Lesson Now</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-neutral-900/20 rounded">↵</kbd>
          </button>
        </div>

        {/* Minimal Checkbox */}
        <label className="mt-3.5 flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => {
              setDontShowAgain(e.target.checked);
              try {
                localStorage.setItem('typlix_skip_finger_guide', e.target.checked ? 'true' : 'false');
              } catch {}
            }}
            className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-0 cursor-pointer w-3.5 h-3.5 accent-neutral-900 dark:accent-neutral-100"
          />
          <span>Don't show this placement tip again</span>
        </label>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
