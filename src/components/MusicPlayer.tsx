import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import Tooltip from "./Tooltip";
import { soundService } from "../services/soundService";

export const TRACKS = [
  { id: 1, title: "Lost Within", artist: "KILLHOUSE", album: "The Void", year: 2026, description: "A deep dive into industrial soundscapes and melancholic digital textures.", url: "https://universal-crimson-uvgprdwmzi.edgeone.dev/LOST%20WITHIN%20-%20KILLHOUSE%20MUSIC.mp3", image: "https://detailed-yellow-vfmcmbhdnq.edgeone.dev/Killhouse%20-%20Lost%20Within%20(1).png" },
  { id: 2, title: "Kasoor", artist: "KILLHOUSE", album: "Sin & Redemption", year: 2025, description: "Raw emotional honesty mixed with heavy synth elements.", url: "https://eligible-coffee-8qv8qjkjzb.edgeone.dev/kasoor%20killhouse%20music.mp3", image: "/assets/images/regenerated_image_1777992676397.png" },
  { id: 3, title: "Chakravyuh", artist: "KILLHOUSE", album: "The Labyrinth", year: 2026, description: "Complex rhythmic patterns building to an intense climax.", url: "https://golden-maroon-gst9h0fitx.edgeone.dev/chakravyuha%20killhouse%20music.mp3", image: "/assets/images/regenerated_image_1778004316605.png" },
  { id: 4, title: "Astitva", artist: "KILLHOUSE", album: "Existence", year: 2025, description: "Pulsing drill-infused beats capturing existential reflection.", url: "https://growing-cyan-7wof7ooqa1.edgeone.dev/chaos%20astitva%20drillbeat%20.mp3", image: "/assets/images/regenerated_image_1778004441183.png" },
];

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
  onTogglePlay: (val: boolean) => void;
  scrollProgress?: any; // MotionValue<number>
}

export default function MusicPlayer({ currentTrackIndex, isPlaying, onTrackChange, onTogglePlay, scrollProgress }: MusicPlayerProps) {
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuffled, setIsMuffled] = useState(false);
  const [isBufferLoading, setIsBufferLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const [useWebAudio, setUseWebAudio] = useState(true);

  useEffect(() => {
    if (audioRef.current && !activeAudioRef.current) {
        activeAudioRef.current = audioRef.current;
    }
  }, []);
  const initAudio = () => {
    if (!useWebAudio || audioContextRef.current || !audioRef.current || !audio2Ref.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const source1 = ctx.createMediaElementSource(audioRef.current!);
      const source2 = ctx.createMediaElementSource(audio2Ref.current!);
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(20000, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      source1.connect(filter);
      source2.connect(filter);
      filter.connect(ctx.destination);

      audioContextRef.current = ctx;
      filterRef.current = filter;
      
      // console.log("Audio Context & Filter Initialized for both audio elements");
    } catch (err) {
      // console.error("Failed to initialize Web Audio:", err);
      setUseWebAudio(false);
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (useWebAudio) {
        initAudio();
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [useWebAudio]);

  // Handle track buffering/loading states
  useEffect(() => {
    const audio1 = audioRef.current;
    const audio2 = audio2Ref.current;
    
    const handleWaiting = () => setIsBufferLoading(true);
    const handleCanPlay = () => setIsBufferLoading(false);
    
    audio1?.addEventListener('waiting', handleWaiting);
    audio1?.addEventListener('canplay', handleCanPlay);
    audio1?.addEventListener('loadstart', handleWaiting);
    audio2?.addEventListener('waiting', handleWaiting);
    audio2?.addEventListener('canplay', handleCanPlay);
    audio2?.addEventListener('loadstart', handleWaiting);
    
    return () => {
      audio1?.removeEventListener('waiting', handleWaiting);
      audio1?.removeEventListener('canplay', handleCanPlay);
      audio1?.removeEventListener('loadstart', handleWaiting);
      audio2?.removeEventListener('waiting', handleWaiting);
      audio2?.removeEventListener('canplay', handleCanPlay);
      audio2?.removeEventListener('loadstart', handleWaiting);
    };
  }, []);

  // Handle CORS errors and fallback for both elements
  useEffect(() => {
    const handleError = (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      if (audio.crossOrigin === "anonymous") {
        console.warn("CORS/Media error detected. Disabling Web Audio (LPF) for this session to ensure playback.");
        setUseWebAudio(false);
        // Clean up both elements
        if (audioRef.current) {
          audioRef.current.removeAttribute("crossOrigin");
          audioRef.current.load();
        }
        if (audio2Ref.current) {
          audio2Ref.current.removeAttribute("crossOrigin");
          audio2Ref.current.load();
        }
        if (isPlaying && activeAudioRef.current) {
          activeAudioRef.current.play().catch(console.error);
        }
      } else {
        console.error("Audio Load Error:", e);
      }
    };

    const a1 = audioRef.current;
    const a2 = audio2Ref.current;

    a1?.addEventListener("error", handleError);
    a2?.addEventListener("error", handleError);
    return () => {
      a1?.removeEventListener("error", handleError);
      a2?.removeEventListener("error", handleError);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!scrollProgress) return;
    
    const unsub = scrollProgress.on("change", (latest: number) => {
      // Volume mapping (existing logic)
      const targetVol = latest > 0.1 ? Math.max(0.05, 0.5 - (latest * 0.8)) : 0.5;
      if (activeAudioRef.current) {
        activeAudioRef.current.volume = targetVol * volume * 2;
      }
      
      // LPF Frequency mapping aligned with user snippet (20000Hz down to 500Hz)
      if (filterRef.current && audioContextRef.current) {
        const minFreq = 500;
        const maxFreq = 20000;
        const frequency = maxFreq - (latest * (maxFreq - minFreq));
        
        filterRef.current.frequency.setTargetAtTime(
          Math.max(minFreq, frequency), 
          audioContextRef.current.currentTime, 
          0.03 // faster response for accurate scroll tracking
        );
      }

      setIsMuffled(latest > 0.1);
    });
    return () => unsub();
  }, [scrollProgress, volume]);

  useEffect(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.volume = volume;
    }
  }, [volume]);

  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prevAudio = activeAudioRef.current;
    const nextAudio = activeAudioRef.current === audioRef.current ? audio2Ref.current : audioRef.current;
    if (!nextAudio) return;

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    if (useWebAudio) {
      nextAudio.crossOrigin = "anonymous";
    } else {
      nextAudio.removeAttribute("crossOrigin");
    }
    
    nextAudio.src = currentTrack.url;
    nextAudio.load();
    activeAudioRef.current = nextAudio;

    if (isPlaying) {
      nextAudio.volume = 0;
      nextAudio.play().then(() => {
        const fadeDuration = 1000;
        const steps = 20;
        const startVolPrev = prevAudio ? prevAudio.volume : volume;
        
        const fadeStep = (step: number) => {
          if (step > steps) {
            if (prevAudio && prevAudio !== nextAudio) {
              prevAudio.pause();
              prevAudio.volume = 0;
            }
            return;
          }
          const progress = step / steps;
          nextAudio.volume = progress * volume;
          if (prevAudio && prevAudio !== nextAudio) {
            prevAudio.volume = Math.max(0, startVolPrev * (1 - progress));
          }
          fadeTimeoutRef.current = setTimeout(() => fadeStep(step + 1), fadeDuration / steps);
        };
        fadeStep(1);
      }).catch((err) => {
        if (err.name !== "NotAllowedError") {
          console.error("Playback load failure:", err);
          onTogglePlay(false);
        }
      });
    } else {
      nextAudio.volume = volume;
    }
  }, [currentTrackIndex, useWebAudio]);

  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      activeAudioRef.current?.play().catch((err) => {
        if (err.name !== "NotAllowedError") {
          console.error("Playback toggle failure:", err);
          onTogglePlay(false);
        }
      });
    } else {
      activeAudioRef.current?.pause();
    }
  }, [isPlaying, onTogglePlay]);

  const togglePlay = () => {
    initAudio();
    soundService.play(isPlaying ? 'TOGGLE_OFF' : 'TOGGLE_ON', 0.3);
    onTogglePlay(!isPlaying);
  };

  const nextTrack = () => {
    soundService.play('CLICK', 0.2);
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    soundService.play('CLICK', 0.2);
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (activeAudioRef.current) {
      setCurrentTime(activeAudioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (activeAudioRef.current) {
      setDuration(activeAudioRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (activeAudioRef.current) {
      activeAudioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ 
        y: 0,
        filter: isMuffled ? "blur(2px) grayscale(0.5)" : "blur(0px) grayscale(0)"
      }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-3xl"
    >
      <div className={`glass-card p-4 rounded-3xl flex flex-col gap-2 ring-1 ring-white/10 shadow-2xl transition-all duration-700 ${
        isPlaying ? "shadow-[0_0_40px_rgba(255,255,255,0.08)]" : ""
      } ${isMuffled ? "opacity-60" : "opacity-100"} relative overflow-hidden group`}>
        {/* Iridescent Border Overlay */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/5 opacity-50" />
        <div className={`absolute inset-[-1px] rounded-3xl pointer-events-none opacity-[0.15] transition-opacity duration-1000 ${isPlaying ? "opacity-[0.35] animate-iridescent" : ""}`} 
             style={{ 
               background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 25%, transparent 50%, rgba(150,150,255,0.2) 75%, transparent 100%)',
               maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
               maskComposite: 'exclude',
               WebkitMaskComposite: 'destination-out',
               padding: '1px'
             }} 
        />

        {/* Pulsing Playback Glow */}
        {isPlaying && (
          <motion.div 
            animate={{ 
              opacity: [0.02, 0.05, 0.02],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-white/5 pointer-events-none rounded-3xl"
          />
        )}

        <div className="flex items-center justify-between gap-6 relative z-10">
          <audio 
            ref={audioRef} 
            onEnded={nextTrack}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          <audio 
            ref={audio2Ref} 
            onEnded={nextTrack}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          
          {/* Track Info */}
          <div className="flex items-center gap-4 min-w-[150px]">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/40 relative flex items-center justify-center">
              <AnimatePresence>
                {isBufferLoading && (
                  <motion.div 
                    key="buffer-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <div className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
                  </motion.div>
                )}
                {isPlaying && (
                  <motion.div
                    key="playing-glint"
                    initial={{ opacity: 0, x: "-150%" }}
                    animate={{ 
                      opacity: [0, 0.4, 0],
                      x: ["-150%", "150%"]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 2
                    }}
                    className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>
              <motion.img 
                key={currentTrack.image}
                initial={{ scale: 1.5, opacity: 0, rotate: -10 }}
                animate={{ 
                  scale: isPlaying ? [1.05, 1.12, 1.05] : [1, 1.04, 1], 
                  opacity: 1,
                  rotate: isPlaying ? 360 : 0,
                  filter: isPlaying 
                    ? "grayscale(0%) brightness(1.1)" 
                    : "grayscale(40%) brightness(0.7) drop-shadow(0 0 12px rgba(255,255,255,0.15))",
                }}
                transition={{ 
                    scale: { 
                      duration: isPlaying ? 3 : 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    },
                    rotate: isPlaying 
                      ? { duration: 12, repeat: Infinity, ease: "linear" } 
                      : { duration: 0.8, ease: "easeOut" },
                    opacity: { duration: 0.6 },
                    filter: { 
                      duration: isPlaying ? 1 : 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                src={currentTrack.image} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="hidden sm:block">
              <Tooltip text={currentTrack.description}>
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTrack.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-wider line-clamp-1">{currentTrack.title}</h4>
                      <p className="text-[9px] opacity-40 uppercase tracking-widest">{currentTrack.artist} • {currentTrack.album} ({currentTrack.year})</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Tooltip text="Previous">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onMouseEnter={() => soundService.play('HOVER', 0.1)}
                onClick={prevTrack} 
                className="p-2 opacity-40 hover:opacity-100 transition-opacity"
              >
                <SkipBack size={18} />
              </motion.button>
            </Tooltip>
            <Tooltip text={isPlaying ? "Pause" : "Play"}>
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => soundService.play('HOVER', 0.15)}
                onClick={togglePlay}
                className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
              >
                {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
              </motion.button>
            </Tooltip>
            <Tooltip text="Next">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onMouseEnter={() => soundService.play('HOVER', 0.1)}
                onClick={nextTrack} 
                className="p-2 opacity-40 hover:opacity-100 transition-opacity"
              >
                <SkipForward size={18} />
              </motion.button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-6">
            {/* Volume */}
            <div className="hidden md:flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
              <Tooltip text="Volume">
                <div className="flex items-center gap-3">
                  <Volume2 size={16} />
                  <motion.input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onInput={() => soundService.play('SLIDE', 0.05)}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </Tooltip>
            </div>

            {/* Status Icon */}
            <div className="hidden lg:flex items-center justify-center w-10 h-10 border border-white/10 rounded-full">
              <MusicIcon size={14} className={isPlaying ? "animate-spin-slow text-white" : "opacity-20"} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-2 flex items-center gap-3">
          <span className="text-[9px] font-mono opacity-40 w-8">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 0} 
            step="0.1"
            value={currentTime}
            onInput={() => soundService.play('SLIDE', 0.03)}
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-[9px] font-mono opacity-40 w-8 text-right">{formatTime(duration)}</span>
        </div>
      </div>
    </motion.div>
  );
}
