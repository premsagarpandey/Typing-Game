import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

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

      <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] bg-black aspect-[16/10] group">
        
        {/* Animated Background Image (Ken Burns Effect) */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/tutorial-image.jpg')" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Video Player UI Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
        
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white shadow-lg">
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <span className="text-xs font-bold uppercase tracking-wider">Live Tutorial</span>
        </div>

        {/* Floating Animated Instructions */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 text-sm sm:text-base font-medium shadow-2xl text-center max-w-md mx-4"
          >
            Place left hand on <span className="text-green-400 font-bold">A S D F</span> and right hand on <span className="text-green-400 font-bold">J K L ;</span>
          </motion.div>
        </div>

        {/* Fake Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-center px-6 gap-4">
          <PlayCircle className="text-white/90 w-6 h-6 animate-pulse" />
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 rounded-full"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <span className="text-white/80 text-xs font-mono">0:10 / 0:10</span>
        </div>
      </div>
    </div>
  );
}
