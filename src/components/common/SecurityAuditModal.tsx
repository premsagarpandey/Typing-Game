import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { runSecurityAudit, type SecurityReport } from '../../utils/security';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityAuditModal({ isOpen, onClose }: SecurityAuditModalProps) {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const performAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const res = runSecurityAudit();
      setReport(res);
      setIsAuditing(false);
    }, 400);
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setReport(runSecurityAudit());
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg">
                🛡️
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Browser Security & Integrity Audit
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Real-time client-side verification report
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Top Score Banner */}
            {report && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Audit Status: Optimal
                  </span>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {report.passedCount} of {report.totalCount} security defenses passed
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Audited at {report.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {report.overallScore}%
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">ENFORCED</span>
                </div>
              </div>
            )}

            {/* Defenses list */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Active Defenses & Shields
              </h4>

              {isAuditing ? (
                <div className="py-8 text-center text-neutral-500 text-xs flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning browser sandbox & cryptographic integrity...</span>
                </div>
              ) : (
                report?.results.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-start gap-3"
                  >
                    <div className="text-sm mt-0.5">
                      {item.status === 'passed' ? '✅' : '⚠️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 flex items-center justify-between">
            <button
              onClick={performAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🔄</span> {isAuditing ? 'Auditing...' : 'Re-run Audit'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
