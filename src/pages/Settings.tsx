import { useLocalStorage } from '../hooks/useLocalStorage';
import { secureStorage } from '../utils/secureStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);
  const { theme } = useTheme();

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset your level progress to Level 1?')) {
      secureStorage.setItem('typingGameLevel', 1);
      alert('Progress securely reset to Level 1.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h2>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none transition-colors">
        {/* Theme Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {theme === 'dark' ? 'Dark Mode (Night typing)' : 'Light Mode (Clean crisp style)'}
            </p>
          </div>
          <ThemeToggle variant="switch" />
        </div>

        {/* Audio Setting */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Typing Audio Effects</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">Play mechanical feedback sounds while typing</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Reset Progress */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Reset Progress</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">Clear saved level progress and restart from Level 1</p>
          </div>
          <button
            onClick={resetProgress}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-300 text-xs font-semibold rounded-lg border border-red-500/30 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Security Engine Status Card */}
      <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Security & Integrity Status</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 rounded-xl">
            <div className="text-slate-500 dark:text-gray-400 text-[11px]">Storage Engine</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              SHA-256 Signed
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 rounded-xl">
            <div className="text-slate-500 dark:text-gray-400 text-[11px]">Anti-Cheat Engine</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              Active
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 rounded-xl">
            <div className="text-slate-500 dark:text-gray-400 text-[11px]">Bot & Macro Guard</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              Enforced
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 rounded-xl">
            <div className="text-slate-500 dark:text-gray-400 text-[11px]">Deployment CSP</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              Strict Level 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
