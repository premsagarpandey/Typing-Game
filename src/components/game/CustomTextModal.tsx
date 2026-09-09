import { useState } from 'react';
import { PRESET_CUSTOM_TEXTS, type CustomPreset } from '../../data/words';

interface CustomTextModalProps {
  isOpen: boolean;
  initialText: string;
  initialTimeLimit: number;
  onClose: () => void;
  onApply: (text: string, timeLimit: number) => void;
}

export default function CustomTextModal({
  isOpen,
  initialText,
  initialTimeLimit,
  onClose,
  onApply,
}: CustomTextModalProps) {
  const [text, setText] = useState(initialText || '');
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit || 60);

  if (!isOpen) return null;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSelectPreset = (preset: CustomPreset) => {
    setText(preset.text);
  };

  const handleStart = () => {
    if (!text.trim()) return;
    onApply(text.trim(), timeLimit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Custom Text Practice
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Presets / Samples:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CUSTOM_TEXTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer text-slate-700 dark:text-gray-300"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
            <span>Paste or write your custom practice text:</span>
            <span>
              {wordCount} words • {charCount} chars
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your paragraph, code, or lyrics here..."
            rows={5}
            className="w-full p-3 text-sm font-mono rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Time Limit Selector */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">
            Time Limit:
          </span>
          <div className="flex items-center gap-1.5">
            {[30, 60, 120, 0].map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTimeLimit(seconds)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  timeLimit === seconds
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {seconds === 0 ? 'No Limit' : `${seconds}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!text.trim()}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Start Custom Practice →
          </button>
        </div>
      </div>
    </div>
  );
}
