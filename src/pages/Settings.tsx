import { useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { secureStorage } from '../utils/secureStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { SOUND_PROFILES, previewProfileSound } from '../utils/soundEngine';
import type { SoundProfileId } from '../utils/soundEngine';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);
  const [soundProfile, setSoundProfile] = useLocalStorage<SoundProfileId>('soundProfile', 'cherry-mx-blue');
  const [soundVolume, setSoundVolume] = useLocalStorage<number>('soundVolume', 70);
  const { theme } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

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

  const handlePreview = useCallback((profileId: SoundProfileId) => {
    setPreviewingId(profileId);
    previewProfileSound(profileId);
    setTimeout(() => setPreviewingId(null), 300);
  }, []);

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

        {/* ═══════════════════ AUDIO SETTINGS SECTION ═══════════════════ */}

        {/* Sound On/Off Toggle */}
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

        {/* Sound Profile Selector */}
        <div className={`space-y-2.5 transition-opacity duration-200 ${!soundEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Sound Profile</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Choose your keyboard sound</p>
          </div>
          <div className="grid gap-2">
            {SOUND_PROFILES.map((profile) => {
              const isActive = soundProfile === profile.id;
              const isPreviewing = previewingId === profile.id;
              return (
                <div
                  key={profile.id}
                  className={`
                    group relative flex items-center justify-between p-3 rounded-lg border transition-all duration-150 cursor-pointer
                    ${isActive
                      ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900/[0.04] dark:bg-neutral-100/[0.06]'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }
                  `}
                  onClick={() => {
                    setSoundProfile(profile.id);
                    handlePreview(profile.id);
                  }}
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSoundProfile(profile.id);
                      handlePreview(profile.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Radio indicator */}
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${isActive
                        ? 'border-neutral-900 dark:border-neutral-100'
                        : 'border-neutral-300 dark:border-neutral-600'
                      }
                    `}>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 animate-fade-in" />
                      )}
                    </div>
                    {/* Icon + text */}
                    <span className="text-base leading-none select-none" aria-hidden="true">{profile.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium leading-tight ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                        {profile.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-tight mt-0.5">{profile.description}</p>
                    </div>
                  </div>
                  {/* Preview button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(profile.id);
                    }}
                    className={`
                      flex-shrink-0 ml-2 px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all duration-150 cursor-pointer
                      ${isPreviewing
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent scale-95'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-500'
                      }
                    `}
                    aria-label={`Preview ${profile.name} sound`}
                  >
                    {isPreviewing ? '♪' : '▶'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Volume Slider */}
        <div className={`space-y-3 transition-opacity duration-200 ${!soundEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Volume</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">Adjust keystroke volume</p>
            </div>
            <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 tabular-nums w-8 text-right">
              {soundVolume}%
            </span>
          </div>
          <div className="relative group">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="volume-slider w-full"
              aria-label="Volume"
              id="volume-slider"
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400 dark:text-neutral-600 px-0.5">
            <span>Mute</span>
            <span>Max</span>
          </div>
        </div>

        {/* ═══════════════════ END AUDIO SETTINGS ═══════════════════ */}

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
