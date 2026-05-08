import { motion } from "motion/react";
import { useEffect, useState } from "react";

export type VisualizerStyle = "bars" | "dots" | "wave";
export type VisualizerColor = "white" | "neon-blue" | "electric-purple" | "cyber-green" | "crimson" | "gold";

interface VisualizerProps {
  isPlaying: boolean;
  style?: VisualizerStyle;
  color?: VisualizerColor;
  scrollProgress?: any;
  particleSpeed?: number;
  colorHue?: number;
  patternComplexity?: number;
}

const COLORS: Record<VisualizerColor, string> = {
  white: "bg-white",
  "neon-blue": "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]",
  "electric-purple": "bg-gradient-to-t from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
  "cyber-green": "bg-gradient-to-t from-green-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]",
  crimson: "bg-gradient-to-t from-red-600 to-orange-500 shadow-[0_0_15px_rgba(248,113,113,0.5)]",
  gold: "bg-gradient-to-t from-amber-600 to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]",
};

export default function Visualizer({ isPlaying, style = "bars", color = "white", scrollProgress, particleSpeed = 1, colorHue = 0, patternComplexity = 3 }: VisualizerProps) {
  const [bars, setBars] = useState(Array.from({ length: 64 }, () => 20));
  const [muffleFactor, setMuffleFactor] = useState(1);

  useEffect(() => {
    if (!scrollProgress) return;
    return scrollProgress.on("change", (latest: number) => {
      setMuffleFactor(latest > 0.1 ? Math.max(0.1, 1 - (latest * 1.5)) : 1);
    });
  }, [scrollProgress]);

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array.from({ length: 64 }, () => 15));
      return;
    }

    let lastTime = 0;
    let rafId: number;

    const update = (time: number) => {
      const isWave = style === "wave";
      const speedFactor = Math.max(0.5, Math.min(2, particleSpeed));
      if (time - lastTime > (isWave ? (50 / speedFactor) : (100 / speedFactor))) {
        setBars(prev => prev.map((_, i) => {
          if (isWave) {
             const freq = 0.05;
             const amplitude = 40 * muffleFactor;
             const offset = time * 0.005 * speedFactor;
             return 40 + Math.sin(i * freq + offset) * amplitude;
          }
          const base = 20 * muffleFactor;
          const random = isPlaying ? Math.random() * 80 * muffleFactor : 0;
          return base + random;
        }));
        lastTime = time;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, style, particleSpeed]);

  const colorClass = COLORS[color];
  const colorStyle = colorHue ? { filter: `hue-rotate(${colorHue}deg)` } : {};

  return (
    <div className="flex items-center justify-center gap-[2px] h-32 w-full max-w-2xl px-4 mb-20 overflow-hidden">
      {bars.slice(0, patternComplexity * 16).map((height, i) => (
        <motion.div
          key={i}
          animate={{
            height: style === "dots" ? "6px" : `${height}%`,
            opacity: isPlaying ? [0.6 * muffleFactor, 0.9 * muffleFactor, 0.6 * muffleFactor] : 0.2,
            scaleY: style === "dots" ? 1 : (height / 100 + 0.5) * muffleFactor,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            opacity: { duration: 1.5 / particleSpeed, repeat: Infinity, ease: "easeInOut", delay: i * 0.01 / particleSpeed }
          }}
          className={`${
            style === "dots" ? "w-1.5 h-1.5 rounded-full" : "w-[2px] rounded-full"
          } ${colorClass} transition-colors duration-500`}
          style={{
            transformOrigin: "bottom center",
            marginBottom: style === "dots" ? `${height / 2}%` : "0",
            ...colorStyle
          }}
        />
      ))}
    </div>
  );
}
