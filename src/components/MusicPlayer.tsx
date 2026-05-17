import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import Tooltip from "./Tooltip";

export const TRACKS = [
  { id: 1, title: "Chakravyuh", artist: "KILLHOUSE", album: "CHAOS: CH 1", description: "Minimalist trap beats combined with heavy soundscapes.", url: "https://golden-maroon-gst9h0fitx.edgeone.dev/chakravyuha%20killhouse%20music.mp3", image: "https://concrete-copper-aqe9zmq49p.edgeone.dev/Chapter%201.png" },
  { id: 2, title: "ASTITVA", artist: "KILLHOUSE", album: "CHAOS: CH 2", description: "Pulsing drill-infused beats capturing existential reflection.", url: "https://growing-cyan-7wof7ooqa1.edgeone.dev/chaos%20astitva%20drillbeat%20.mp3", image: "https://sore-lavender-i0dgwjj1le.edgeone.dev/Chapter%202.png" },
  { id: 3, title: "Aghata", artist: "KILLHOUSE", album: "CHAOS: CH 3", description: "Intense industrial rhythms and complex textures.", url: "https://essential-ivory-3oxa3lgucg.edgeone.dev/chaos%20Aghata%202.mp3", image: "https://excited-chocolate-bkoyi0fko5.edgeone.dev/Chapter%203%20(1).png" },
  { id: 4, title: "Pran", artist: "KILLHOUSE", album: "CHAOS: CH 4", description: "Atmospheric textures meet hard-hitting percussion.", url: "https://liberal-ivory-59op6iuksv.edgeone.dev/Pran%20drill%20.mp3", image: "https://sick-emerald-tbxbsseams.edgeone.dev/Chapter%204%20(1).png" },
  { id: 5, title: "Karm", artist: "KILLHOUSE", album: "CHAOS: CH 5", description: "The final descent into architectural acoustic decay.", url: "https://written-rose-9dp2lmb3yz.edgeone.dev/karm%20anitmah%20adhyayah%20.mp3", image: "https://systematic-blue-kf0j1b4fce.edgeone.dev/Chapter%205%20(1).png" },
  { id: 6, title: "Aarzoo", artist: "KILLHOUSE", album: "KILLHOUSE MUSIC", description: "Emotional depth meets rhythmic precision in this latest soundscape.", url: "https://definite-olive-aqzvmzrjrs.edgeone.dev/Aarzoo%20mp3.mp3", image: "https://tart-plum-cvaigpma8j.edgeone.dev/AARZOO%20(1)%20(1).png" },
  { id: 7, title: "Kasoor", artist: "KILLHOUSE", album: "Sin & Redemption", description: "Raw emotional honesty mixed with heavy synth elements.", url: "https://eligible-coffee-8qv8qjkjzb.edgeone.dev/kasoor%20killhouse%20music.mp3", image: "https://elated-bronze-x8zkclgmjj.edgeone.dev/Killhouse%20-%20Kasoor.png" },
  { id: 8, title: "Lost Within", artist: "KILLHOUSE", album: "KILLHOUSE MUSIC", description: "Immersive soundscapes reflecting cinematic exploration.", url: "https://universal-crimson-uvgprdwmzi.edgeone.dev/LOST%20WITHIN%20-%20KILLHOUSE%20MUSIC.mp3", image: "https://detailed-yellow-vfmcmbhdnq.edgeone.dev/Killhouse%20-%20Lost%20Within%20(1).png" },
  { id: 9, title: "Noor", artist: "KILLHOUSE", album: "KILLHOUSE MUSIC", description: "Atmospheric soundscapes blending traditional elements with modern electronic textures.", url: "https://marginal-aquamarine-eca0p8ichj.edgeone.dev/Noor%20killhouse%20music%20mp3%20for%20spotify.mp3", image: "https://civilian-coffee-1avghlfesy.edgeone.dev/WhatsApp%20Image%202026-05-16%20at%2012.03.18%20PM.jpeg" },
  { id: 10, title: "Pal Pal x Haseen x Ishq", artist: "KILLHOUSE", album: "KILLHOUSE MUSIC", description: "Deep dive into cinematic sound design and industrial precision.", url: "https://religious-bronze-wyb95ktqmg.edgeone.dev/mashup%20-%203%20db.mp3", image: "https://reasonable-turquoise-byemxoiogy.edgeone.dev/ChatGPT%20Image%20May%2016,%202026,%2006_51_53%20PM.png" },
];

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
  onTogglePlay: (val: boolean) => void;
  scrollProgress?: any; // MotionValue<number>
  isHeroMode?: boolean;
}

export default function MusicPlayer({ currentTrackIndex, isPlaying, onTrackChange, onTogglePlay, scrollProgress, isHeroMode }: MusicPlayerProps) {
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuffled, setIsMuffled] = useState(false);
  const [isBufferLoading, setIsBufferLoading] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
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
        activeAudioRef.current.volume = Math.min(1, targetVol * volume * 2);
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
    
    // Reset state for new track
    setCurrentTime(0);
    setDuration(0);
    setIsBufferLoading(true);

    nextAudio.src = currentTrack.url;
    nextAudio.load();
    activeAudioRef.current = nextAudio;

    if (isPlaying) {
      // Start fading out previous audio IMMEDIATELY to reduce delay feeling
      const startVolPrev = prevAudio ? prevAudio.volume : volume;
      const fadeOutSteps = 10;
      const fadeOutDuration = 300;
      
      const fadeOut = (step: number) => {
        if (prevAudio && prevAudio !== nextAudio && step <= fadeOutSteps) {
          prevAudio.volume = Math.max(0, startVolPrev * (1 - step / fadeOutSteps));
          setTimeout(() => fadeOut(step + 1), fadeOutDuration / fadeOutSteps);
        } else if (prevAudio && prevAudio !== nextAudio) {
          prevAudio.pause();
          prevAudio.volume = 0;
        }
      };
      fadeOut(1);

      nextAudio.volume = 0;
      nextAudio.play().then(() => {
        setIsBufferLoading(false);
        const fadeInDuration = 800;
        const fadeInSteps = 20;
        
        const fadeIn = (step: number) => {
          if (step <= fadeInSteps) {
            nextAudio.volume = (step / fadeInSteps) * volume;
            fadeTimeoutRef.current = setTimeout(() => fadeIn(step + 1), fadeInDuration / fadeInSteps);
          }
        };
        fadeIn(1);
      }).catch((err) => {
        if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
          console.error("Playback load failure:", err);
          onTogglePlay(false);
        }
        setIsBufferLoading(false);
      });
    } else {
      nextAudio.volume = volume;
      setIsBufferLoading(false);
    }
  }, [currentTrackIndex, useWebAudio]);

  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      activeAudioRef.current?.play().catch((err) => {
        if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
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
    onTogglePlay(!isPlaying);
  };

  const nextTrack = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    if (audio === activeAudioRef.current) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    if (audio === activeAudioRef.current) {
      setDuration(audio.duration);
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
      initial={isHeroMode ? { opacity: 0, y: 20 } : { y: 100 }}
      animate={{ 
        y: 0,
        opacity: 1,
        filter: isMuffled ? "blur(2px)" : "blur(0px)"
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={isHeroMode ? "w-full" : "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-2xl"}
    >
      <div className={`glass-card p-4 pb-5 rounded-2xl flex flex-col gap-3 ring-1 ring-white/10 shadow-2xl transition-all duration-700 ${
        isPlaying ? "shadow-[0_0_40px_rgba(255,255,255,0.08)]" : ""
      } ${isMuffled ? "opacity-60" : "opacity-100"} relative overflow-hidden group`}>
        {/* Iridescent Border Overlay */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/5 opacity-50" />
        <div className={`absolute inset-[-1px] rounded-2xl pointer-events-none opacity-[0.15] transition-opacity duration-1000 ${isPlaying ? "opacity-[0.35] animate-iridescent" : ""}`} 
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
            className="absolute inset-0 bg-white/5 pointer-events-none rounded-2xl"
          />
        )}

        <div className="flex items-center justify-between gap-4 relative z-10">
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
          <div className="flex items-center gap-3 min-w-[140px]">
            <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-white/10 bg-black/40 relative flex items-center justify-center group-hover:ring-white/30 transition-all">
              <AnimatePresence>
                {isBufferLoading && (
                  <motion.div 
                    key="buffer-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
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
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ 
                  scale: isPlaying ? [1, 1.08, 1] : 1, 
                  opacity: 1,
                  filter: isPlaying 
                    ? "brightness(1.15) contrast(1.1) drop-shadow(0 0 10px rgba(255,255,255,0.1))" 
                    : "brightness(0.7)",
                }}
                transition={{ 
                    scale: { 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    },
                    opacity: { duration: 0.6 },
                    filter: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }}
                src={currentTrack.image} 
                className="w-full h-full object-cover rounded-lg"
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
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider line-clamp-1">{currentTrack.title}</h4>
                      <p className="text-[8px] opacity-40 uppercase tracking-widest">{currentTrack.artist} • {currentTrack.album}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Tooltip text="Previous">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={prevTrack} 
                className="p-1.5 opacity-40 hover:opacity-100 transition-opacity"
              >
                <SkipBack size={16} />
              </motion.button>
            </Tooltip>
            <div className="relative">
              <Tooltip text={isPlaying ? "Pause" : "Play"}>
                <motion.button 
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all relative z-10"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </motion.button>
              </Tooltip>
            </div>
            <Tooltip text="Next">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={nextTrack} 
                className="p-1.5 opacity-40 hover:opacity-100 transition-opacity"
              >
                <SkipForward size={16} />
              </motion.button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Volume */}
            <div className="hidden md:flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
              <Tooltip text="Volume">
                <div className="flex items-center gap-2">
                  <Volume2 size={14} />
                  <motion.input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onInput={() => {}}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </Tooltip>
            </div>

            <Tooltip text="Track List">
              <button 
                onClick={() => {
                  setShowTrackList(!showTrackList);
                }}
                className={`p-2 border border-white/10 rounded-full transition-colors ${showTrackList ? "bg-white text-black" : "hover:bg-white/10 text-white/40 hover:text-white"}`}
              >
                <MusicIcon size={14} />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Enhanced Track List */}
        <AnimatePresence>
          {showTrackList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5 mt-2"
            >
              <div className="pt-4 flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
                {TRACKS.map((track, index) => (
                  <motion.button
                    key={track.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onTrackChange(index);
                    }}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all group/track ${
                      currentTrackIndex === index 
                        ? "bg-white/10 ring-1 ring-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <img 
                        src={track.image} 
                        alt={track.title} 
                        className={`w-full h-full object-cover rounded shadow-md transition-transform duration-500 group-hover/track:scale-110 ${
                          currentTrackIndex === index ? "brightness-110" : "brightness-50"
                        }`}
                      />
                      {currentTrackIndex === index && isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex gap-0.5 items-end h-2">
                             {[0, 1, 2].map(i => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: [4, 12, 4] }}
                                 transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                 className="w-0.5 bg-white rounded-full"
                               />
                             ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h5 className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        currentTrackIndex === index ? "text-white" : "text-white/40 group-hover/track:text-white/60"
                      }`}>
                        {track.title}
                      </h5>
                      <p className="text-[7px] uppercase tracking-widest opacity-20 font-medium">
                        {track.album}
                      </p>
                    </div>
                    <div className="text-[7px] font-mono opacity-10 tracking-tighter">
                      CH-0{track.id}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="px-1 flex items-center gap-2.5">
          <span className="text-[8px] font-mono opacity-40 w-7">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 0} 
            step="0.1"
            value={currentTime}
            onInput={() => {}}
            onChange={handleSeek}
            className="flex-1 h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-[8px] font-mono opacity-40 w-7 text-right">{formatTime(duration)}</span>
        </div>
      </div>
    </motion.div>
  );
}
