import { Shield, Lock, EyeOff, Database, UserCheck, Mail, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const lastUpdated = 'September 26, 2026';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Last updated: {lastUpdated} · Effective Date: January 1, 2025
        </p>
      </div>

      {/* Core Principle: Data Minimization Highlight Card */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Our Core Commitment: "Only Collect Necessary Data" (Data Minimization)
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          At <strong>Typlix</strong>, we adhere strictly to the principle of <em>Data Minimization</em> (consistent with GDPR Article 5(1)(c), CCPA, and global privacy standards). We collect <strong>only the minimum data strictly necessary</strong> to deliver touch typing lessons, track your speed and accuracy metrics, and maintain your custom app preferences. We do not sell, rent, monetize, or broker your personal information to third parties or advertising brokers.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> Information We Collect
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Depending on how you use Typlix, we may collect the following limited categories of information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-neutral-500" />
                Typing Performance & Progress Data
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Words Per Minute (WPM) and Raw WPM</li>
                <li>Accuracy percentage and error keystrokes</li>
                <li>Lesson level progress (Levels 1 to 50)</li>
                <li>Practice test timestamps & duration</li>
                <li>Speed test mode choices (Quotes, Code, Custom)</li>
              </ul>
              <p className="text-[11px] text-neutral-500 italic mt-1">
                * Kept strictly in your local browser storage by default; only synced to cloud if you explicitly sign in.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-neutral-500" />
                Account Credentials (Optional)
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Email address (used solely for authentication)</li>
                <li>Display name or avatar (if signing in via Google)</li>
                <li>Account creation & last login timestamp</li>
                <li>Hashed authentication tokens (managed securely via Firebase Auth)</li>
              </ul>
              <p className="text-[11px] text-neutral-500 italic mt-1">
                * You can use Typlix 100% anonymously without creating an account.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-neutral-500" />
                App Preferences & Configuration
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Mechanical switch audio profile & volume</li>
                <li>Color theme (Light / Dark)</li>
                <li>Keyboard layout preference (QWERTY, Dvorak, Colemak)</li>
                <li>Cookie consent selection choices</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-rose-500" />
                What We NEVER Collect
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>No keyloggers or recording of sensitive keystrokes outside game tests</li>
                <li>No financial or credit card numbers stored on our servers</li>
                <li>No precise physical location / GPS coordinates</li>
                <li>No cross-site tracking pixels or advertising identifiers</li>
                <li>No personal data scraping or selling to third parties</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2.</span> How We Use Your Information
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We use the necessary information strictly for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>To render real-time typing feedback, speed graphs, and finger placement tutorials.</li>
            <li>To calculate your typing statistics, personal records, and unlocked lessons.</li>
            <li>To enable multi-device synchronization if you choose to authenticate.</li>
            <li>To display opt-in rankings on public leaderboards (using your display name or chosen alias).</li>
            <li>To remember your audio preferences and UI dark/light themes.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>3.</span> Lawful Bases for Processing & Form Consent
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            When you register, submit forms, or utilize cloud synchronization, our lawful bases include:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Explicit Consent:</span> For optional account creation, newsletter/contact communication, and non-essential cookies. You have the right to withdraw this consent at any time.
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Contractual Necessity:</span> To provide touch typing practice services, account authentication, and cloud data persistence as requested by you.
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Legitimate Interest:</span> To ensure the integrity of the platform, prevent leaderboard spam or automated bot abuse, and maintain application security.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4.</span> Third-Party Service Providers
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We use trusted enterprise infrastructure that meets SOC 2 and GDPR standards:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><strong>Google Firebase Auth:</strong> For secure, tokenized user authentication and login without storing plain-text passwords.</li>
            <li><strong>Google Cloud Firestore:</strong> For encrypted cloud synchronization of your lesson levels and typing high-scores.</li>
            <li><strong>Hosting Providers (Vercel / Netlify / Firebase):</strong> For fast, edge-cached SSL content delivery.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>5.</span> Your Data Rights (GDPR & CCPA Compliant)
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            You maintain full sovereignty over your data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Access & Portability</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You can download all your stored session statistics as a standard JSON or CSV file at any time from the <Link to="/settings" className="underline text-neutral-800 dark:text-neutral-200 font-medium">Settings</Link> page.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Erasure ("Be Forgotten")</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You can reset your level progress, purge session history, or wipe local storage with one click in Settings, or contact us to delete your cloud profile.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Rectification</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You can modify your profile display name, change sound settings, or update your registered email.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Withdraw Consent</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You can alter your cookie and storage preferences at any time via the <Link to="/cookies" className="underline text-neutral-800 dark:text-neutral-200 font-medium">Cookie Policy</Link> page or footer link.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>6.</span> Data Retention & Security
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We employ modern encryption standards (TLS 1.3 in transit, AES-256 for cloud databases). Anonymous visitors have data saved only within their browser’s local storage. Stored cloud data is kept until you request deletion or remain inactive for over 24 consecutive months.
          </p>
        </section>

        {/* Section 7: Contact */}
        <section className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>7.</span> Contact Our Privacy Officer
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            If you have questions regarding this Privacy Policy, your rights, or wish to request full data deletion, please contact our team:
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-3">
            <Mail className="w-5 h-5 text-neutral-500" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Privacy & Data Governance Team</div>
              <a href="mailto:privacy@typlix.app" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline">
                privacy@typlix.app
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-500">
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
        <span>•</span>
        <Link to="/refund" className="hover:underline">Refund Policy</Link>
        <span>•</span>
        <Link to="/settings" className="hover:underline">Manage Stored Data</Link>
      </div>
    </div>
  );
}
