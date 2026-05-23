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
  const isInViewRef = useRef(true);
  const { scrollYProgress } = useScroll();
  const scrollValueRef = useRef(0);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollValueRef.current = latest;
  });

  const particles = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return []; // Save CPU on mobile
    const p: Particle[] = [];
    // Standard particles
    for (let i = 0; i < 15; i++) {
      p.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speedY: (Math.random() - 0.5) * 0.01,
        speedX: (Math.random() - 0.5) * 0.01,
        opacity: Math.random(),
        maxOpacity: 0.1 + Math.random() * 0.2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    // Larger motes
    for (let i = 0; i < 2; i++) {
        p.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 10 + 5,
            speedY: (Math.random() * 0.03) + 0.01,
            speedX: (Math.random() - 0.5) * 0.01,
            opacity: 0,
            maxOpacity: 0.03 + Math.random() * 0.05,
            pulseSpeed: 0.003 + Math.random() * 0.007,
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = isInViewRef.current;
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasInView) {
          rafId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const draw = (time: number) => {
      if (!isInViewRef.current) {
        return;
      }
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
          // Larger motes with simpler look for performance
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.4})`;
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fill();
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
