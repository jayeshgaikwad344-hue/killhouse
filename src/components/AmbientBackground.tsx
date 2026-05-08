import { motion } from "motion/react";

export default function AmbientBackground({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={`liquid-mesh transition-all duration-1000 ${isPlaying ? "opacity-40" : "opacity-20"}`}>
      <motion.div 
        animate={{ 
          scale: isPlaying ? [1, 1.2, 1] : [1, 1.05, 1],
          opacity: isPlaying ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2]
        }}
        transition={{ duration: isPlaying ? 5 : 15, repeat: Infinity, ease: "easeInOut" }}
        className="blob blob-1" 
      />
      <motion.div 
        animate={{ 
          scale: isPlaying ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: isPlaying ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1]
        }}
        transition={{ duration: isPlaying ? 7 : 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="blob blob-2" 
      />
      <motion.div 
        animate={{ 
          scale: isPlaying ? [1, 1.4, 1] : [1, 1.15, 1],
          opacity: isPlaying ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
        }}
        transition={{ duration: isPlaying ? 6 : 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="blob blob-3" 
      />
      <motion.div 
        animate={{ 
          scale: isPlaying ? [1, 1.25, 1] : [1, 1.08, 1],
          opacity: isPlaying ? [0.2, 0.4, 0.2] : [0.15, 0.25, 0.15]
        }}
        transition={{ duration: isPlaying ? 8 : 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="blob blob-4" 
      />
    </div>
  );
}
