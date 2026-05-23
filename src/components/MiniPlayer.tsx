import { MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { TRACKS } from "./MusicPlayer";
import Tooltip from "./Tooltip";
import { getCoverArt } from "../images";

interface MiniPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
  onTogglePlay: (val: boolean) => void;
}

export default function MiniPlayer({ 
  currentTrackIndex, 
  isPlaying, 
  onTrackChange, 
  onTogglePlay 
}: MiniPlayerProps) {
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    onTogglePlay(!isPlaying);
  };

  const nextTrack = (e: MouseEvent) => {
    e.stopPropagation();
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const prevTrack = (e: MouseEvent) => {
    e.stopPropagation();
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="flex items-center gap-6 px-6 py-3 glass-card rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-xl">
      <div className="flex items-center gap-3 min-w-[120px]">
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 ring-1 ring-white/10 shrink-0">
          <motion.img 
            key={currentTrack.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={getCoverArt(currentTrack.image)}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.h4
              key={currentTrack.title}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              className="text-[10px] font-bold text-white uppercase tracking-wider line-clamp-1"
            >
              {currentTrack.title}
            </motion.h4>
          </AnimatePresence>
          <span className="text-[8px] opacity-40 uppercase tracking-widest truncate max-w-[80px]">
            {currentTrack.artist}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 border-l border-white/10 pl-6">
        <Tooltip text="Previous">
          <button 
            onClick={prevTrack}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipBack size={14} />
          </button>
        </Tooltip>
        
        <button 
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>

        <Tooltip text="Next">
          <button 
            onClick={nextTrack}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward size={14} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
