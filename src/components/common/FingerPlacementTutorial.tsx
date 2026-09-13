import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getKeyboardLayout, type KeyboardLayoutId } from '../../data/keyboardLayouts';

export default function FingerPlacementTutorial() {
  const [layoutId] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const layout = getKeyboardLayout(layoutId);

  return (
    <div className="w-full max-w-3xl mx-auto my-10 p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2 rounded-full text-xs font-mono font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
          Active Layout: <span className="font-bold">{layout.name}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Home Row Placement
        </h2>
        <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-lg mx-auto">
          Rest your fingertips lightly on the home row keys. {layout.shortDesc}
        </p>
      </div>

      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
        <img
          src="/tutorial-image.jpg"
          alt="Touch typing home row finger placement guide"
          className="w-full h-auto object-cover"
          loading="eager"
        />
      </div>

      {/* Key Reference */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <div className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50 dark:bg-neutral-900">
          <span className="text-neutral-500 dark:text-neutral-500">Left Hand</span>
          <div className="flex items-center gap-2 font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {layout.homeRowLeft.map((k) => (
              <span key={k} className="px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50 dark:bg-neutral-900">
          <span className="text-neutral-500 dark:text-neutral-500">Right Hand</span>
          <div className="flex items-center gap-2 font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {layout.homeRowRight.map((k) => (
              <span key={k} className="px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
