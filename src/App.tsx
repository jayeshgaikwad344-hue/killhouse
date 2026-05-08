/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  Menu, 
  X, 
  Music, 
  Coffee, 
  Zap, 
  Instagram, 
  Linkedin, 
  Twitter,
  Play,
  Pause
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import MusicPlayer, { TRACKS } from "./components/MusicPlayer";
import MiniPlayer from "./components/MiniPlayer";
import Visualizer, { VisualizerStyle, VisualizerColor } from "./components/Visualizer";
import Tooltip from "./components/Tooltip";
import HeavyArchiveCarousel from "./components/HeavyArchiveCarousel";
import { getVisualAdjustments, VisualAdjustments } from "./services/geminiVisualService";

import CustomCursor from "./components/CustomCursor";
import AmbientBackground from "./components/AmbientBackground";
import AmbientParticles from "./components/AmbientParticles";
import HeartbeatWaves from "./components/HeartbeatWaves";
import SmoothScroll from "./components/SmoothScroll";
import FireEffect from "./components/FireEffect";
import DestructionEffect from "./components/DestructionEffect";
import { soundService } from "./services/soundService";

const PROJECTS = [
  { id: 1, title: "Sonic Architecture", category: "Trap Music", year: 2026, description: "Minimalist trap beats combined with heavy, metallic industrial soundscapes, exploring harsh textures in contemporary music.", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000" },
  { id: 2, title: "Echo Chamber", category: "Installation", year: 2025, description: "An immersive audio-visual installation that explores the relationship between architectural space and acoustic decay over time.", image: "/src/assets/images/regenerated_image_1777992676397.png" },
  { id: 3, title: "Digital Distortion", category: "Visualizer", year: 2026, description: "A highly reactive audio-visualizer that transforms raw frequency data into complex, glitch-style 3D geometries in real-time.", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Analog Soul", category: "Identity", year: 2025, description: "A comprehensive brand identity project using retro-futuristic aesthetics to define a new sound studio's presence in the digital age.", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "Isolated Frequencies", category: "Audio Gear", year: 2026, description: "Designing hardware and software interfaces for sound engineers specifically to isolate and analyze high-frequency artifacts in complex mixes.", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Monochrome Melodies", category: "Photography", year: 2024, description: "A series of black and white photography captured during live shows, focusing on the intersection of human movement and sound.", image: "https://images.unsplash.com/photo-1453906616872-9d1880bc6627?auto=format&fit=crop&q=80&w=800" },
  { id: 7, title: "Resonance", category: "Branding", year: 2025, description: "Developing a visual system for a music festival that reflects the sonic characteristics of its headlining electronic artists.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800" },
  { id: 8, title: "The Circuit", category: "Event Design", year: 2026, description: "Design work for a series of underground events focused on minimalism and structured auditory experiences.", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
  { id: 9, title: "Output Control", category: "Interface", year: 2025, description: "UX/UI design for an intuitive, touch-based audio mixing interface designed for live performances.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" },
  { id: 10, title: "Synth Waves", category: "Motion", year: 2026, description: "Motion graphics series exploring frequency visualization and modular synth concepts.", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800" },
];

const PRESETS = [
  { name: "Electric Pulse", style: "wave" as VisualizerStyle, color: "neon-blue" as VisualizerColor, adjustments: { particleSpeed: 8, colorHue: 200, patternComplexity: 4 } },
  { name: "Cyber Garden", style: "dots" as VisualizerStyle, color: "cyber-green" as VisualizerColor, adjustments: { particleSpeed: 3, colorHue: 150, patternComplexity: 2 } },
  { name: "Crimson Waves", style: "bars" as VisualizerStyle, color: "crimson" as VisualizerColor, adjustments: { particleSpeed: 6, colorHue: 0, patternComplexity: 5 } },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

const SIDE_QUESTS = [
  { id: 1, title: "Sipan Ply & Vineer", category: "Branding" },
  { id: 2, title: "Policybazaar Marks", category: "Identity" },
  { id: 3, title: "ImAvatar Card", category: "Print" },
  { id: 4, title: "Airistic Airlines", category: "Campaign" },
];

const MUSIC_IMAGES = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514525253344-90246ce24999?auto=format&fit=crop&q=80&w=800",
];

// New component for the falling cover art effect
function FallingAssets({ active }: { active: boolean }) {
  const [items, setItems] = useState<{ id: number; x: number; image: string; rotation: number; size: number; duration: number; delay: number; drift: number }[]>([]);

  useEffect(() => {
    if (!active) {
      setItems([]);
      return;
    }

    const interval = setInterval(() => {
      const newItem = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        image: TRACKS[Math.floor(Math.random() * TRACKS.length)].image,
        rotation: Math.random() * 360,
        size: 60 + Math.random() * 80,
        duration: 3 + Math.random() * 3, // 3s to 6s
        delay: Math.random() * 0.2,
        drift: (Math.random() - 0.5) * 15,
      };
      setItems(prev => [...prev.slice(-25), newItem]);
    }, 350);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: -200, x: `${item.x}vw`, opacity: 0, rotate: item.rotation, scale: 0.8 }}
            animate={{ 
              y: "110vh", 
              x: `${item.x + item.drift}vw`,
              opacity: [0, 1, 1, 0], 
              rotate: item.rotation + 720,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: item.duration, ease: "linear", delay: item.delay }}
            style={{ width: item.size, height: item.size }}
            className="absolute"
          >
            <div className="w-full h-full p-2">
              <img 
                src={item.image} 
                alt="cover" 
                className="w-full h-full object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 brightness-110" 
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// New component for the welcome message
function WelcomeMessage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    const hideTimer = setTimeout(() => setShow(false), 7000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] as any }}
          className="fixed bottom-40 left-1/2 -translate-x-1/2 z-[110] pointer-events-none"
        >
          <div className="glass-card px-10 py-5 rounded-full border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 ring-1 ring-white/5">
            <div className="relative">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute inset-0" />
              <div className="w-2 h-2 bg-red-600 rounded-full relative" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.5em] font-black text-white/90 whitespace-nowrap">
              Killhouse is here to help you
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const RevealText = ({ 
  text, 
  className, 
  delay = 0, 
  speed = 1,
  highlightIndices = [],
  highlightClassName = "text-red-600"
}: { 
  text: string; 
  className?: string; 
  delay?: number; 
  speed?: number;
  highlightIndices?: number[];
  highlightClassName?: string;
}) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 / speed, 
        delayChildren: delay 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -90,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", perspective: "1000px" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ display: "inline-block", originY: "bottom" }}
          key={index}
          className={`mr-[0.2em] ${highlightIndices.includes(index) ? highlightClassName : ""}`}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vizStyle, setVizStyle] = useState<VisualizerStyle>("bars");
  const [vizColor, setVizColor] = useState<VisualizerColor>("white");
  const [hoveredVizStyle, setHoveredVizStyle] = useState<VisualizerStyle | null>(null);
  const [hoveredVizColor, setHoveredVizColor] = useState<VisualizerColor | null>(null);
  const [aiVisuals, setAiVisuals] = useState<VisualAdjustments>({ particleSpeed: 1, colorHue: 0, patternComplexity: 4 });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isOnFire, setIsOnFire] = useState(false);
  const [isDestructing, setIsDestructing] = useState(false);
  const [isFireOnCooldown, setIsFireOnCooldown] = useState(false);
  const [fireIntensity, setFireIntensity] = useState(5);
  const [scrolled, setScrolled] = useState(false);
  const fireAudioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(async () => {
      setIsAiLoading(true);
      // Simulate features based on playback
      const adjustments = await getVisualAdjustments("energetic", 7);
      setAiVisuals(adjustments);
      setIsAiLoading(false);
    }, 60000); // Check every minute instead of every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -250]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.1]);

  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    fireAudioRef.current = new Audio('https://legitimate-scarlet-3abu2xkowr.edgeone.dev/makabhosda_aag.mp3');
  }, []);

  useEffect(() => {
    if (fireAudioRef.current) {
        if (isOnFire) {
          fireAudioRef.current.play();
        } else {
          fireAudioRef.current.pause();
          fireAudioRef.current.currentTime = 0;
        }
    }
    
    if (isOnFire) {
      const timer = setTimeout(() => {
        handleFireToggle();
      }, 7000); // Auto-deactivate after 7 seconds
      return () => clearTimeout(timer);
    }
  }, [isOnFire]);

  const handleFireToggle = () => {
    soundService.play(isOnFire ? 'TOGGLE_OFF' : 'TOGGLE_ON', 0.4);
    if (isOnFire) {
      setIsOnFire(false);
      setIsDestructing(false);
      setIsFireOnCooldown(true);
      setTimeout(() => {
        setIsFireOnCooldown(false);
      }, 3000); // 3 second cooldown after deactivation
    } else if (!isFireOnCooldown) {
      setIsOnFire(true);
      setIsDestructing(true);
    }
  };

  useEffect(() => {
    if (isOnFire && fireIntensity >= 8) {
      // Keep it on if intensity is high
      setIsDestructing(true);
    }
  }, [fireIntensity, isOnFire]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      if (fireAudioRef.current && isOnFire) {
        // Muffle fire audio too if scrolling deep
        fireAudioRef.current.volume = latest > 0.1 ? Math.max(0.1, 1 - (latest * 2)) : 1;
      }
    });
    return () => unsub();
  }, [scrollYProgress, isOnFire]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-[#d1d1d1] font-sans overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-[1000]"
        style={{ scaleX: scrollYProgress }}
      />
      <WelcomeMessage />
      <CustomCursor />
      <FireEffect active={isOnFire} intensity={fireIntensity} />
      <DestructionEffect active={isDestructing} intensity={fireIntensity} />
      <FallingAssets active={isOnFire} />
      <AmbientBackground isPlaying={isPlaying} />
      <AmbientParticles isPlaying={isPlaying} />
      <HeartbeatWaves />
      <SmoothScroll />
      <div className="noise-bg fixed inset-0 z-50 pointer-events-none opacity-[0.02]" />
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl flex flex-col justify-center items-center p-6"
          >
            <button 
              onClick={() => {
                soundService.play('CLICK', 0.2);
                setIsMenuOpen(false);
              }}
              className="absolute top-8 right-8 text-white flex items-center gap-2 uppercase tracking-[0.3em] font-bold text-[10px] opacity-60 hover:opacity-100 transition-opacity"
            >
              Close <X size={20} />
            </button>
            
            <div className="flex flex-col gap-8 text-center">
              {['Home', 'Work', 'Sounds', 'Contact'].map((item, i) => (
                <motion.a 
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  onMouseEnter={() => soundService.play('HOVER', 0.15)}
                  onClick={() => {
                    soundService.play('CLICK', 0.2);
                    setIsMenuOpen(false);
                  }}
                  className="text-6xl sm:text-8xl font-display font-light hover:text-white transition-colors tracking-tighter"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transition-timing-[cubic-bezier(0.23,1,0.32,1)] ${
        scrolled ? "py-4 px-8 bg-black/40 backdrop-blur-3xl border-b border-white/5" : "py-10 px-8"
      } flex items-center`}>
        <div className="flex-1 flex justify-start">
          <motion.a 
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ letterSpacing: "0.2em" }}
            onMouseEnter={() => soundService.play('HOVER', 0.1)}
            onClick={() => soundService.play('CLICK', 0.2)}
            className="text-lg font-sans font-black uppercase text-red-600 tracking-tighter transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          >
            KILLHOUSE MUSIC
          </motion.a>
        </div>

        <div className="flex-1 flex justify-center items-center gap-4">
          {isOnFire && (
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={fireIntensity} 
              onInput={() => soundService.play('SLIDE', 0.05)}
              onChange={(e) => setFireIntensity(Number(e.target.value))} 
              className="w-20 h-1 bg-white/20 accent-orange-500 rounded-lg appearance-none cursor-pointer"
              title="Spark Intensity"
            />
          )}
          <motion.button
            whileHover={!isFireOnCooldown ? { scale: 1.1, color: "#ff4400" } : {}}
            whileTap={!isFireOnCooldown ? { scale: 0.9 } : {}}
            disabled={isFireOnCooldown}
            onClick={handleFireToggle}
            className={`text-[9px] font-black uppercase tracking-[0.5em] transition-all duration-300 px-6 py-2 rounded-full border backdrop-blur-sm ${
              isOnFire 
                ? "text-orange-500 border-orange-500/50 bg-white/5 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(255,68,0,0.3)] animate-pulse" 
                : isFireOnCooldown
                ? "text-white/20 border-white/5 bg-white/5 cursor-not-allowed"
                : "text-white/40 border-white/5 hover:border-white/20 bg-white/5 hover:text-white/80"
            }`}
          >
            {isOnFire ? "[ DETONATING ]" : isFireOnCooldown ? "[ COOLING ]" : "[ LPF / FIRE ]"}
          </motion.button>
        </div>
        
        <div className="flex-1 flex justify-end gap-12 items-center">
          <div className="hidden lg:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60">
            <a href="#work" 
               onMouseEnter={() => soundService.play('HOVER', 0.1)}
               onClick={() => soundService.play('CLICK', 0.2)}
               className="hover:opacity-100 transition-opacity">Work</a>
            <a href="#sounds" 
               onMouseEnter={() => soundService.play('HOVER', 0.1)}
               onClick={() => soundService.play('CLICK', 0.2)}
               className="hover:opacity-100 transition-opacity">Sounds</a>
            <a href="#contact" 
               onMouseEnter={() => soundService.play('HOVER', 0.1)}
               onClick={() => soundService.play('CLICK', 0.2)}
               className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => soundService.play('HOVER', 0.1)}
            onClick={() => {
              soundService.play('CLICK', 0.2);
              setIsMenuOpen(!isMenuOpen);
            }}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity"
          >
            <Menu size={18} />
            <span>Menu</span>
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        id="home"
        style={{ y: heroY, opacity: heroOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5 }}
        className="relative h-screen flex flex-col justify-center items-center px-8 z-10"
      >
        <div className="w-full max-w-screen-2xl text-center">
          <div className="mb-12">
            <RevealText 
              text="KILLHOUSE / 2026 / Audio-Visual" 
              className="text-white font-display text-[11px] uppercase tracking-[0.5em] opacity-60 flex justify-center w-full"
            />
          </div>
          
          <div className="mb-16">
            <RevealText 
              text="Killhouse Music" 
              className="text-4xl sm:text-[120px] lg:text-[160px] font-sans font-black leading-none tracking-tighter uppercase text-white"
              delay={0.2}
              speed={0.5}
              highlightIndices={[0]}
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
            className="max-w-sm mx-auto"
          >
            <p className="text-sm leading-relaxed opacity-60">
              Developer and Art Director focused on clean interfaces, modular code, and the intersection of music and technology.
            </p>
          </motion.div>
        </div>

        <motion.a 
          href="#work"
          animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-16 right-16 flex items-center gap-4 rotate-90 origin-right transition-all hover:opacity-100 group"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors">Scroll to explore</span>
          <div className="w-12 h-[1px] bg-white/30 group-hover:bg-white transition-colors" />
        </motion.a>
      </motion.section>

      {/* Featured Work */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        id="work" 
        className="py-48 px-4 sm:px-8 lg:px-12 relative z-10"
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-24 px-4">
            <RevealText 
              text="01 / Archives" 
              className="text-white text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-40 text-left justify-start"
            />
            <RevealText 
              text="SELECTED WORK" 
              className="text-5xl sm:text-7xl font-display font-light tracking-tighter text-white text-left justify-start"
              delay={0.1}
            />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {PROJECTS.map((project, i) => (
              <motion.div 
                key={project.id}
                variants={itemVariants}
                className="group relative cursor-pointer"
                onMouseEnter={() => soundService.play('HOVER', 0.05)}
                onClick={() => {
                  soundService.play('CLICK', 0.2);
                  const trackIndex = i % TRACKS.length;
                  if (currentTrackIndex === trackIndex) {
                    setIsPlaying(!isPlaying);
                  } else {
                    setCurrentTrackIndex(trackIndex);
                    setIsPlaying(true);
                  }
                }}
              >
                <div className={`glass-card p-4 rounded-xl h-full transition-all duration-500 hover:bg-white/[0.05] border shadow-2xl ${
                  currentTrackIndex === (i % TRACKS.length) && isPlaying 
                    ? "border-red-600/50 bg-red-600/[0.02]" 
                    : "border-white/5 hover:border-white/20"
                }`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-6 ring-1 ring-white/5">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] as any }}
                      src={project.image} 
                      alt={project.title}
                      className={`w-full h-full object-cover transition-all duration-1000 ${
                        currentTrackIndex === (i % TRACKS.length) && isPlaying 
                          ? "grayscale-0 opacity-100 scale-105" 
                          : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                      }`}
                    />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-500 ${
                      currentTrackIndex === (i % TRACKS.length) && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                        {currentTrackIndex === (i % TRACKS.length) && isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <Tooltip text={project.description}>
                      <h3 className="text-sm font-display font-medium text-white tracking-tight">{project.title}</h3>
                    </Tooltip>
                    <p className="text-[10px] opacity-30 uppercase tracking-[0.15em] font-semibold">{project.category} • {project.year}</p>
                    <div className="pt-4 flex justify-between items-center">
                      <div className="text-[9px] uppercase tracking-widest font-bold text-red-600/60">
                        {currentTrackIndex === (i % TRACKS.length) && isPlaying ? "NOW PLAYING" : ""}
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/30 text-white transition-all">
                        <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Music Section (Immersive) */}
      <motion.section 
        initial={{ borderTopColor: "rgba(255,255,255,0)" }}
        whileInView={{ borderTopColor: "rgba(255,255,255,0.05)" }}
        viewport={{ once: true }}
        id="sounds" 
        className="relative py-64 px-8 sm:px-16 lg:px-32 overflow-hidden border-t"
      >
        <div className="absolute inset-0 z-0 opacity-10 flex justify-around items-center blur-[120px] pointer-events-none">
          <div className="w-[800px] h-[800px] bg-zinc-800 rounded-full animate-pulse" />
          <div className="w-[600px] h-[600px] bg-zinc-900 rounded-full animate-pulse delay-1000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] as any }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="mb-20 text-center">
            <RevealText 
              text="02 / Auditory" 
              className="text-white text-[10px] uppercase tracking-[0.4em] font-bold mb-6 opacity-40 flex justify-center"
            />
            <RevealText 
              text="Industrial Rhythm" 
              className="text-6xl sm:text-8xl font-display font-light tracking-tighter text-white mb-8 uppercase flex justify-center"
              delay={0.1}
            />
          </div>
          <div className="flex flex-col items-center gap-6 mb-12 relative">
              <Visualizer isPlaying={isPlaying} style={hoveredVizStyle || vizStyle} color={hoveredVizColor || vizColor} scrollProgress={scrollYProgress} {...aiVisuals} />
              
              <AnimatePresence>
                {isAiLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20"
                  >
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-[8px] uppercase tracking-[0.5em] text-white/40 font-bold">Optimizing Visuals</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-30 font-bold">Presets</span>
                  <div className="flex gap-2">
                    {PRESETS.map((p) => (
                      <Tooltip key={p.name} text={p.name}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setVizStyle(p.style);
                            setVizColor(p.color);
                            setAiVisuals(p.adjustments);
                          }}
                          className={`px-4 py-2 text-[10px] uppercase tracking-widest rounded-full border transition-all ${
                            vizStyle === p.style && vizColor === p.color
                              ? "bg-white text-black border-white"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          {p.name}
                        </motion.button>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-30 font-bold">Animation Style</span>
                  <div className="flex gap-2">
                    {(['bars', 'dots', 'wave'] as VisualizerStyle[]).map((s) => (
                      <Tooltip key={s} text={`Style: ${s}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setVizStyle(s)}
                          onMouseEnter={() => setHoveredVizStyle(s)}
                          onMouseLeave={() => setHoveredVizStyle(null)}
                          className={`px-4 py-2 text-[10px] uppercase tracking-widest rounded-full border transition-all ${
                            vizStyle === s 
                              ? "bg-white text-black border-white" 
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          {s}
                        </motion.button>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-30 font-bold">Color Theme</span>
                  <div className="flex gap-2">
                    {(['white', 'neon-blue', 'electric-purple', 'cyber-green', 'crimson', 'gold'] as VisualizerColor[]).map((c) => (
                      <Tooltip key={c} text={`Theme: ${c}`}>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setVizColor(c)}
                          onMouseEnter={() => setHoveredVizColor(c)}
                          onMouseLeave={() => setHoveredVizColor(null)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            vizColor === c ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent opacity-40 hover:opacity-100"
                          } ${
                            c === 'white' ? 'bg-white' : 
                            c === 'neon-blue' ? 'bg-blue-400' : 
                            c === 'electric-purple' ? 'bg-purple-500' : 
                            c === 'cyber-green' ? 'bg-emerald-400' :
                            c === 'crimson' ? 'bg-red-500' :
                            'bg-amber-400'
                          }`}
                          title={c}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold opacity-40">The engine behind the sound</p>


          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {TRACKS.map((track, i) => (
              <Tooltip key={track.id} text={`Play ${track.title} by ${track.artist}`}>
                <motion.div 
                  onClick={() => {
                    if (currentTrackIndex === i) {
                      setIsPlaying(!isPlaying);
                    } else {
                      setCurrentTrackIndex(i);
                      setIsPlaying(true);
                    }
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                  }}
                  className={`glass-card p-4 rounded-2xl group cursor-pointer transition-all duration-300 opacity-100 ${
                    currentTrackIndex === i ? "ring-2 ring-white/40 bg-white/5" : ""
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-6 ring-1 ring-white/10 relative">
                    <img 
                      src={track.image} 
                      alt={track.title} 
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        currentTrackIndex === i ? "grayscale-0 scale-110 opacity-100" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                      }`} 
                    />
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity bg-black/40 ${
                      currentTrackIndex === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {currentTrackIndex === i && isPlaying ? (
                        <Pause size={24} fill="white" className="text-white" />
                      ) : (
                        <Play size={24} fill="white" className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="track-title text-[13px] font-semibold mb-1 text-white opacity-80 group-hover:text-white transition-colors">{track.title}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-60 transition-opacity">{track.artist}</div>
                </motion.div>
              </Tooltip>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <HeavyArchiveCarousel />

      {/* Footer */}
      <footer id="contact" className="py-32 px-8 sm:px-16 lg:px-32 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] as any }}
          >
            <div className="mb-12">
              <RevealText 
                text="Let's create something extraordinary." 
                className="text-5xl sm:text-7xl font-display font-light text-white leading-tight tracking-tighter justify-start text-left"
                delay={0.2}
              />
            </div>
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:contact@killhouse.music" 
                className="px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-300 transition-colors rounded-full block border border-white"
              >
                Enter the House
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] as any }}
            className="grid grid-cols-2 gap-16"
          >
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-10 opacity-30">Network</h4>
              <div className="flex flex-col gap-6 text-[11px] uppercase tracking-[0.15em] font-medium">
                {['Instagram', 'LinkedIn', 'Twitter', 'Spotify'].map((network, i) => (
                  <motion.a 
                    key={network}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    href="#" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="opacity-60 hover:opacity-100 hover:text-white transition-all w-fit"
                  >
                    {network}
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-10 opacity-30">Location</h4>
              <p className="text-[11px] uppercase tracking-[0.15em] leading-loose opacity-60">Mumbai, India<br />Open for WorldWIDE<br />Remote collaboration.</p>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-16 border-t border-white/5">
          <p className="text-[9px] uppercase tracking-[0.4em] opacity-30">© 2024 KILLHOUSE MUSIC — All Creative Rights Reserved</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <MiniPlayer 
              currentTrackIndex={currentTrackIndex} 
              isPlaying={isPlaying} 
              onTrackChange={setCurrentTrackIndex} 
              onTogglePlay={setIsPlaying} 
            />
            
            <div className="flex items-center gap-4 px-6 py-2 glass-card rounded-full h-fit">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-60">Status: Available for projects</span>
            </div>
          </div>
        </div>
      </footer>
      <MusicPlayer 
        currentTrackIndex={currentTrackIndex} 
        isPlaying={isPlaying} 
        onTrackChange={setCurrentTrackIndex} 
        onTogglePlay={setIsPlaying} 
        scrollProgress={scrollYProgress}
      />
    </div>
  );
}
