import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { secureStorage } from '../utils/secureStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);
  const { theme } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleResetProgress = () => {
    secureStorage.setItem('typingGameLevel', 1);
    setConfirmReset(false);
    setNotice('Level progress reset to Level 1.');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleClearHistory = () => {
    secureStorage.setItem('typlix_stats', []);
    setNotice('Session history cleared.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Settings</h2>

      {notice && (
        <div className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
        {/* Theme Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Appearance</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <ThemeToggle variant="switch" />
        </div>

        {/* Audio Setting */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Typing Sounds</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Mechanical feedback audio</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
              soundEnabled ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform shadow-sm ${
                soundEnabled
                  ? 'translate-x-[18px] bg-white dark:bg-neutral-900'
                  : 'translate-x-[3px] bg-white dark:bg-neutral-400'
              }`}
            />
          </button>
        </div>

        {/* Reset Progress */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Reset Progress</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">Restart from Level 1</p>
            </div>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
              >
                Reset
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetProgress}
                  className="px-2.5 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-md cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clear Stats History */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Clear History</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Remove all recorded sessions</p>
          </div>
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
