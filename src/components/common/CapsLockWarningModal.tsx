import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CapsLockWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoFixEnabled: boolean;
  onToggleAutoFix: (enabled: boolean) => void;
}

export default function CapsLockWarningModal({
  isOpen,
  onClose,
  autoFixEnabled,
  onToggleAutoFix,
}: CapsLockWarningModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="caps-lock-modal-title"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* Minimalist Monochromatic Icon Badge */}
            <div className="mx-auto w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-neutral-100 shadow-2xs mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M10 20h4" />
                <path d="M12 4v12" />
                <path d="m8 8 4-4 4 4" />
                <rect width="20" height="4" x="2" y="18" rx="1" />
              </svg>
            </div>

            {/* Header */}
            <h2
              id="caps-lock-modal-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1.5"
            >
              Caps Lock is Active
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5 max-w-sm mx-auto">
              Your keyboard&apos;s Caps Lock is currently enabled. All characters will be typed in uppercase, which will cause mismatches against the lesson text.
            </p>

            {/* Key Indicator */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 mb-5">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Toggle to disable:
              </span>
              <kbd className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono font-semibold text-xs shadow-2xs">
                ⇪ Caps Lock
              </kbd>
            </div>

            {/* Smart Auto-Correction Option Card */}
            <div className="w-full text-left p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 mb-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Auto-Match Letter Case
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                    Automatically matches typed letter case with expected characters to preserve accuracy.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoFixEnabled}
                    onChange={(e) => onToggleAutoFix(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-100 dark:peer-checked:after:bg-neutral-900" />
                </label>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              Continue Practice
            </button>

            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-3">
              This notice dismisses automatically once Caps Lock is turned off.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
