import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useMemo } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function AmbientParticles({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const scrollValueRef = useRef(0);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollValueRef.current = latest;
  });

  const particles = useMemo(() => {
    const p: Particle[] = [];
    // Standard particles
    for (let i = 0; i < 40; i++) {
      p.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speedY: (Math.random() - 0.5) * 0.02,
        speedX: (Math.random() - 0.5) * 0.02,
        opacity: Math.random(),
        maxOpacity: 0.1 + Math.random() * 0.3,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    // Larger motes
    for (let i = 0; i < 8; i++) {
        p.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 15 + 10,
            speedY: (Math.random() * 0.05) + 0.02,
            speedX: (Math.random() - 0.5) * 0.02,
            opacity: 0,
            maxOpacity: 0.05 + Math.random() * 0.1,
            pulseSpeed: 0.005 + Math.random() * 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    return p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const draw = (time: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const yOffset = scrollValueRef.current * -100;
      const playSpeed = isPlaying ? 1.5 : 1;

      particles.forEach((p) => {
        // Update position
        p.x += p.speedX * playSpeed;
        p.y += p.speedY * playSpeed;

        // Wrap around
        if (p.x < 0) p.x = 100;
        if (p.x > 100) p.x = 0;
        if (p.y < -10) p.y = 110;
        if (p.y > 110) p.y = -10;

        // Pulse opacity
        p.pulsePhase += p.pulseSpeed * playSpeed;
        const currentOpacity = p.maxOpacity * (0.5 + Math.sin(p.pulsePhase) * 0.5);

        const drawX = (p.x / 100) * width;
        const drawY = ((p.y / 100) * height) + yOffset;

        ctx.beginPath();
        // Use simpler draws for smaller particles
        if (p.size < 5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Larger motes with blur (simulated with gradient)
          const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.size);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(drawX - p.size, drawY - p.size, p.size * 2, p.size * 2);
        }
      });

      rafId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-50"
      />
    </div>
  );
}
