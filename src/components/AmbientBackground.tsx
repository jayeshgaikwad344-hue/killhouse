import { motion } from "motion/react";

export default function AmbientBackground({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={`liquid-mesh fixed inset-0 pointer-events-none z-0 transition-all duration-1000 ${isPlaying ? "opacity-20" : "opacity-10"}`}>
      <div className={`blob blob-1 ${isPlaying ? "animate-pulse-fast" : ""}`} />
      <div className={`blob blob-2 ${isPlaying ? "animate-pulse-fast" : ""}`} />
      <style>{`
        .blob-1 { background: #222; top: -10%; left: -10%; width: 50vw; height: 50vw; }
        .blob-2 { background: #111; bottom: -10%; right: -10%; width: 50vw; height: 50vw; }
        .animate-pulse-fast { animation: pulse 8s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
