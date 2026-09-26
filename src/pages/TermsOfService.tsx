import { FileText, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const lastUpdated = 'September 26, 2026';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Terms & Conditions
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Last updated: {lastUpdated} · Effective Date: January 1, 2025
        </p>
      </div>

      {/* Intro Note */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        Please read these Terms & Conditions ("Terms", "Agreement") carefully before using the <strong>Typlix</strong> touch-typing training web platform. By accessing or using Typlix, you agree to be legally bound by these Terms and our <Link to="/privacy" className="underline text-neutral-900 dark:text-white font-medium">Privacy Policy</Link>.
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> Acceptance and Eligibility
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            By creating an account or by using any portion of Typlix, you affirm that you are at least 13 years of age (or the minimum legal age in your jurisdiction) and possess the legal authority to enter into this binding agreement. If you are using Typlix on behalf of an educational institution or organization, you represent that you have authority to bind that entity.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2.</span> User Accounts and Security
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            While basic typing lessons can be utilized anonymously without registration, signing in unlocks cloud synchronization, cross-device stats, and public leaderboard rankings.
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>You are responsible for safeguarding your login credentials (passwords or Google authentication tokens).</li>
            <li>You must provide accurate, non-fraudulent email credentials.</li>
            <li>You must notify us immediately upon suspecting any unauthorized access to your account.</li>
          </ul>
        </section>

        {/* Section 3: Fair Play & Acceptable Use */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              3. Fair Play, Anti-Cheat, and Acceptable Use
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Strict Policy
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Typlix is designed to help human typists hone real muscle memory and measurable keyboard skills. To maintain competitive integrity across leaderboards:
          </p>
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 space-y-2">
            <div className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Prohibited Behaviors
            </div>
            <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
              <li>Using automated typing bots, macros, autoclickers, or headless scripts to simulate keystrokes.</li>
              <li>Injecting artificial high scores or tampering with WebSocket/HTTP payloads to skew leaderboard rankings.</li>
              <li>Attempting to reverse-engineer, decompile, or exploit vulnerabilities in our application API.</li>
              <li>Engaging in offensive, defamatory, or abusive behavior in public usernames or profile avatars.</li>
            </ul>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Violations of this section will result in immediate disqualification of high-scores and possible suspension of cloud synchronization rights.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4.</span> Intellectual Property Rights
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            All code, UI designs, sound synthesizers, lesson curricula, graphics, trademarks, and logos on Typlix are the exclusive property of Typlix or its licensors. You are granted a limited, personal, non-exclusive, non-transferable license to access and practice touch typing for personal or classroom learning.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>5.</span> Service Availability & Updates
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We strive to provide uninterrupted service with 99.9% uptime. However, Typlix may occasionally undergo maintenance, feature enhancements, or unexpected downtime. We reserve the right to update, modify, or deprecate features with or without prior notice.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>6.</span> Disclaimer of Warranties
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Typlix is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that typing metrics will guarantee specific professional employment or typing exam outcomes.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>7.</span> Limitation of Liability
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            To the maximum extent permitted by applicable law, in no event shall Typlix, its creators, or contributors be liable for any indirect, punitive, incidental, special, or consequential damages resulting from your use of or inability to use the platform.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>8.</span> Termination
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We reserve the right to terminate or suspend your account and access to Typlix immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. You may stop using the service at any time and purge your data from the Settings page.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>9.</span> Changes to Terms
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We may revise these Terms occasionally. When changes occur, we will update the "Last Updated" date at the top of this document. Continued usage after modifications implies your acceptance of the updated terms.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>10.</span> Inquiries and Legal Contact
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            For questions or notices regarding these Terms, contact our legal team:
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-3">
            <Mail className="w-5 h-5 text-neutral-500" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Legal Affairs & Terms Operations</div>
              <a href="mailto:legal@typlix.app" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline">
                legal@typlix.app
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-500">
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
        <span>•</span>
        <Link to="/refund" className="hover:underline">Refund Policy</Link>
      </div>
    </div>
  );
}
