export default function FingerPlacementTutorial() {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Finger Placement Guide
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Rest your fingers lightly on the highlighted <strong className="text-blue-600 dark:text-blue-400">Home Row</strong> keys.
        </p>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] bg-black aspect-[1/1] sm:aspect-[16/10] group">
        
        {/* Clean Static Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/tutorial-image.jpg')" }}
        />
        
      </div>
    </div>
  );
}
