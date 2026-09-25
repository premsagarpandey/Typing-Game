import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';
import { LogOut, User, Mail, Calendar, Shield, Activity, TrendingUp, Trophy, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { level, summary, isSyncing, lastSyncedAt, syncNow } = useUserProgress();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // If user accesses /profile without logging in, render fallback prompt
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Not Signed In</h2>
        <p className="text-sm text-neutral-500">Please sign in to view your profile and sync your progress.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 mt-4 text-sm font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 transition-opacity hover:opacity-90 cursor-pointer"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggingOut(false);
    }
  };

  const handleManualSync = async () => {
    try {
      await syncNow();
      setSyncFeedback('All progress synced with Firestore!');
      setTimeout(() => setSyncFeedback(null), 3500);
    } catch {
      setSyncFeedback('Sync failed. Please check connection.');
      setTimeout(() => setSyncFeedback(null), 3500);
    }
  };

  const getCreationDate = () => {
    if (user.metadata.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Unknown';
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">User Profile</h2>
        <p className="text-xs text-neutral-500 mt-1">Manage your cloud account and view lifetime statistics</p>
      </div>

      {syncFeedback && (
        <div className="p-3 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="cursor-pointer opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/20">
        <img
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email || 'User'}&background=random`}
          alt="Avatar"
          className="w-24 h-24 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm"
        />
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {user.displayName || user.email?.split('@')[0] || 'Typist'}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 mt-1 text-sm text-neutral-500">
              <span className="flex items-center justify-center sm:justify-start gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5"><Calendar className="w-4 h-4" /> Joined {getCreationDate()}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Firestore Cloud Synced
            </span>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Sync latest local progress with Firestore"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : lastSyncedAt ? 'Synced' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div>
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Lifetime Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-5 h-5 text-neutral-400 dark:text-neutral-600 mb-2" />
            <div className="text-xs text-neutral-500 font-medium">Best WPM</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {summary.bestWpm}
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <Activity className="w-5 h-5 text-neutral-400 dark:text-neutral-600 mb-2" />
            <div className="text-xs text-neutral-500 font-medium">Avg Accuracy</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {summary.avgAccuracy}<span className="text-sm font-normal text-neutral-400">%</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <User className="w-5 h-5 text-neutral-400 dark:text-neutral-600 mb-2" />
            <div className="text-xs text-neutral-500 font-medium">Total Tests</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {summary.totalTests}
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <Trophy className="w-5 h-5 text-neutral-400 dark:text-neutral-600 mb-2" />
            <div className="text-xs text-neutral-500 font-medium">Current Level</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {level}
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings / Log Out */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Account Actions</h3>
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Sign Out</div>
            <div className="text-xs text-neutral-500 mt-0.5">End your current session on this device.</div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 dark:hover:border-rose-900/50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
