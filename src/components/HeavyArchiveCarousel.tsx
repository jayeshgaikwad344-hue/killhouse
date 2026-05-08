import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { cn } from '../lib/utils';

const AlbumArtCard = ({ title, image, index, total, radius }: any) => {
  const angle = (index / total) * 360;
  
  return (
    <div
      className="absolute w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 cursor-pointer group"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-500 shadow-2xl">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover rounded-xl border border-white/10 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 rounded-xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Heavy Metal</p>
          <h4 className="text-white font-display font-black uppercase text-xs sm:text-sm md:text-base leading-tight">{title}</h4>
        </div>
      </div>
      
      {/* Reflection effect */}
      <div 
        className="absolute w-full h-full top-full left-0 opacity-20 pointer-events-none scale-y-[-1] blur-sm"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)"
        }}
      >
        <img 
          src={image} 
          alt="" 
          className="w-full h-full object-cover rounded-xl" 
        />
      </div>
    </div>
  );
};

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
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 cursor-pointer border border-white/5 hover:border-white/10 transition-all duration-500 group"
    >
      <div className="flex items-center justify-between mb-8">
        <div className={cn("w-24 h-24 bg-black/40 rounded-2xl overflow-hidden border", borderColors[color] || "border-white/10")}>
          <img src={image} alt={title} className="w-full h-full object-cover transition-all duration-700" />
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

const HeavyArchiveCarousel = () => {
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(550);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const albumsData = [
    { id: 1, title: "Deep Purple", image: "/src/assets/images/regenerated_image_1777992676397.png" },
    { id: 2, title: "Iron Maiden", image: "/src/assets/images/regenerated_image_1777993089103.png" }, 
    { id: 3, title: "AC/DC", image: "/src/assets/images/regenerated_image_1777993250191.jpg" },
    { id: 4, title: "Black Sabbath", image: "/src/assets/images/regenerated_image_1777993379890.png" },
    { id: 5, title: "Motörhead", image: "/src/assets/images/regenerated_image_1778003364123.png" },
    { id: 6, title: "Megadeth", image: "/src/assets/images/regenerated_image_1778003709456.png" },
    { id: 7, title: "Slayer", image: "/src/assets/images/regenerated_image_1778004316605.png" },
    { id: 8, title: "Pantera", image: "/src/assets/images/regenerated_image_1778004441183.png" },
    { id: 9, title: "Metallica", image: "/src/assets/images/regenerated_image_1778032201676.png" },
    { id: 10, title: "Children of Bodom", image: "/src/assets/images/regenerated_image_1778032298158.png" },
    { id: 11, title: "Septicflesh", image: "/src/assets/images/regenerated_image_1777992676397.png" },
    { id: 12, title: "Led Zeppelin", image: "/src/assets/images/regenerated_image_1777993089103.png" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Fluid radius calculation - reduced by 40%
      const calculatedRadius = Math.min(Math.max(width * 0.27, 180), 420);
      setRadius(calculatedRadius);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let frameId: number;
    const animate = () => {
      setRotation(prev => prev + 0.15);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="py-24 md:py-64 bg-black border-y border-white/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center">
        
        <div className="relative h-[600px] sm:h-[700px] md:h-[900px] w-full flex justify-center items-center perspective-[2500px] md:perspective-[3500px]">
          {/* Centered Content */}
          <div className="absolute z-20 text-center space-y-4 max-w-xl px-4 pointer-events-none">
            <h2 className="text-lg sm:text-2xl md:text-5xl font-display font-black uppercase tracking-tighter text-white">
              The Heavy Archive
            </h2>
            <h3 className="text-sm sm:text-base md:text-lg font-display font-bold text-white/90 tracking-tight">
              Riffs, Rage, and Raw Emotion
            </h3>
            <p className="text-white/40 text-[7px] sm:text-[9px] md:text-[10px] leading-relaxed font-sans max-w-md mx-auto italic">
              Discover some of my favourite Hard Rock and Heavy Metal bands, the sounds that shaped my taste, my mood, and a big part of who I am.
            </p>
          </div>

          <div 
            ref={containerRef}
            className="relative w-full flex justify-center items-center transition-transform duration-100 ease-linear"
            style={{ 
              transformStyle: "preserve-3d",
              transform: `rotateX(-40deg) rotateY(${rotation}deg)` 
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
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-red-600/5 blur-[120px] md:blur-[180px] rounded-full pointer-events-none" />
    </section>
  );
};

export default HeavyArchiveCarousel;
