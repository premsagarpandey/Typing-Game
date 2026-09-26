import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Check, Settings2, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getCookieConsent,
  saveCookieConsent,
  type CookieConsentPreferences,
} from '../../utils/cookieConsent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference switches inside the modal
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(() => {
    return (
      getCookieConsent() || {
        necessary: true,
        functional: true,
        analytics: true,
        timestamp: '',
        version: '1.0',
      }
    );
  });

  useEffect(() => {
    // Check if consent has already been recorded
    const existing = getCookieConsent();
    if (!existing) {
      // Show banner after brief delay so initial load is smooth
      const timer = setTimeout(() => setShowBanner(true), 750);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for custom trigger to open modal from anywhere (e.g. footer or cookies page)
    const handleOpenModal = () => {
      const existing = getCookieConsent();
      if (existing) {
        setPreferences(existing);
      }
      setShowModal(true);
    };

    const handleReset = () => {
      setShowBanner(true);
      setShowModal(false);
    };

    window.addEventListener('typlix-open-cookie-modal', handleOpenModal);
    window.addEventListener('typlix-cookie-consent-reset', handleReset);

    return () => {
      window.removeEventListener('typlix-open-cookie-modal', handleOpenModal);
      window.removeEventListener('typlix-cookie-consent-reset', handleReset);
    };
  }, []);

  const handleAcceptAll = useCallback(() => {
    saveCookieConsent({
      necessary: true,
      functional: true,
      analytics: true,
    });
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleAcceptNecessaryOnly = useCallback(() => {
    saveCookieConsent({
      necessary: true,
      functional: false,
      analytics: false,
    });
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleSaveCustom = useCallback(() => {
    saveCookieConsent(preferences);
    setShowBanner(false);
    setShowModal(false);
  }, [preferences]);

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      <AnimatePresence>
        {showBanner && !showModal && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Cookie & Data Preferences
                  </h4>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Data Minimization
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Typlix collects <span className="font-semibold text-neutral-900 dark:text-neutral-200">only necessary data</span> required to save your typing progress, speed tests, and audio preferences. No third-party ad tracking or selling of data.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <Link to="/cookies" className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-2">
                Cookie Policy
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-2">
                Privacy Policy
              </Link>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 min-w-[100px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer text-center"
              >
                Accept All
              </button>
              <button
                onClick={handleAcceptNecessaryOnly}
                className="flex-1 min-w-[100px] px-3.5 py-2 rounded-xl text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer text-center"
              >
                Only Necessary
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="p-2 rounded-xl text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Customize Preferences"
                aria-label="Customize cookie preferences"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Customization Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      Cookie & Storage Preferences
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Control how Typlix uses cookies and browser storage
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">Our Data Minimization Pledge:</span> We only collect the minimal data essential to provide you a seamless typing practice experience. We do not use third-party analytics trackers, sell your data, or display third-party advertisements.
                </div>

                {/* 1. Necessary */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Strictly Necessary
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        Always Active
                      </span>
                    </div>
                    <div className="w-9 h-5 bg-neutral-900 dark:bg-neutral-100 rounded-full flex items-center justify-end px-1 opacity-70 cursor-not-allowed">
                      <div className="w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-900" />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Required for core security, maintaining authentication sessions, and remembering your cookie consent selection. These cannot be disabled.
                  </p>
                </div>

                {/* 2. Functional & Preferences */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Preferences & Functional
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.functional}
                      onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                      className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                        preferences.functional ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-transform bg-white dark:bg-neutral-900 shadow-sm ${
                          preferences.functional ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Stores your mechanical keyboard sound profile, volume, theme mode (dark/light), and custom keyboard layouts locally in your browser.
                  </p>
                </div>

                {/* 3. Analytics & Progress Metrics */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Performance & Typing Progress
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.analytics}
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                        preferences.analytics ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-transform bg-white dark:bg-neutral-900 shadow-sm ${
                          preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Saves your lesson progression, WPM and accuracy metrics, and speed test history. If turned off, stats will not be recorded in session history.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  <Link
                    to="/cookies"
                    onClick={() => setShowModal(false)}
                    className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2"
                  >
                    Read full Cookie Policy <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleAcceptNecessaryOnly}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Decline Non-Essential
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleSaveCustom}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Choices
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
