import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  className?: string;
}

export default function ThemeToggle({ variant = 'button', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark/light mode"
        onClick={toggleTheme}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isDark ? 'bg-indigo-600' : 'bg-amber-400'
        } ${className}`}
      >
        <span className="sr-only">Toggle theme</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-md transform ${
            isDark ? 'translate-x-8' : 'translate-x-1'
          }`}
        >
          {isDark ? (
            <svg
              className="w-3.5 h-3.5 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5 text-amber-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </motion.span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`group relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/40 text-amber-300 shadow-sm'
          : 'bg-slate-100 border-slate-300 hover:bg-slate-200 hover:border-indigo-400 text-indigo-600 shadow-sm'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          /* Sun Icon for Switching to Light */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4.5 h-4.5 text-amber-400 group-hover:scale-110 transition-transform duration-200"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          /* Moon Icon for Switching to Dark */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4.5 h-4.5 text-indigo-600 group-hover:scale-110 transition-transform duration-200"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </motion.div>
    </button>
  );
}
