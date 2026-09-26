import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { SOUND_PROFILES, previewProfileSound, updateSoundSettings } from '../utils/soundEngine';
import type { SoundProfileId } from '../utils/soundEngine';
import { KEYBOARD_LAYOUTS, type KeyboardLayoutId } from '../data/keyboardLayouts';
import { exportDataAsJSON, exportStatsAsCSV, importDataFromJSON } from '../utils/dataBackup';
import { resetLevelProgress, clearStatsHistory } from '../services/cloudProgress';
import { openCookieConsentModal, resetCookieConsent } from '../utils/cookieConsent';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);
  const [soundProfile, setSoundProfile] = useLocalStorage<SoundProfileId>('soundProfile', 'cherry-mx-blue');
  const [soundVolume, setSoundVolume] = useLocalStorage<number>('soundVolume', 70);
  const [keyboardLayout, setKeyboardLayout] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const { theme } = useTheme();

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmPurgeAll, setConfirmPurgeAll] = useState(false);
  const [notice, setNotice] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleResetProgress = async () => {
    await resetLevelProgress();
    setConfirmReset(false);
    showNotice('Level progress reset to Level 1 and synced.', 'info');
  };

  const handleClearHistory = async () => {
    await clearStatsHistory();
    setConfirmClear(false);
    showNotice('Session history cleared and synced.', 'info');
  };

  const handlePurgeAllData = () => {
    try {
      localStorage.clear();
      resetCookieConsent();
      setConfirmPurgeAll(false);
      showNotice('All local storage data and consent choices have been purged.', 'info');
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      showNotice('Failed to purge storage.', 'error');
    }
  };

  const handlePreview = useCallback((profileId: SoundProfileId) => {
    setPreviewingId(profileId);
    previewProfileSound(profileId);
    setTimeout(() => setPreviewingId(null), 300);
  }, []);

  const handleExportJSON = () => {
    try {
      exportDataAsJSON();
      showNotice('Full backup exported successfully!', 'success');
    } catch (e) {
      showNotice(`Export failed: ${(e as Error).message}`, 'error');
    }
  };

  const handleExportCSV = () => {
    try {
      exportStatsAsCSV();
      showNotice('Session statistics exported as CSV!', 'success');
    } catch (e) {
      showNotice((e as Error).message, 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataFromJSON(content, 'overwrite');
        if (result.success) {
          showNotice(result.message, 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showNotice(result.message, 'error');
        }
      }
    };
    reader.onerror = () => {
      showNotice('Failed to read file.', 'error');
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Settings</h2>

      {notice && (
        <div
          className={`p-3 border rounded-lg text-xs font-medium flex items-center justify-between animate-fade-in ${
            notice.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : notice.type === 'error'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
              : 'border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <span>{notice.text}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6 bg-neutral-50/50 dark:bg-neutral-900/20">
        {/* Appearance Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Appearance</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <ThemeToggle variant="switch" />
        </div>

        {/* Keyboard Layout Section */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Keyboard Layout</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Choose your typing layout for visual cues and finger placement
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.values(KEYBOARD_LAYOUTS) as typeof KEYBOARD_LAYOUTS[KeyboardLayoutId][]).map((layout) => {
              const isSelected = keyboardLayout === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => setKeyboardLayout(layout.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setKeyboardLayout(layout.id);
                    }
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900/[0.04] dark:bg-neutral-100/[0.06] shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/40 dark:hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      {layout.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {layout.shortDesc}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-snug mb-2">
                    {layout.description}
                  </p>
                  <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
                    <span>Home:</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {layout.homeRowLeft.join('')} {layout.homeRowRight.join('')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audio Feedback Section */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Typing Sounds</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Mechanical audio feedback</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              updateSoundSettings({ sound: next });
            }}
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
                    updateSoundSettings({ soundProfile: profile.id });
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
                    <span className="text-base leading-none select-none" aria-hidden="true">{profile.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium leading-tight ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                        {profile.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-tight mt-0.5">{profile.description}</p>
                    </div>
                  </div>
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
              onChange={(e) => {
                const vol = Number(e.target.value);
                setSoundVolume(vol);
                updateSoundSettings({ soundVolume: vol });
              }}
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

        {/* Data Backup & Export Section */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Data Backup & Export</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Transfer your progress across devices or export stats for analysis
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
            aria-label="Upload Typlix JSON Backup"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
            >
              <span>💾</span> Export JSON
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
            >
              <span>📊</span> Export CSV
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <span>📥</span> Import JSON
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset & Clear */}
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
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md cursor-pointer transition-colors"
                >
                  Confirm Reset
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

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Clear History</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Remove all recorded sessions</p>
          </div>
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearHistory}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md cursor-pointer transition-colors"
              >
                Confirm Clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Data Transparency Section */}
      <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
              Privacy & Data Transparency
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Strictly collecting only necessary data for touch typing lessons
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Data Minimization
          </span>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Typlix operates under the <strong>Data Minimization Principle</strong>. We never sell your personal records, profile your web browsing, or run third-party marketing trackers. Your keystroke logs and sound preferences are stored securely on your own device.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={openCookieConsentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs"
          >
            <span>🍪</span> Manage Cookie Consent
          </button>
          <Link
            to="/privacy"
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/cookies"
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Cookie Policy
          </Link>
          <Link
            to="/terms"
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/refund"
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Refund Policy
          </Link>
        </div>

        {/* Right to be Forgotten (Purge Everything) */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
              Wipe All Local Storage Data
            </h4>
            <p className="text-[11px] text-neutral-500">
              Permanently delete all stored scores, preferences, and cookie consent on this device.
            </p>
          </div>
          {!confirmPurgeAll ? (
            <button
              onClick={() => setConfirmPurgeAll(true)}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
            >
              Wipe All
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePurgeAllData}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md cursor-pointer transition-colors"
              >
                Confirm Wipe
              </button>
              <button
                onClick={() => setConfirmPurgeAll(false)}
                className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
