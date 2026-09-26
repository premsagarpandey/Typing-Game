import { doc, getDoc, setDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { secureStorage, type TypingSessionRecord } from '../utils/secureStorage';

export interface UserCloudData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  typingGameLevel: number;
  bestWpm: number;
  avgAccuracy: number;
  totalTests: number;
  typlix_stats: TypingSessionRecord[];
  lastLoginAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface ProgressState {
  level: number;
  stats: TypingSessionRecord[];
  summary: {
    bestWpm: number;
    avgAccuracy: number;
    totalTests: number;
    total?: number;
  };
  lastSyncedAt: Date | null;
  isSyncing: boolean;
}

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  level?: number;
  photoURL?: string | null;
  isCurrentUser?: boolean;
}

/**
 * Calculates aggregate stats summary from a list of sessions
 */
export function calculateStatsSummary(sessions: TypingSessionRecord[]) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { bestWpm: 0, avgAccuracy: 0, totalTests: 0, total: 0 };
  }
  const totalTests = sessions.length;
  const bestWpm = Math.max(...sessions.map((s) => s.wpm || 0), 0);
  const avgAccuracy = Math.round(
    sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / totalTests
  );
  return { bestWpm, avgAccuracy, totalTests, total: totalTests };
}

/**
 * Dispatches a custom window event to notify all components that progress has updated
 */
export function notifyProgressUpdated(detail?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('typlix_progress_updated', {
      detail: detail || {},
    })
  );
}

/**
 * Retrieves the current local progress from secureStorage
 */
export function getLocalProgress() {
  const level = secureStorage.getItem<number>('typingGameLevel', 1);
  const stats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
  const summary = calculateStatsSummary(stats);
  return { level, stats, summary };
}

/**
 * Saves a completed typing session record:
 * 1. Saves into local secureStorage
 * 2. If user is signed in to Firebase, syncs immediately to Firestore
 */
export async function saveTypingSession(record: TypingSessionRecord): Promise<void> {
  try {
    // 1. Update local storage
    const currentStats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
    // Prevent duplicate entries by ID
    const filtered = currentStats.filter((s) => s.id !== record.id);
    const updatedStats = [...filtered, record].slice(-100);
    secureStorage.setItem('typlix_stats', updatedStats);

    const summary = calculateStatsSummary(updatedStats);

    // 2. Notify local React components
    notifyProgressUpdated({
      type: 'session_saved',
      record,
      stats: updatedStats,
      summary,
    });

    // 3. Save to cloud Firestore if user is authenticated
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const currentLevel = secureStorage.getItem<number>('typingGameLevel', 1);

      await setDoc(
        userRef,
        {
          uid: currentUser.uid,
          email: currentUser.email || null,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Typist',
          photoURL: currentUser.photoURL || null,
          typlix_stats: updatedStats,
          bestWpm: summary.bestWpm,
          avgAccuracy: summary.avgAccuracy,
          totalTests: summary.totalTests,
          typingGameLevel: currentLevel,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.warn('Failed to sync typing session to cloud:', error);
  }
}

/**
 * Saves lesson level progression:
 * 1. Updates local secureStorage
 * 2. If user is signed in, syncs level to Firestore
 */
export async function saveLevelProgress(newLevel: number): Promise<void> {
  const currentSaved = secureStorage.getItem<number>('typingGameLevel', 1);
  const boundedLevel = Math.min(50, Math.max(currentSaved, newLevel));
  try {
    secureStorage.setItem('typingGameLevel', boundedLevel);
    notifyProgressUpdated({
      type: 'level_updated',
      typingGameLevel: boundedLevel,
    });

    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          typingGameLevel: boundedLevel,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.warn('Failed to sync level to cloud:', error);
  }
}

/**
 * Synchronizes user data between Firestore and localStorage.
 * Called automatically when user logs in or explicitly when user taps 'Sync Now'.
 * Merges local and cloud stats/level so nothing is lost, while preventing cross-account contamination.
 */
export async function syncUserProgressWithCloud(currentUser: User): Promise<{
  success: boolean;
  level: number;
  totalTests: number;
}> {
  if (!currentUser) {
    const { level, summary } = getLocalProgress();
    return { success: false, level, totalTests: summary.totalTests };
  }

  try {
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    const lastSyncedUid = secureStorage.getItem<string | null>('typlix_current_uid', null);
    const isDifferentUser = Boolean(lastSyncedUid && lastSyncedUid !== currentUser.uid);

    const localLevel = secureStorage.getItem<number>('typingGameLevel', 1);
    const localStats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);

    let finalLevel = 1;
    let finalStats: TypingSessionRecord[] = [];

    if (userSnap.exists()) {
      const cloudData = userSnap.data() as Partial<UserCloudData>;
      const cloudLevel = typeof cloudData.typingGameLevel === 'number' ? cloudData.typingGameLevel : 1;
      const cloudStats = Array.isArray(cloudData.typlix_stats) ? cloudData.typlix_stats : [];

      if (isDifferentUser) {
        // Switched accounts: Take this user's cloud data cleanly without mixing previous user's local cache
        finalLevel = cloudLevel;
        finalStats = cloudStats;
      } else {
        // Same user or guest upgrading to account: Merge seamlessly
        finalLevel = Math.max(localLevel, cloudLevel);

        const statsMap = new Map<string, TypingSessionRecord>();
        for (const item of cloudStats) {
          if (item && item.id) statsMap.set(item.id, item);
        }
        for (const item of localStats) {
          if (item && item.id) statsMap.set(item.id, item);
        }
        finalStats = Array.from(statsMap.values()).slice(-100);
      }
    } else {
      // New cloud profile for this user
      if (isDifferentUser) {
        finalLevel = 1;
        finalStats = [];
      } else {
        // Guest user logging in for the first time: transfer their guest progress
        finalLevel = localLevel;
        finalStats = localStats;
      }
    }

    // Save active user ID and synced values to local storage
    secureStorage.setItem('typlix_current_uid', currentUser.uid);
    secureStorage.setItem('typingGameLevel', finalLevel);
    secureStorage.setItem('typlix_stats', finalStats);

    const summary = calculateStatsSummary(finalStats);

    // Save consolidated progress back to Firestore
    await setDoc(
      userRef,
      {
        uid: currentUser.uid,
        email: currentUser.email || null,
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Typist',
        photoURL: currentUser.photoURL || null,
        typingGameLevel: finalLevel,
        bestWpm: summary.bestWpm,
        avgAccuracy: summary.avgAccuracy,
        totalTests: summary.totalTests,
        typlix_stats: finalStats,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Broadcast update so all UI components update immediately
    notifyProgressUpdated({
      type: 'cloud_sync_completed',
      typingGameLevel: finalLevel,
      stats: finalStats,
      summary,
    });

    return {
      success: true,
      level: finalLevel,
      totalTests: summary.totalTests,
    };
  } catch (error) {
    console.warn('Error syncing progress with Firestore:', error);
    const { level, summary } = getLocalProgress();
    return {
      success: false,
      level,
      totalTests: summary.totalTests,
    };
  }
}

/**
 * Clears active user identity and resets session stats on logout
 */
export function clearLocalProgressOnLogout(): void {
  secureStorage.removeItem('typlix_current_uid');
  secureStorage.setItem('typingGameLevel', 1);
  secureStorage.setItem('typlix_stats', []);
  notifyProgressUpdated({
    type: 'logged_out',
    typingGameLevel: 1,
    stats: [],
    summary: { bestWpm: 0, avgAccuracy: 0, totalTests: 0, total: 0 },
  });
}

/**
 * Resets level to 1 locally and in Firestore
 */
export async function resetLevelProgress(): Promise<void> {
  secureStorage.setItem('typingGameLevel', 1);
  notifyProgressUpdated({ type: 'level_updated', typingGameLevel: 1 });

  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { typingGameLevel: 1, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Failed to reset level in cloud:', e);
    }
  }
}

/**
 * Clears typing session history locally and in Firestore
 */
export async function clearStatsHistory(): Promise<void> {
  secureStorage.setItem('typlix_stats', []);
  notifyProgressUpdated({
    type: 'stats_cleared',
    stats: [],
    summary: { bestWpm: 0, avgAccuracy: 0, totalTests: 0 },
  });

  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          typlix_stats: [],
          bestWpm: 0,
          avgAccuracy: 0,
          totalTests: 0,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Failed to clear stats in cloud:', e);
    }
  }
}

/**
 * Fetches top typists from Firestore for the community leaderboard
 */
export async function fetchTopPlayersFromFirestore(limitCount: number = 10): Promise<LeaderboardPlayer[]> {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('bestWpm', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const currentUid = auth.currentUser?.uid;
    const players: LeaderboardPlayer[] = [];
    let rank = 1;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (typeof data.bestWpm === 'number' && data.bestWpm > 0) {
        players.push({
          rank,
          name: data.displayName || data.email?.split('@')[0] || `Typist #${rank}`,
          wpm: data.bestWpm,
          accuracy: data.avgAccuracy || 95,
          level: data.typingGameLevel || 1,
          photoURL: data.photoURL || null,
          isCurrentUser: data.uid === currentUid,
        });
        rank++;
      }
    });

    return players;
  } catch (error) {
    console.warn('Could not fetch cloud leaderboard:', error);
    return [];
  }
}
