import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring } from 'motion/react';
import { Play } from 'lucide-react';
import { cn } from '../lib/utils';

const AlbumArtCard = React.memo(({ title, image, index, total, radius }: any) => {
  const angle = (index / total) * 360;
  
  return (
    <div
      className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 cursor-pointer group"
      style={{
        transform: `rotateY(${angle}deg) translate3d(0, 0, ${radius}px)`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        willChange: "transform"
      }}
    >
      <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-500">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl" 
          loading="lazy"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-xl z-30">
          <p className="text-[7px] sm:text-[9px] font-mono text-red-500/80 uppercase tracking-[0.2em] mb-0.5 font-bold">KILLHOUSE</p>
          <h4 className="text-white font-display font-black uppercase text-[9px] sm:text-[11px] md:text-[13px] leading-tight tracking-tight truncate">{title}</h4>
        </div>
      </div>
    </div>
  );
});

export const TrackCard = ({ title, genre, duration, color, image }: any) => {
  const accentColors: Record<string, string> = {
    purple: "text-purple-neon shadow-purple-neon/20",
    blue: "text-blue-electric shadow-blue-electric/20",
    red: "text-red-crimson shadow-red-crimson/20",
    orange: "text-orange-glow shadow-orange-glow/20",
  };

  const borderColors: Record<string, string> = {
    purple: "border-purple-neon/20",
    blue: "border-blue-electric/20",
    red: "border-red-crimson/20",
    orange: "border-orange-glow/10",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-zinc-900/40 rounded-3xl p-6 cursor-pointer border border-white/5 hover:border-white/10 transition-all duration-500 group"
    >
      <div className="flex items-center justify-between mb-8">
        <div className={cn("w-24 h-24 bg-black/40 rounded-2xl overflow-hidden border", borderColors[color] || "border-white/10")}>
          <img src={image} alt={title} className="w-full h-full object-cover transition-all duration-700" loading="lazy" />
        </div>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">{duration}</span>
      </div>

      <div className="space-y-1 mb-8">
        <h3 className={cn("text-2xl font-display font-bold transition-colors", accentColors[color] ? accentColors[color].split(' ')[0] : "text-white")}>
          {title}
        </h3>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">{genre}</p>
      </div>

      <button className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-white text-black transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]", accentColors[color] ? accentColors[color].split(' ')[0] : "text-white")}>
        <Play className={cn("w-5 h-5 fill-current")} />
      </button>
    </motion.div>
  );
};

const HeavyArchiveCarousel = ({ 
  currentTrackIndex, 
  isPlaying, 
  onTrackChange, 
  onTogglePlay 
}: any) => {
  const rotationValue = useMotionValue(0);
  const [radius, setRadius] = useState(550);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const albumsData = [
    { id: 1, title: "Chakravyuh", image: "/cover-arts/chapter1.jpg" },
    { id: 2, title: "ASTITVA", image: "/cover-arts/chapter2.jpg" }, 
    { id: 3, title: "Aghata", image: "/cover-arts/chapter3.jpg" },
    { id: 4, title: "Pran", image: "/cover-arts/chapter4.jpg" },
    { id: 5, title: "Karm", image: "/cover-arts/chapter5.jpg" },
    { id: 6, title: "Aarzoo", image: "/cover-arts/aarzoo.jpg" },
    { id: 7, title: "Kasoor", image: "/cover-arts/kasoor.jpg" },
    { id: 8, title: "Lost Within", image: "/cover-arts/lost-within.jpg" },
    { id: 9, title: "Noor", image: "/cover-arts/noor.jpeg" },
    { id: 10, title: "Pal Pal x Haseen x Ishq", image: "/cover-arts/mashup.jpg" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let calculatedRadius;
      
      if (width < 640) {
        calculatedRadius = 180; // Mobile POV - ultra tight
      } else if (width < 1024) {
        calculatedRadius = 300; // Tablet POV - balanced
      } else {
        calculatedRadius = 380; // PC POV - compact
      }
      
      setRadius(calculatedRadius);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useAnimationFrame((time, delta) => {
    // Delta is in ms, we want constant rotation over time
    const move = (delta / 1000) * 10; // 10 degrees per second
    rotationValue.set(rotationValue.get() + move);
    if (containerRef.current) {
        // Optimized transform update
        containerRef.current.style.transform = `rotateX(-35deg) rotateY(${rotationValue.get()}deg) translateZ(0)`;
    }
  });

  return (
    <section 
      style={{ contentVisibility: 'auto' } as React.CSSProperties}
      className="pb-24 md:pb-48 pt-12 bg-black border-y border-white/5 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center">
        
        <div className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] w-full flex justify-center items-center perspective-[1200px] sm:perspective-[2000px] md:perspective-[2500px] lg:perspective-[3200px]">
          {/* Centered Content - Replicating "THE HEAVY ARCHIVE" style from image */}
          <div className="absolute z-20 text-center space-y-4 max-w-2xl px-4 pointer-events-none -translate-y-8 sm:-translate-y-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl md:text-7xl font-display font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] shadow-white/10"
            >
              Killhouse Music
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-base md:text-xl font-display font-bold text-red-600/90 tracking-[0.2em] uppercase"
            >
              Explore More
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              transition={{ delay: 0.4 }}
              className="text-[8px] sm:text-[10px] md:text-xs font-sans text-white/60 max-w-md mx-auto leading-relaxed"
            >
              Pulsing drill-infused beats capturing existential reflection, exploring the raw essence of sound in a modern urban landscape.
            </motion.p>
            
            <div className="pt-6">
              <motion.a 
                href="https://www.youtube.com/@killhousemusic"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-10 py-3 border border-white/20 text-white text-[9px] uppercase tracking-[0.4em] font-black rounded-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all pointer-events-auto backdrop-blur-sm"
              >
                Click Here
              </motion.a>
            </div>
          </div>

          <div 
            ref={containerRef}
            className="relative w-full flex justify-center items-center"
            style={{ 
              transformStyle: "preserve-3d",
              willChange: "transform",
              transform: `rotateX(-40deg) rotateY(0deg)` 
            }}
          >
            {albumsData.map((album, i) => (
              <AlbumArtCard 
                key={album.id} 
                title={album.title} 
                image={album.image} 
                index={i}
                total={albumsData.length}
                radius={radius}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Perspective Floor Grid */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[100%] pointer-events-none opacity-[0.03]"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "rotateX(75deg) translateY(20%)",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 80%)"
          }}
        />
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-red-600/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default HeavyArchiveCarousel;
