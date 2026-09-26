import { useState, useEffect } from 'react';
import { Cookie, RotateCcw, CheckCircle2, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  openCookieConsentModal,
  resetCookieConsent,
  getCookieConsent,
  type CookieConsentPreferences,
} from '../utils/cookieConsent';

export default function CookiesPolicy() {
  const lastUpdated = 'September 26, 2026';
  const [currentConsent, setCurrentConsent] = useState<CookieConsentPreferences | null>(() => getCookieConsent());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsentPreferences>;
      setCurrentConsent(customEvent.detail || getCookieConsent());
    };

    window.addEventListener('typlix-cookie-consent-updated', handleUpdate);
    return () => window.removeEventListener('typlix-cookie-consent-updated', handleUpdate);
  }, []);

  const handleReset = () => {
    resetCookieConsent();
    setCurrentConsent(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Cookie className="w-3.5 h-3.5" />
          <span>Storage & Tracking Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cookies & Storage Policy
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Last updated: {lastUpdated} · Effective Date: January 1, 2025
        </p>
      </div>

      {/* Interactive Current Status Banner */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Your Current Consent Status:
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {currentConsent ? 'Preferences Saved' : 'Default / Not Set'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Functional cookies:{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {currentConsent?.functional ? 'Enabled' : 'Disabled'}
            </span>{' '}
            · Analytics & Metrics:{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {currentConsent?.analytics ? 'Enabled' : 'Disabled'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openCookieConsentModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            Manage Preferences
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Reset and show cookie banner again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Banner
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> What Are Cookies and Local Storage?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Cookies and browser storage mechanisms (such as HTML5 <code>localStorage</code> and <code>sessionStorage</code>) are small text-based data records stored directly on your computer or mobile device. They allow web applications like Typlix to remember your preferences between sessions without forcing you to reconfigure sound effects or log in on every page refresh.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            <strong>Typlix does not use invasive third-party ad-tracking cookies.</strong> Most of our application state is stored locally within your own browser via standard HTML5 <code>localStorage</code>, giving you full client-side control.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2.</span> The Three Categories of Storage We Use
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  A. Strictly Necessary (Essential)
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded">
                  Mandatory
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                These are required for basic technical security and operation. They maintain your authenticated session token with Firebase, protect against Cross-Site Request Forgery (CSRF), and remember your cookie consent preferences.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  B. Functional & Preference Storage
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  User Configurable
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                These enhance your user experience by persisting your chosen mechanical switch audio profiles (e.g. Cherry MX Blue, Alps, Topre), sound volume, keyboard layouts (QWERTY, Dvorak, Colemak), and theme mode (Dark or Light).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  C. Performance & Typing Analytics
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  User Configurable
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Stores your personal typing speed logs (WPM, accuracy, completed lesson levels 1-50, practice duration). If you choose to sign in, these are synced to your private Firestore profile so you can resume on mobile or desktop.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Exact Table of Stored Items */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>3.</span> Complete Inventory of Storage Keys on Typlix
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Under our <em>Data Minimization</em> philosophy, we maintain complete transparency regarding every storage key placed in your browser:
          </p>

          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                  <th className="p-3 font-semibold">Key Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Purpose</th>
                  <th className="p-3 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400">
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">typlix_cookie_consent</td>
                  <td className="p-3">Strictly Necessary</td>
                  <td className="p-3">Stores your consent choices and opt-out preferences</td>
                  <td className="p-3">1 Year</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">firebase:authUser:...</td>
                  <td className="p-3">Strictly Necessary</td>
                  <td className="p-3">Maintains authenticated session if signed in</td>
                  <td className="p-3">Session / Persistent</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">typlix_theme</td>
                  <td className="p-3">Functional</td>
                  <td className="p-3">Preserves your preferred theme (dark or light)</td>
                  <td className="p-3">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">sound, soundProfile, soundVolume</td>
                  <td className="p-3">Functional</td>
                  <td className="p-3">Saves switch sounds, audio engine toggle, and volume</td>
                  <td className="p-3">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">keyboardLayout</td>
                  <td className="p-3">Functional</td>
                  <td className="p-3">Remembers chosen layout (QWERTY, Dvorak, Colemak)</td>
                  <td className="p-3">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">typlix_user_progress</td>
                  <td className="p-3">Performance</td>
                  <td className="p-3">Stores lesson 1-50 completion & current level</td>
                  <td className="p-3">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-neutral-900 dark:text-neutral-200">typlix_stats_history</td>
                  <td className="p-3">Performance</td>
                  <td className="p-3">Records past session WPM & accuracy benchmarks</td>
                  <td className="p-3">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4.</span> Managing Storage in Your Web Browser
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            In addition to using our built-in <button onClick={openCookieConsentModal} className="underline text-neutral-900 dark:text-white font-medium cursor-pointer">Preferences Manager</button>, you can inspect, block, or clear cookies and local storage directly through your browser settings:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Cookies and other site data.</li>
            <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy & Security &rarr; Cookies and Site Data &rarr; Clear Data.</li>
            <li><strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data.</li>
            <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies.</li>
          </ul>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-500">
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <span>•</span>
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/refund" className="hover:underline">Refund Policy</Link>
      </div>
    </div>
  );
}
