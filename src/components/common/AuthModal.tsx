import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../utils/toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, loginWithGoogle, loginWithGoogleRedirect, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleClose = useCallback(() => {
    setEmail('');
    setPassword('');
    setEmailLoading(false);
    setGoogleLoading(false);
    onClose();
  }, [onClose]);

  // Automatically close modal and navigate to home whenever user is signed in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      navigate('/');
    }
  }, [user, isOpen, onClose, navigate]);

  // Close modal on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailLoading || googleLoading) return;

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailLower)) {
      toast.error('Please enter a valid email address.', 'Invalid Email');
      return;
    }

    setEmailLoading(true);

    try {
      if (isLoginMode) {
        await loginWithEmail(emailLower, password);
        toast.success('Signed in successfully!', 'Welcome Back');
      } else {
        await signupWithEmail(emailLower, password);
        toast.success('Account created successfully!', 'Welcome to Typlix');
      }
      handleClose();
      navigate('/');
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      let message = 'An error occurred during authentication.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please wait a few moments and try again.';
      } else if (err.message) {
        message = err.message;
      }

      handleClose();
      navigate('/');
      toast.error(message, isLoginMode ? 'Login Failed' : 'Sign Up Failed');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (googleLoading || emailLoading) return;
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      toast.success('Signed in with Google successfully!', 'Welcome Back');
      handleClose();
      navigate('/');
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      let message = 'Failed to authenticate with Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in cancelled. The Google window was closed.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Google sign-in popup was blocked by browser. Please allow popups for localhost.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Sign-in request interrupted. Please click Google once.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized in Firebase settings.';
      } else if (err.message) {
        message = err.message;
      }

      handleClose();
      navigate('/');
      toast.error(message, 'Google Sign-In Error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRedirect = async () => {
    if (googleLoading || emailLoading) return;
    setGoogleLoading(true);

    try {
      await loginWithGoogleRedirect();
    } catch (err: any) {
      handleClose();
      navigate('/');
      toast.error(err.message || 'Failed to redirect to Google.', 'Redirect Error');
      setGoogleLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={handleClose}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xl flex items-center justify-center font-mono shadow-lg">
                  T
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
                  {isLoginMode ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isLoginMode 
                    ? 'Enter your details to access your progress'
                    : 'Sign up to sync your typing stats everywhere'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={emailLoading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {emailLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLoginMode ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading || emailLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                  )}
                  <span>{googleLoading ? 'Connecting to Google...' : 'Google'}</span>
                </button>

                <div className="mt-2.5 text-center">
                  <button
                    type="button"
                    onClick={handleGoogleRedirect}
                    className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 underline transition-colors cursor-pointer"
                  >
                    Trouble with popup? Try signing in with redirect &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 py-4 px-8 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                  }}
                  className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all cursor-pointer"
                >
                  {isLoginMode ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
