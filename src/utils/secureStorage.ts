/**
 * Typlix Storage Utility
 * Type-safe, resilient localStorage helper for session records and user preferences.
 */

export interface TypingSessionRecord {
  id: string;
  level: number;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  date: string;
  modeLabel: string;
  durationSeconds?: number;
  passed?: boolean;
  mode?: string;
}

export const secureStorage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;

      const parsed = JSON.parse(raw);
      // Seamlessly handle any previous { data, sig } envelopes if present
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'sig' in parsed) {
        return parsed.data as T;
      }
      return parsed as T;
    } catch {
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save to localStorage for key: "${key}"`, e);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove key: "${key}"`, e);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  },
};
