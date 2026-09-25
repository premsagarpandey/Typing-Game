import { useEffect, useState, useCallback } from 'react';
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { syncUserProgressWithCloud } from '../services/cloudProgress';
import { AuthContext } from './AuthContextCore';

// Pre-instantiated Google Auth Provider for zero-latency instant popup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Helper to sync all user progress (typing speed, level record, stats) with Firestore
  const triggerSync = useCallback(async (currentUser: User) => {
    try {
      setIsSyncing(true);
      const res = await syncUserProgressWithCloud(currentUser);
      if (res.success) {
        setLastSyncedAt(new Date());
      }
    } catch (err) {
      console.warn('Background sync warning:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (user) {
      await triggerSync(user);
    }
  }, [user, triggerSync]);

  useEffect(() => {
    // Check for redirect result if full-page redirect was used
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setTimeout(() => triggerSync(result.user).catch(() => {}), 500);
        }
      })
      .catch((error) => {
        if (error?.code && error.code !== 'auth/null-user') {
          console.warn('Redirect sign-in check error:', error);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Run full cloud sync so all levels, speed, and history are restored
        setTimeout(() => triggerSync(currentUser).catch(() => {}), 300);
      }
    });

    return unsubscribe;
  }, [triggerSync]);

  const loginWithGoogleRedirect = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result?.user) {
      setUser(result.user);
      setTimeout(() => triggerSync(result.user).catch(() => {}), 300);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      setTimeout(() => triggerSync(cred.user).catch(() => {}), 300);
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      setTimeout(() => triggerSync(cred.user).catch(() => {}), 300);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithGoogleRedirect,
        loginWithEmail,
        signupWithEmail,
        logout,
        isSyncing,
        lastSyncedAt,
        syncNow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
