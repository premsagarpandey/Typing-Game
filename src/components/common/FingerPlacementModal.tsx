import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(durationSeconds);
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-7 flex flex-col items-center text-center transform transition-all animate-scale-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Top Tag & Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2 border border-emerald-200/60 dark:border-emerald-800/60">
          🖐️ Quick Hand Check
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Place Your Fingers on Home Row
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md">
          Rest your left fingers on <strong className="text-emerald-600 dark:text-emerald-400">A-S-D-F</strong> and right fingers on <strong className="text-emerald-600 dark:text-emerald-400">J-K-L-;</strong>
        </p>

        {/* Finger Placement Image */}
        <div className="mt-4 relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-950">
          <img
            src="/tutorial-image.jpg"
            alt="Home row touch typing finger position guide"
            className="w-full h-auto max-h-[320px] object-cover rounded-2xl"
          />
        </div>

        {/* Key Indicators */}
        <div className="mt-3.5 w-full grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Left Hand</span>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">A</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">S</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">D</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs ring-1 ring-emerald-500">F</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Right Hand</span>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs ring-1 ring-emerald-500">J</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">K</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">L</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">;</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Countdown */}
        <div className="w-full mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Starting lesson in {Math.ceil(timeLeft)}s...
            </span>
            <span className="text-slate-500 font-mono">{Math.ceil(timeLeft)}s</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 w-full flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate(targetPath)}
            className="flex-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Now →</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 text-white rounded">
              Enter ↵
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
