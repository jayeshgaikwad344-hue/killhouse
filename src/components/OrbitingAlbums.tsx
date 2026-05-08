import { motion, useAnimationControls } from "motion/react";
import { useEffect, useState } from "react";
import { TRACKS } from "./MusicPlayer";

export default function OrbitingAlbums() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const controls = useAnimationControls();

  // We'll use 8 items for a fuller orbit. If TRACKS has fewer, we'll repeat them.
  const orbitItems = [...TRACKS, ...TRACKS].slice(0, 8);
  const radius = 300; // Radius of the orbit

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-32">
      {/* Section Label */}
      <div className="absolute top-32 left-8 sm:left-16 lg:left-32 z-20">
        <span className="text-white text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">02 / Discography</span>
      </div>

      {/* Immersive Background Gradients (Recipe 7) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-zinc-800/30 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        {/* Central Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12 z-20"
        >
          <h2 className="text-6xl sm:text-8xl font-sans font-black uppercase tracking-tighter text-white mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Killhouse Music
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/40">
            Industrial, Raw, and Authentic Sounds
          </p>
          <div className="mt-8 text-xs text-white/30 max-w-md mx-auto leading-relaxed">
            Exploring the intersection of brutalist architecture and sonic decay through modular Synthesis.
          </div>
        </motion.div>

        {/* Orbiting Carousel Container */}
        <div className="relative w-full h-[600px] flex items-center justify-center perspective-[1500px]">
          <motion.div 
            className="relative w-full h-full flex items-center justify-center preserve-3d"
            animate={{ rotateY: 360 }}
            transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {orbitItems.map((track, i) => {
              const angle = (i / orbitItems.length) * (Math.PI * 2);
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              
              return (
                <motion.div
                  key={`${track.id}-${i}`}
                  className="absolute w-48 h-64 cursor-pointer"
                  style={{
                    x: x,
                    z: z,
                    // Faces the center
                    rotateY: (angle * 180) / Math.PI,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden"
                  }}
                  whileHover={{ scale: 1.1, z: z + 50 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="w-full h-full glass-card p-2 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group">
                    <img 
                      src={track.image} 
                      alt={track.title} 
                      className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{track.title}</span>
                      <span className="text-[8px] text-white/60 uppercase tracking-widest">{track.artist}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative subtle noise or scanlines could be added here if needed */}
    </section>
  );
}
