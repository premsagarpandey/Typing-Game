import { useEffect, useState } from 'react';
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
  targetPath = '/game',
  durationSeconds = 2,
}: FingerPlacementModalProps) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [layoutId] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const layout = getKeyboardLayout(layoutId);

  useEffect(() => {
    if (!isOpen) return;

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
        navigate(targetPath);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, navigate, onClose, targetPath, durationSeconds]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col items-center text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer text-sm"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 rounded text-[10px] uppercase font-mono font-medium bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          {layout.name} Layout
        </div>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Position Your Fingers
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-4">
          Left: <span className="font-mono font-medium">{layout.homeRowLeft.join(' ')}</span> — Right:{' '}
          <span className="font-mono font-medium">{layout.homeRowRight.join(' ')}</span>
        </p>

        {/* Finger image */}
        <div className="w-full rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-4">
          <img
            src="/tutorial-image.jpg"
            alt="Home row finger placement guide"
            className="w-full h-auto max-h-[240px] object-cover"
          />
        </div>

        {/* Key Reference */}
        <div className="w-full grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="flex items-center justify-between px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md">
            <span className="text-neutral-500 dark:text-neutral-500">Left Hand</span>
            <div className="flex gap-1.5 font-mono font-medium text-neutral-700 dark:text-neutral-300">
              {layout.homeRowLeft.map((k, idx) => (
                <span
                  key={k}
                  className={idx === layout.homeRowLeft.length - 1 ? 'underline font-bold' : ''}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md">
            <span className="text-neutral-500 dark:text-neutral-500">Right Hand</span>
            <div className="flex gap-1.5 font-mono font-medium text-neutral-700 dark:text-neutral-300">
              {layout.homeRowRight.map((k, idx) => (
                <span key={k} className={idx === 0 ? 'underline font-bold' : ''}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1.5">
            <span>Starting in {Math.ceil(timeLeft)}s...</span>
            <span className="font-mono">{Math.ceil(timeLeft)}s</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 dark:bg-neutral-100 h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate(targetPath)}
            className="flex-[2] py-2 px-4 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
          >
            Start Now
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-neutral-900/20 rounded">↵</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
