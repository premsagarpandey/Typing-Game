import { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { secureStorage } from '../utils/secureStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to sync local progress with cloud progress
  const syncProgress = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      const localLevel = secureStorage.getItem<number>('typingGameLevel', 1);

      if (userSnap.exists()) {
        const cloudData = userSnap.data();
        const cloudLevel = cloudData.typingGameLevel || 1;

        if (cloudLevel > localLevel) {
          // Cloud is ahead, update local
          secureStorage.setItem('typingGameLevel', cloudLevel);
        } else if (localLevel > cloudLevel) {
          // Local is ahead, update cloud
          await setDoc(userRef, { typingGameLevel: localLevel }, { merge: true });
        }
      } else {
        // First time login, save local level to cloud
        await setDoc(userRef, { typingGameLevel: localLevel }, { merge: true });
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncProgress(currentUser);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error logging in with Google:', error);
      alert(`Login failed: ${error.message || 'Unknown error'}. Please check if pop-ups are allowed or if Google Auth is fully enabled.`);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Error logging in with Email:', error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Error signing up with Email:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
