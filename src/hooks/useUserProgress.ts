import { useState, useEffect, useCallback } from 'react';
import {
  getLocalProgress,
  syncUserProgressWithCloud,
  type ProgressState,
} from '../services/cloudProgress';
import { useAuth } from './useAuth';

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(() => {
    const { level, stats, summary } = getLocalProgress();
    return {
      level,
      stats,
      summary,
      lastSyncedAt: null,
      isSyncing: false,
    };
  });

  const refreshLocalState = useCallback(() => {
    const { level, stats, summary } = getLocalProgress();
    setProgress((prev) => ({
      ...prev,
      level,
      stats,
      summary,
    }));
  }, []);

  // Listen to custom window events triggered when progress changes anywhere
  useEffect(() => {
    const handleProgressUpdate = () => {
      refreshLocalState();
    };

    window.addEventListener('typlix_progress_updated', handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate);

    return () => {
      window.removeEventListener('typlix_progress_updated', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
  }, [refreshLocalState]);

  // Sync now function triggered by user or lifecycle
  const syncNow = useCallback(async () => {
    if (!user) return;
    setProgress((prev) => ({ ...prev, isSyncing: true }));
    try {
      await syncUserProgressWithCloud(user);
      const { level, stats, summary } = getLocalProgress();
      setProgress({
        level,
        stats,
        summary,
        lastSyncedAt: new Date(),
        isSyncing: false,
      });
    } catch {
      setProgress((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [user]);

  return {
    level: progress.level,
    stats: progress.stats,
    summary: progress.summary,
    isSyncing: progress.isSyncing,
    lastSyncedAt: progress.lastSyncedAt,
    syncNow,
  };
}
