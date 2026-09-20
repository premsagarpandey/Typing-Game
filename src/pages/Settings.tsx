import { useState, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { secureStorage } from '../utils/secureStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { SOUND_PROFILES, previewProfileSound } from '../utils/soundEngine';
import type { SoundProfileId } from '../utils/soundEngine';
import { KEYBOARD_LAYOUTS, type KeyboardLayoutId } from '../data/keyboardLayouts';
import { exportDataAsJSON, exportStatsAsCSV, importDataFromJSON } from '../utils/dataBackup';
import { antiInspectManager } from '../utils/antiInspect';
import SecurityAuditModal from '../components/common/SecurityAuditModal';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);
  const [soundProfile, setSoundProfile] = useLocalStorage<SoundProfileId>('soundProfile', 'cherry-mx-blue');
  const [soundVolume, setSoundVolume] = useLocalStorage<number>('soundVolume', 70);
  const [keyboardLayout, setKeyboardLayout] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const { theme } = useTheme();

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [antiInspectEnabled, setAntiInspectEnabled] = useLocalStorage<boolean>('typlix_anti_inspect_enabled', true);
  const [antiCheatEnabled, setAntiCheatEnabled] = useLocalStorage<boolean>('typlix_anti_cheat_enabled', true);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4500);
  };

  const handleResetProgress = () => {
    secureStorage.setItem('typingGameLevel', 1);
    setConfirmReset(false);
    showNotice('Level progress reset to Level 1.', 'info');
  };

  const handleClearHistory = () => {
    secureStorage.setItem('typlix_stats', []);
    setConfirmClear(false);
    showNotice('Session history cleared.', 'info');
  };

  const toggleAntiInspect = () => {
    const next = !antiInspectEnabled;
    setAntiInspectEnabled(next);
    antiInspectManager.setEnabled(next);
    showNotice(
      next
        ? 'Anti-Inspect Shield activated (DevTools shortcuts & right-click blocked).'
        : 'Anti-Inspect Shield deactivated (DevTools allowed).',
      'info'
    );
  };

  const toggleAntiCheat = () => {
    const next = !antiCheatEnabled;
    setAntiCheatEnabled(next);
    showNotice(
      next
        ? 'Anti-Cheat cadence sensor activated.'
        : 'Anti-Cheat sensor paused.',
      'info'
    );
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
          // Reload settings state values if needed
          setTimeout(() => window.location.reload(), 1200);
        } else {
          showNotice(result.message, 'error');
        }
      }
    };
    reader.onerror = () => {
      showNotice('Failed to read file.', 'error');
    };
    reader.readAsText(file);

    // Reset input value so same file can be selected again
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

        {/* ═══════════════════ KEYBOARD LAYOUT SECTION ═══════════════════ */}
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

        {/* ═══════════════════ AUDIO SETTINGS SECTION ═══════════════════ */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Typing Sounds</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Mechanical audio feedback</p>
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

        {/* ═══════════════════ DATA BACKUP & RESTORE SECTION ═══════════════════ */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Data Backup & Export</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Transfer your progress across devices or export stats for analysis
            </p>
          </div>

          {/* Hidden File Input for JSON Restore */}
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

        {/* ═══════════════════ SECURITY & ANTI-INSPECT SECTION ═══════════════════ */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">🛡️</span>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  Security & Anti-Inspect Protection
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                Protect session integrity, block DevTools inspection, and prevent automated macro cheats
              </p>
            </div>
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🔍</span> Audit
            </button>
          </div>

          <div className="space-y-3 bg-neutral-100/40 dark:bg-neutral-900/40 p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
            {/* Anti-Inspect Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Anti-Inspect & Shortcut Shield
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Blocks F12, Ctrl+Shift+I/J/C, Ctrl+U, and right-click context inspect
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={antiInspectEnabled}
                onClick={toggleAntiInspect}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  antiInspectEnabled ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform shadow-sm ${
                    antiInspectEnabled
                      ? 'translate-x-[18px] bg-white dark:bg-neutral-900'
                      : 'translate-x-[3px] bg-white dark:bg-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* Anti-Cheat Cadence Sensor */}
            <div className="flex items-center justify-between pt-2.5 border-t border-neutral-200/50 dark:border-neutral-800/50">
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Anti-Cheat Cadence Sensor
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Filters synthetic scripts, unnatural keystroke intervals, and paste injections
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={antiCheatEnabled}
                onClick={toggleAntiCheat}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  antiCheatEnabled ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform shadow-sm ${
                    antiCheatEnabled
                      ? 'translate-x-[18px] bg-white dark:bg-neutral-900'
                      : 'translate-x-[3px] bg-white dark:bg-neutral-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════ DANGER ZONE SECTION ═══════════════════ */}
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

        {/* Clear Stats History */}
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

      <SecurityAuditModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
