import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset your level progress to Level 1?')) {
      try {
        localStorage.setItem('typingGameLevel', '1');
        alert('Progress reset to Level 1.');
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm">Typing Audio Effects</h3>
            <p className="text-xs text-gray-400">Play mechanical feedback sounds while typing</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              soundEnabled ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm">Reset Progress</h3>
            <p className="text-xs text-gray-400">Clear saved level progress and restart from Level 1</p>
          </div>
          <button
            onClick={resetProgress}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-lg border border-red-500/30 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
