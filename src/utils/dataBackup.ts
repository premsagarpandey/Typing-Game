import { secureStorage, type TypingSessionRecord } from './secureStorage';
import type { KeyboardLayoutId } from '../data/keyboardLayouts';
import type { SoundProfileId } from './soundEngine';

export interface BackupData {
  app: string;
  version: string;
  exportedAt: string;
  data: {
    typingGameLevel: number;
    typlix_stats: TypingSessionRecord[];
    settings: {
      sound: boolean;
      soundProfile: SoundProfileId;
      soundVolume: number;
      keyboardLayout: KeyboardLayoutId;
      theme?: string;
    };
  };
}

export interface ImportResult {
  success: boolean;
  message: string;
  recordsImported?: number;
  levelRestored?: number;
}

/**
 * Downloads a string as a file in the browser
 */
function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports all user stats, level progress, and settings as a JSON backup file
 */
export function exportDataAsJSON(): void {
  const currentLevel = secureStorage.getItem<number>('typingGameLevel', 1);
  const stats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
  const sound = secureStorage.getItem<boolean>('sound', true);
  const soundProfile = secureStorage.getItem<SoundProfileId>('soundProfile', 'cherry-mx-blue');
  const soundVolume = secureStorage.getItem<number>('soundVolume', 70);
  const keyboardLayout = secureStorage.getItem<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const theme = localStorage.getItem('typlix_theme') || 'dark';

  const backup: BackupData = {
    app: 'Typlix Touch Typing',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      typingGameLevel: currentLevel,
      typlix_stats: stats,
      settings: {
        sound,
        soundProfile,
        soundVolume,
        keyboardLayout,
        theme,
      },
    },
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadFile(`typlix-backup-${dateStr}.json`, jsonStr, 'application/json');
}

/**
 * Exports session stats history in CSV format
 */
export function exportStatsAsCSV(): void {
  const stats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);

  if (stats.length === 0) {
    throw new Error('No session history available to export.');
  }

  const headers = ['ID', 'Mode', 'Level', 'WPM', 'Accuracy (%)', 'Max Combo', 'Result', 'Date'];
  const rows = stats.map((s) => [
    `"${s.id || ''}"`,
    `"${s.modeLabel || (s.level > 0 ? `Level ${s.level}` : 'Practice')}"`,
    s.level,
    s.wpm,
    s.accuracy,
    s.maxCombo,
    s.passed ? 'Passed' : 'Practice',
    `"${s.date || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(`typlix-stats-${dateStr}.csv`, csvContent, 'text/csv;charset=utf-8;');
}

/**
 * Validates and imports a JSON backup into Typlix secureStorage
 */
export function importDataFromJSON(
  jsonString: string,
  mode: 'merge' | 'overwrite' = 'overwrite'
): ImportResult {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Invalid file format: Expected a JSON object.' };
    }

    const payload = parsed.data || parsed;
    let recordsImported = 0;
    let restoredLevel = 1;

    // 1. Restore / Merge Level
    if ('typingGameLevel' in payload) {
      const parsedLevel = Math.min(50, Math.max(1, parseInt(String(payload.typingGameLevel), 10) || 1));
      const currentLevel = secureStorage.getItem<number>('typingGameLevel', 1);

      if (mode === 'merge') {
        restoredLevel = Math.max(currentLevel, parsedLevel);
      } else {
        restoredLevel = parsedLevel;
      }
      secureStorage.setItem('typingGameLevel', restoredLevel);
    }

    // 2. Restore / Merge Session History
    if (Array.isArray(payload.typlix_stats)) {
      const incomingStats: TypingSessionRecord[] = payload.typlix_stats.filter(
        (item: unknown): item is TypingSessionRecord =>
          !!item &&
          typeof item === 'object' &&
          typeof (item as TypingSessionRecord).wpm === 'number' &&
          typeof (item as TypingSessionRecord).accuracy === 'number'
      );

      if (mode === 'merge') {
        const existingStats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
        const existingIds = new Set(existingStats.map((s) => s.id));
        const newRecords = incomingStats.filter((s) => !existingIds.has(s.id));
        const combined = [...existingStats, ...newRecords].slice(-50);
        secureStorage.setItem('typlix_stats', combined);
        recordsImported = newRecords.length;
      } else {
        const sliced = incomingStats.slice(-50);
        secureStorage.setItem('typlix_stats', sliced);
        recordsImported = sliced.length;
      }
    }

    // 3. Restore Settings if present
    if (payload.settings && typeof payload.settings === 'object') {
      const s = payload.settings;
      if (typeof s.sound === 'boolean') {
        secureStorage.setItem('sound', s.sound);
      }
      if (typeof s.soundProfile === 'string') {
        secureStorage.setItem('soundProfile', s.soundProfile);
      }
      if (typeof s.soundVolume === 'number') {
        secureStorage.setItem('soundVolume', Math.min(100, Math.max(0, s.soundVolume)));
      }
      if (typeof s.keyboardLayout === 'string') {
        secureStorage.setItem('keyboardLayout', s.keyboardLayout);
      }
      if (typeof s.theme === 'string') {
        localStorage.setItem('typlix_theme', s.theme);
      }
    }

    return {
      success: true,
      message: `Backup restored successfully! (${recordsImported} sessions restored, Level set to ${restoredLevel})`,
      recordsImported,
      levelRestored: restoredLevel,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to parse backup JSON: ${(err as Error).message}`,
    };
  }
}
