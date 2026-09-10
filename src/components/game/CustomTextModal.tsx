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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Custom Text
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">
            Presets
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CUSTOM_TEXTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-400"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
            <span>Your text:</span>
            <span className="font-mono">{wordCount} words · {charCount} chars</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            rows={5}
            className="w-full p-3 text-sm font-mono rounded-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
          />
        </div>

        {/* Time Limit */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500">Time Limit</span>
          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden">
            {[30, 60, 120, 0].map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTimeLimit(seconds)}
                className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  timeLimit === seconds
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {seconds === 0 ? 'None' : `${seconds}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!text.trim()}
            className="px-5 py-2 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md disabled:opacity-30 disabled:pointer-events-none hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
