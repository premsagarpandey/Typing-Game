import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SecurityAlertEventDetail } from '../../utils/antiInspect';

interface ToastItem extends SecurityAlertEventDetail {
  id: string;
}

export default function SecurityToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleSecurityAlert = (e: Event) => {
      const customEvent = e as CustomEvent<SecurityAlertEventDetail>;
      if (!customEvent.detail) return;

      const newToast: ToastItem = {
        ...customEvent.detail,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };

      setToasts((prev) => {
        // Keep at most 2 active toasts to prevent spamming
        const filtered = prev.slice(-1);
        return [...filtered, newToast];
      });

      // Auto-dismiss after 3000ms
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('typlix-security-alert', handleSecurityAlert);
    return () => {
      window.removeEventListener('typlix-security-alert', handleSecurityAlert);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900/95 dark:bg-neutral-900/95 text-neutral-100 border border-amber-500/40 dark:border-amber-500/40 shadow-xl backdrop-blur-md"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm">
              🛡️
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  Security Shield
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-snug font-sans">
                {toast.reason}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-neutral-400 hover:text-neutral-200 text-xs px-1 cursor-pointer transition-colors"
              aria-label="Dismiss security notice"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
