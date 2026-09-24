import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PRESET_CUSTOM_TEXTS, type CustomPreset } from '../../data/words';
import { sanitizeCustomText } from '../../utils/textUtils';

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
    const clean = sanitizeCustomText(text);
    if (!clean) return;
    onApply(clean, timeLimit);
    onClose();
  };

  return createPortal(
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

        {/* Preset Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {PRESET_CUSTOM_TEXTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="p-2 text-left border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 capitalize">
                  {preset.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Your Text
            </label>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
              {wordCount} words · {charCount} characters
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your custom text here..."
            rows={5}
            className="w-full p-3 text-sm font-mono bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 resize-none"
          />
        </div>

        {/* Time Limit */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Time Limit
          </label>
          <div className="flex gap-2">
            {[
              { label: 'None', val: 0 },
              { label: '30s', val: 30 },
              { label: '60s', val: 60 },
              { label: '120s', val: 120 },
            ].map(({ label, val }) => (
              <button
                key={val}
                onClick={() => setTimeLimit(val)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                  timeLimit === val
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
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
    </div>,
    document.body
  );
}
