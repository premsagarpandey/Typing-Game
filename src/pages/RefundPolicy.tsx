import { DollarSign, CheckCircle, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  const lastUpdated = 'September 26, 2026';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Billing & Refund Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Refund & Cancellation Policy
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Last updated: {lastUpdated} · Effective Date: January 1, 2025
        </p>
      </div>

      {/* Free Tier Notice Card */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-2">
        <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-base">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span>100% Free Core Access</span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <strong>Typlix is completely free to use.</strong> All 50 touch-typing lessons, real-time metrics, speed tests (quotes, code, custom), finger placement tutorials, and local statistics tracking are provided without requiring payment, trial periods, or credit card submission.
        </p>
      </div>

      {/* Refund Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> Scope of This Refund Policy
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            This Refund & Cancellation Policy applies to any optional voluntary purchases, creator support contributions, or premium features (such as custom themes, cloud data backups, or school classroom tiers) that may be offered through Typlix or its official payment partners.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              2. 14-Day Money-Back Guarantee
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Full Guarantee
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            We want you to be 100% delighted with Typlix. If you make any optional purchase or subscription payment and are not completely satisfied, you are entitled to a <strong>full refund within 14 calendar days</strong> of the transaction date.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Eligible Scenarios</div>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Accidental duplicate purchases or incorrect tier selection</li>
                <li>Unsatisfactory performance or technical incompatibility</li>
                <li>Billing errors or unauthorized charge detection</li>
                <li>General dissatisfaction within the 14-day window</li>
              </ul>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Non-Refundable Situations</div>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Requests submitted after 14 calendar days from transaction</li>
                <li>Accounts terminated due to cheating or Terms of Service violations</li>
                <li>Third-party platform fees outside our direct billing system</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>3.</span> Cancellation of Recurring Subscriptions
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            You may cancel any active recurring subscription at any moment without penalty or cancellation fees:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>You can cancel via your Profile & Billing settings or by contacting our team.</li>
            <li>Upon cancellation, your subscription will not renew at the next billing period.</li>
            <li>You will retain uninterrupted access to any premium benefits until the conclusion of your current paid billing cycle.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4.</span> Processing Time & Payment Method
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Approved refunds are credited directly back to the original payment method used during checkout (Credit/Debit Card, Stripe, or Google Pay).
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Timeline:</span> Most refunds are processed within <strong>24 to 48 hours</strong> by our team. Depending on your bank or credit card issuer, funds typically reflect in your account within <strong>5 to 10 business days</strong>.
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>5.</span> How to Request a Refund
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            To submit a refund request, simply email our billing department with the following details:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pl-2">
            <li>Your account email address registered with Typlix.</li>
            <li>Transaction / Order ID or payment receipt from the checkout provider.</li>
            <li>A brief description of why you are requesting the refund (to help us improve).</li>
          </ol>
        </section>

        {/* Section 6: Contact */}
        <section className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>6.</span> Billing Support Contact
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            For all billing inquiries, refund requests, or invoice questions, please reach out to:
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-3">
            <Mail className="w-5 h-5 text-neutral-500" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Billing & Payment Operations</div>
              <a href="mailto:billing@typlix.app" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline">
                billing@typlix.app
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-500">
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <span>•</span>
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
      </div>
    </div>
  );
}
