import { useEffect, useState } from 'react';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { secureStorage } from '../utils/secureStorage';
import { AuthContext } from './AuthContextCore';

// Pre-instantiated Google Auth Provider for zero-latency instant popup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to sync local progress with cloud progress (runs purely in background)
  const syncProgress = async (currentUser: User) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 1500)
      );

      const performSync = async () => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const localLevel = secureStorage.getItem<number>('typingGameLevel', 1);

        if (userSnap.exists()) {
          const cloudData = userSnap.data();
          const cloudLevel = cloudData.typingGameLevel || 1;

          if (cloudLevel > localLevel) {
            secureStorage.setItem('typingGameLevel', cloudLevel);
          } else if (localLevel > cloudLevel) {
            await setDoc(userRef, { typingGameLevel: localLevel }, { merge: true });
          }
        } else {
          await setDoc(userRef, { typingGameLevel: localLevel }, { merge: true });
        }
      };

      await Promise.race([performSync(), timeoutPromise]);
    } catch {
      // Non-critical background sync error, silently ignore
    }
  };

  useEffect(() => {
    // Check for redirect result if full-page redirect was used
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setTimeout(() => syncProgress(result.user).catch(() => {}), 1000);
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
        // Run sync only after main thread is free
        setTimeout(() => syncProgress(currentUser).catch(() => {}), 800);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithGoogleRedirect = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result?.user) {
      setUser(result.user);
      setTimeout(() => syncProgress(result.user).catch(() => {}), 800);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithGoogleRedirect, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
