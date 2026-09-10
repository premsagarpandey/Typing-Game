export default function FingerPlacementTutorial() {
  return (
    <div className="w-full max-w-3xl mx-auto my-10 p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Home Row Placement
        </h2>
        <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-lg mx-auto">
          Rest your fingertips lightly on the home row keys.
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
        <div className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-md">
          <span className="text-neutral-500 dark:text-neutral-500">Left Hand</span>
          <div className="flex items-center gap-1.5 font-mono font-medium text-neutral-700 dark:text-neutral-300">
            <span>A</span><span>S</span><span>D</span><span>F</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-md">
          <span className="text-neutral-500 dark:text-neutral-500">Right Hand</span>
          <div className="flex items-center gap-1.5 font-mono font-medium text-neutral-700 dark:text-neutral-300">
            <span>J</span><span>K</span><span>L</span><span>;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
