import { useEffect, useRef } from "react";

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

const COLOR_CONFIG: Record<VisualizerColor, { color: string, glow: string }> = {
  white: { color: "#ffffff", glow: "rgba(255, 255, 255, 0.4)" },
  "neon-blue": { color: "#22d3ee", glow: "rgba(34, 211, 238, 0.5)" },
  "electric-purple": { color: "#ec4899", glow: "rgba(236, 72, 153, 0.5)" },
  "cyber-green": { color: "#34d399", glow: "rgba(52, 211, 153, 0.5)" },
  crimson: { color: "#f87171", glow: "rgba(248, 113, 113, 0.5)" },
  gold: { color: "#fbbf24", glow: "rgba(251, 191, 36, 0.5)" },
};

export default function Visualizer({ 
  isPlaying, 
  style = "bars", 
  color = "white", 
  scrollProgress, 
  particleSpeed = 1, 
  colorHue = 0, 
  patternComplexity = 3 
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const muffleFactorRef = useRef(1);

  useEffect(() => {
    if (!scrollProgress) return;
    const unsubscribe = scrollProgress.on("change", (latest: number) => {
      muffleFactorRef.current = latest > 0.1 ? Math.max(0.1, 1 - (latest * 1.5)) : 1;
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  const isInViewRef = useRef(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barCount = 48;
    let heights = Array.from({ length: barCount }, () => 2);
    let transientValues = Array.from({ length: barCount }, () => 0);
    let lastBeatTime = 0;
    let rafId: number;

    const draw = (time: number) => {
      if (!isInViewRef.current) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const { width, height: canvasHeight } = canvas;
      ctx.clearRect(0, 0, width, canvasHeight);

      const config = COLOR_CONFIG[color];
      const isWave = style === "wave";
      const isDots = style === "dots";
      const speedFactor = Math.max(0.5, Math.min(2, particleSpeed));
      const muffle = muffleFactorRef.current;

      const beatInterval = 468; 
      const isBeatHit = isPlaying && (time - lastBeatTime > beatInterval);
      if (isBeatHit) {
        lastBeatTime = time;
      }

      const spacing = 5.0;
      const barWidth = (width / barCount) - spacing;
      const midY = canvasHeight / 2;

      ctx.save();
      
      for (let i = 0; i < barCount; i++) {
        let h = heights[i];
        
        if (!isPlaying) {
          h += (1 - h) * 0.1;
        } else if (isWave) {
          const freq = 0.2;
          const amplitude = 25 * muffle;
          const offset = time * 0.005 * speedFactor;
          const target = 40 + Math.sin(i * freq + offset) * amplitude;
          h += (target - h) * 0.2;
        } else {
          let target = (3 + Math.random() * 20);
          if (Math.random() > 0.99) transientValues[i] = 60 + Math.random() * 30;
          if (isBeatHit && (i % 8 < 2)) target += (40 + Math.random() * 40);
          
          const result = Math.max(target, transientValues[i]) * muffle;
          transientValues[i] *= 0.8; 
          h += (result - h) * 0.4;
        }
        
        heights[i] = h;

        const x = i * (barWidth + spacing);
        const actualHeight = (h / 100) * canvasHeight;
        ctx.fillStyle = config.color;
        
        if (isDots) {
          ctx.globalAlpha = isPlaying ? (h / 100) * 0.6 + 0.3 * muffle : 0.2;
          const radius = Math.max(1, (h / 100) * 2);
          const yOffset = (h / 100) * 30;
          
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, midY - yOffset, radius, 0, Math.PI * 2);
          ctx.arc(x + barWidth / 2, midY + yOffset, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const halfHeight = Math.max(1, actualHeight / 2);
          ctx.globalAlpha = (h / 100) * 0.7 + 0.1;
          
          if (style === "bars") {
            ctx.fillRect(x, midY - halfHeight, barWidth, halfHeight * 2);
          } else {
            ctx.fillRect(x, canvasHeight - actualHeight, barWidth, actualHeight);
          }
        }
      }

      ctx.globalAlpha = 0.2 * muffle;
      ctx.fillStyle = config.color;
      ctx.fillRect(0, midY - 0.5, width, 1);

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, style, particleSpeed, color, colorHue, patternComplexity]);

  return (
    <div className="h-32 w-full max-w-2xl px-4 mb-10 overflow-hidden flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={128} 
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
